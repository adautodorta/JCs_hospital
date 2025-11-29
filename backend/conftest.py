import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from main import app

# ============================================
# CONFIGURAÇÃO DO TOKEN BEARER
# ============================================
# Substitua este valor pelo token Bearer que você obtém do frontend
# Formato: "Bearer seu_token_aqui"
BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6Im03ZGdGZWJxUnljbjhkbSsiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3JlYnR2ZXhyYnN3aXZzY2p1bXRyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3YzhjOTIyNy1jNGVjLTQxNWEtYWYyZS1hNWE3ODZmNWZlNjciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0NDM4NzM1LCJpYXQiOjE3NjQ0MzUxMzUsImVtYWlsIjoiYWRhdXRvZG9ydGFAamNzaG9zcGl0YWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImFkYXV0b2RvcnRhQGpjc2hvc3BpdGFsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjdjOGM5MjI3LWM0ZWMtNDE1YS1hZjJlLWE1YTc4NmY1ZmU2NyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzY0NDM1MTM1fV0sInNlc3Npb25faWQiOiI3NzUwZTc3Ny1jYmZkLTRjOWQtODk5Zi1jOGFkYTU2NjY0ODMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.grTeuFqlmmumev6OK5yW-tOmQhlbM7W6L30hslWFH-g"


@pytest.fixture
def client():
    """Cliente de teste síncrono para requisições HTTP"""
    return TestClient(app)

@pytest.fixture
def headers():
    """Headers padrão com autenticação Bearer"""
    return {
        "Authorization": BEARER_TOKEN,
        "Content-Type": "application/json"
    }

@pytest.fixture
def headers_without_auth():
    """Headers sem autenticação para testar rotas não autenticadas"""
    return {
        "Content-Type": "application/json"
    }