import pytest
from conftest import client, headers, headers_without_auth

def test_health_check(client):
    """Testa a rota de health check"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_current_user_unauthorized(client, headers_without_auth):
    """Testa acesso sem token de autenticação"""
    response = client.get("/api/v1/user/me", headers=headers_without_auth)
    assert response.status_code in [401, 422]

def test_get_current_user_invalid_token(client):
    """Testa acesso com token inválido"""
    invalid_headers = {
        "Authorization": "Bearer token_invalido",
        "Content-Type": "application/json"
    }
    response = client.get("/api/v1/user/me", headers=invalid_headers)
    assert response.status_code == 401