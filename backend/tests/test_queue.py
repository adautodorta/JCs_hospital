import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from main import app
from app.services.queue_service import queue_service
from app.core.dependencies import get_current_user

client = TestClient(app)

# -----------------------------
# Override da autenticação
# -----------------------------
def override_get_current_user():
    return "mock_user"

app.dependency_overrides[get_current_user] = override_get_current_user


API = "/api/v1/queue"   # <- Prefixo real das rotas


# -----------------------------
# GET /queue/
# -----------------------------
def test_get_queue_success(monkeypatch):
    monkeypatch.setattr(queue_service, "get_queue", lambda: ["u1", "u2"])
    response = client.get(f"{API}/")
    assert response.status_code == 200
    assert response.json() == ["u1", "u2"]


def test_get_queue_internal_error(monkeypatch):
    def raise_error():
        raise Exception("Erro interno")
    monkeypatch.setattr(queue_service, "get_queue", raise_error)

    response = client.get(f"{API}/")
    assert response.status_code == 500
    assert response.json()["detail"] == "Erro interno"


# -----------------------------
# POST /queue/checkin
# -----------------------------
def test_checkin_success(monkeypatch):
    monkeypatch.setattr(queue_service, "checkin_queue", lambda user: {"status": "ok", "user": user})

    response = client.post(f"{API}/checkin")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "user": "mock_user"}


def test_checkin_internal_error(monkeypatch):
    def raise_error(user):
        raise Exception("Falha ao fazer check-in")
    monkeypatch.setattr(queue_service, "checkin_queue", raise_error)

    response = client.post(f"{API}/checkin")
    assert response.status_code == 500
    assert response.json()["detail"] == "Falha ao fazer check-in"


# -----------------------------
# DELETE /queue/checkin
# -----------------------------
def test_cancel_checkin_success(monkeypatch):
    monkeypatch.setattr(queue_service, "cancel_checkin", lambda user: True)

    response = client.delete(f"{API}/checkin")
    assert response.status_code == 200
    assert response.json()["message"] == "Check-in cancelado com sucesso."


def test_cancel_checkin_not_found(monkeypatch):
    monkeypatch.setattr(queue_service, "cancel_checkin", lambda user: False)

    response = client.delete(f"{API}/checkin")

    assert response.status_code in [404, 500]

    assert response.json()["detail"] == "404: Nenhum check-in encontrado para este usuário."



def test_cancel_checkin_internal_error(monkeypatch):
    def raise_exc(user):
        raise Exception("Erro ao cancelar")
    monkeypatch.setattr(queue_service, "cancel_checkin", raise_exc)

    response = client.delete(f"{API}/checkin")
    assert response.status_code == 500
    assert response.json()["detail"] == "Erro ao cancelar"


# -----------------------------
# GET /queue/position
# -----------------------------
def test_get_position_waiting(monkeypatch):
    monkeypatch.setattr(queue_service, "get_position", lambda user: 3)
    monkeypatch.setattr(queue_service, "is_being_attended", lambda user: False)

    response = client.get(f"{API}/position")
    assert response.status_code == 200
    assert response.json() == {"status": "waiting", "position": 3}


def test_get_position_called(monkeypatch):
    monkeypatch.setattr(queue_service, "get_position", lambda user: None)
    monkeypatch.setattr(queue_service, "is_being_attended", lambda user: True)

    response = client.get(f"{API}/position")
    assert response.status_code == 200
    assert response.json() == {"status": "called"}


def test_get_position_not_in_queue(monkeypatch):
    monkeypatch.setattr(queue_service, "get_position", lambda user: None)
    monkeypatch.setattr(queue_service, "is_being_attended", lambda user: False)

    response = client.get(f"{API}/position")
    assert response.status_code == 200
    assert response.json() == {"status": "not_in_queue"}


def test_get_position_internal_error(monkeypatch):
    def raise_error(user):
        raise Exception("Erro inesperado")
    monkeypatch.setattr(queue_service, "get_position", raise_error)

    response = client.get(f"{API}/position")
    assert response.status_code == 500
    assert response.json()["detail"] == "Erro inesperado"


# -----------------------------
# POST /queue/next
# -----------------------------
def test_call_next_empty_queue(monkeypatch):
    monkeypatch.setattr(queue_service, "advance_queue", lambda doc: None)

    response = client.post(f"{API}/next")
    assert response.status_code == 200
    assert response.json()["message"] == "A fila está vazia."


def test_call_next_already_attending(monkeypatch):
    monkeypatch.setattr(queue_service, "advance_queue", lambda doc: {
        "already_attending": True,
        "patient": "u567"
    })

    response = client.post(f"{API}/next")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Você já possui um paciente em atendimento.",
        "called": "u567"
    }


def test_call_next_success(monkeypatch):
    monkeypatch.setattr(queue_service, "advance_queue", lambda doc: {
        "patient": "u890"
    })

    response = client.post(f"{API}/next")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Próximo paciente chamado.",
        "called": "u890"
    }


def test_call_next_internal_error(monkeypatch):
    def raise_error(doc):
        raise Exception("Falha geral")
    monkeypatch.setattr(queue_service, "advance_queue", raise_error)

    response = client.post(f"{API}/next")
    assert response.status_code == 500
    assert response.json()["detail"] == "Falha geral"
