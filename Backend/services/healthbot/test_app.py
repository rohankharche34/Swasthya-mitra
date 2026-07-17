import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(__file__))
from app import app

client = TestClient(app)

@pytest.fixture
def mock_db(monkeypatch):
    import app as m

    def get_session_none(session_id):
        return None

    def create_session_noop(session_id, user_id=None):
        pass

    def update_session_noop(session_id, context, user_id=None):
        pass

    def add_message_noop(session_id, role, content):
        pass

    def get_history_empty(session_id, limit=20):
        return []

    def cleanup_zero():
        return 0

    monkeypatch.setattr(m, "get_session_state", get_session_none)
    monkeypatch.setattr(m, "create_new_session", create_session_noop)
    monkeypatch.setattr(m, "update_session_state", update_session_noop)
    monkeypatch.setattr(m, "add_chat_message", add_message_noop)
    monkeypatch.setattr(m, "get_chat_history", get_history_empty)
    monkeypatch.setattr(m, "cleanup_expired_sessions", cleanup_zero)


@pytest.fixture
def mock_llm(monkeypatch):
    import app as m

    def llm_off():
        return False

    monkeypatch.setattr(m, "is_llm_available", llm_off)


@pytest.fixture
def mock_nlp(monkeypatch):
    import app as m

    def analyze_headache(text):
        return {
            "symptoms": ["headache"],
            "negations": [],
            "duration": 2,
            "severity": "moderate",
            "urgency": "low",
            "intent": "symptom_check",
            "medical_entities": [],
            "raw_text": text,
        }

    monkeypatch.setattr(m, "analyze_text", analyze_headache)


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert "HealthBot" in r.json()["name"]


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_create_session(mock_db):
    r = client.post("/session/create", json={"session_id": "s1", "user_id": "u1"})
    assert r.status_code == 200
    assert r.json()["status"] == "created"


def test_get_session_not_found(mock_db):
    r = client.get("/session/missing")
    assert r.status_code == 404


def test_chat_symptom_report(mock_db, mock_nlp, mock_llm):
    r = client.post(
        "/chat", json={"user_input": "I have a headache", "session_id": "s1"}
    )
    assert r.status_code == 200
    assert "risk" in r.json()


def test_chat_clarification(mock_db, mock_llm, monkeypatch):
    import app as m

    def analyze_nothing(text):
        return {
            "symptoms": [],
            "negations": [],
            "duration": None,
            "severity": "unknown",
            "urgency": "low",
            "intent": "unknown",
            "medical_entities": [],
            "raw_text": text,
        }

    def get_session_existing(session_id):
        return {"session_id": session_id, "context": {}}

    monkeypatch.setattr(m, "analyze_text", analyze_nothing)
    monkeypatch.setattr(m, "get_session_state", get_session_existing)

    r = client.post("/chat", json={"user_input": "hello", "session_id": "s1"})
    assert r.status_code == 200
    assert r.json().get("type") == "clarification"
