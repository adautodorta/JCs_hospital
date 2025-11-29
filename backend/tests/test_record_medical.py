import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import MagicMock
from app.services.record_medical_service import MedicalRecordService
from app.core.dependencies import get_current_user

client = TestClient(app)

# Override da autenticação
def override_get_current_user():
    return "mock_user"

app.dependency_overrides[get_current_user] = override_get_current_user

API = "/api/v1/records"


# -------------------------------------
# GET /records/
# -------------------------------------
def test_list_all_records_success(monkeypatch):
    monkeypatch.setattr(MedicalRecordService, "list_all", lambda self: [{"id": 1}, {"id": 2}])

    response = client.get(f"{API}/")
    assert response.status_code == 200
    assert response.json() == [{"id": 1}, {"id": 2}]

# -------------------------------------
# GET /records/me
# -------------------------------------
def test_list_my_records_success(monkeypatch):
    monkeypatch.setattr(
        MedicalRecordService,
        "list_by_profile",
        lambda self, uid: [{"rec": "r1", "user": uid}]
    )

    response = client.get(f"{API}/me")
    assert response.status_code == 200
    assert response.json() == [{"rec": "r1", "user": "mock_user"}]

# -------------------------------------
# GET /records/by_patient/{patient_id}
# -------------------------------------
def test_list_records_by_patient_success(monkeypatch):
    monkeypatch.setattr(
        MedicalRecordService,
        "list_by_profile",
        lambda self, pid: [{"rec": "abc", "user": pid}]
    )

    response = client.get(f"{API}/by_patient/p123")
    assert response.status_code == 200
    assert response.json() == [{"rec": "abc", "user": "p123"}]

def test_list_records_by_patient_error(monkeypatch):
    def raise_exc(self, pid):
        raise Exception("Erro ao buscar paciente")

    monkeypatch.setattr(MedicalRecordService, "list_by_profile", raise_exc)

    response = client.get(f"{API}/by_patient/p123")
    assert response.status_code == 500
    assert response.json()["detail"] == "Erro ao buscar paciente"

# -------------------------------------
# GET /records/{record_id}
# -------------------------------------
def test_get_record_success(monkeypatch):
    monkeypatch.setattr(
        MedicalRecordService,
        "get_by_id",
        lambda self, rid: {"id": rid, "ok": True}
    )

    response = client.get(f"{API}/abc123")
    assert response.status_code == 200
    assert response.json() == {"id": "abc123", "ok": True}


def test_get_record_not_found(monkeypatch):
    monkeypatch.setattr(
        MedicalRecordService,
        "get_by_id",
        lambda self, rid: None
    )

    response = client.get(f"{API}/abc123")
    assert response.status_code == 404
    assert response.json()["detail"] == "Record not found"
