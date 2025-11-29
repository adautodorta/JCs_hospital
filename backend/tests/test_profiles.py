import pytest
from main import app
from app.core.dependencies import get_current_user
from app.services.profile_service import profile_service

from conftest import client, headers, headers_without_auth


# -------------------------
# GET /profiles/
# -------------------------
def test_get_all_profiles_success(client):
    """Testa retorno bem-sucedido da lista de perfis"""
    response = client.get("/api/v1/profiles/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_all_profiles_internal_error(monkeypatch, client):
    """Simula erro interno no service (500)"""

    def mock_fail():
        raise Exception("Erro interno simulado")

    monkeypatch.setattr(profile_service, "get_all_profiles", mock_fail)

    response = client.get("/api/v1/profiles/")
    assert response.status_code == 500
    assert "Erro interno simulado" in response.json()["detail"]


# -------------------------
# GET /profiles/me
# -------------------------
def test_get_my_profile_success(client):
    """Testa obter perfil do usuário autenticado (com override do get_current_user)"""

    # Mock do user_id retornado pelo get_current_user
    app.dependency_overrides[get_current_user] = lambda: "mock_user_123"

    def mock_profile(user_id):
        return {"id": user_id, "name": "Usuário Teste"}

    # Substitui função real por mock
    original = profile_service.get_profile
    profile_service.get_profile = mock_profile

    response = client.get("/api/v1/profiles/me")

    assert response.status_code == 200
    assert response.json()["id"] == "mock_user_123"
    assert response.json()["name"] == "Usuário Teste"

    # Limpa overrides
    app.dependency_overrides.clear()
    profile_service.get_profile = original


def test_get_my_profile_unauthorized(client, headers_without_auth):
    """Testa acesso sem token (401 ou 422 dependendo do Supabase)"""
    response = client.get("/api/v1/profiles/me", headers=headers_without_auth)
    assert response.status_code in [401, 422]


def test_get_my_profile_invalid_token(client):
    """Testa token inválido"""
    invalid_headers = {
        "Authorization": "Bearer token_invalido",
        "Content-Type": "application/json",
    }
    response = client.get("/api/v1/profiles/me", headers=invalid_headers)
    assert response.status_code == 401


def test_get_my_profile_not_found(client):
    """Testa quando o usuário existe mas o perfil não existe"""

    app.dependency_overrides[get_current_user] = lambda: "mock_user_sem_perfil"

    def mock_none(_):
        return None

    original = profile_service.get_profile
    profile_service.get_profile = mock_none

    response = client.get("/api/v1/profiles/me")

    assert response.status_code in [404, 500]
    # assert response.json()["detail"] == "Profile not found"

    app.dependency_overrides.clear()
    profile_service.get_profile = original


# -------------------------
# GET /profiles/{id}
# -------------------------
def test_get_profile_by_id_success(client):
    """Testa perfil encontrado por ID"""

    def mock_profile(_id):
        return {"id": _id, "name": "Perfil AAA"}

    original = profile_service.get_profile
    profile_service.get_profile = mock_profile

    response = client.get("/api/v1/profiles/123")
    assert response.status_code == 200
    assert response.json()["id"] == "123"

    profile_service.get_profile = original


def test_get_profile_by_id_not_found(client):
    """Testa perfil inexistente"""

    def mock_none(_):
        return None

    original = profile_service.get_profile
    profile_service.get_profile = mock_none

    response = client.get("/api/v1/profiles/999")
    assert response.status_code in [404, 500]
    assert "Profile not found" in response.json()["detail"]

    profile_service.get_profile = original


def test_get_profile_by_id_internal_error(monkeypatch, client):
    """Simula erro interno (500)"""

    def mock_fail(_):
        raise Exception("Falha geral")

    monkeypatch.setattr(profile_service, "get_profile", mock_fail)

    response = client.get("/api/v1/profiles/10")

    assert response.status_code == 500
    assert "Falha geral" in response.json()["detail"]
