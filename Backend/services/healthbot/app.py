from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import json
from typing import Optional
from utils.clarify import build_clarification
from utils.confidence import assess_confidence
from utils.nlp import analyze_text
from utils.response import build_response
from utils.session import (
    get_session as get_session_state,
    update_session as update_session_state,
    create_new_session,
    add_chat_message,
    get_chat_history,
    is_session_expired,
    cleanup_expired_sessions,
)
from utils.context import merge_context
from utils.followup import (
    generate_followup,
    get_session_summary,
    check_previous_context,
)
from utils.llm import enhance_response, is_llm_available, get_available_models
from utils.database import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HealthBot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()

with open("rules/symptoms.json") as f:
    rules = json.load(f)

with open("rules/emergencies.json") as f:
    emergencies = json.load(f)


class ChatRequest(BaseModel):
    user_input: str
    session_id: str
    user_id: Optional[str] = None


class SessionRequest(BaseModel):
    session_id: str
    user_id: Optional[str] = None


@app.get("/")
def root():
    return {
        "name": "Swasthya Mitra HealthBot",
        "version": "2.0",
        "features": [
            "rule-based responses",
            "llm_enhancement",
            "session_management",
            "follow_up_intelligence",
            "expanded_symptoms_db",
        ],
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "llm_available": is_llm_available(),
        "llm_models": get_available_models(),
        "symptoms_count": len(rules),
        "emergencies_count": len(emergencies),
    }


@app.post("/session/create")
def create_session_endpoint(req: SessionRequest):
    create_new_session(req.session_id, req.user_id)
    return {"status": "created", "session_id": req.session_id}


@app.get("/session/{session_id}")
def get_session_info(session_id: str):
    session = get_session_state(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return get_session_summary(session_id)


@app.get("/session/{session_id}/history")
def get_history(session_id: str, limit: int = 20):
    return {"history": get_chat_history(session_id, limit)}


@app.post("/cleanup")
def cleanup_sessions_endpoint():
    deleted = cleanup_expired_sessions()
    return {"status": "completed", "sessions_cleaned": deleted}


@app.post("/chat")
def chat(req: ChatRequest):
    user_input = req.user_input
    session_id = req.session_id
    user_id = req.user_id

    session = get_session_state(session_id)

    if not session:
        create_new_session(session_id, user_id)
        session = get_session_state(session_id)

    context = session.get("context", {}) if session else {}

    new_nlp = analyze_text(user_input)
    merged_context = merge_context(context, new_nlp)
    merged_context["last_intent"] = new_nlp.get("intent", "unknown")

    history = get_chat_history(session_id, limit=20)

    add_chat_message(session_id, "user", user_input)

    confidence = assess_confidence(merged_context, rules)

    if confidence == "low":
        response = build_clarification(
            merged_context, session.get("context", {}) if session else {}
        )

        if is_llm_available():
            response = enhance_response(
                response,
                user_input,
                context=merged_context,
                conversation_history=history,
            )
    else:
        response = build_response(merged_context, rules, emergencies)

        if is_llm_available():
            response = enhance_response(
                response,
                user_input,
                context=merged_context,
                conversation_history=history,
            )

    add_chat_message(session_id, "assistant", response.get("message", ""))

    update_session_state(session_id, merged_context, user_id)

    if confidence != "low":
        followup = generate_followup(session_id, new_nlp.get("intent"))
        if followup:
            response["followup"] = followup

    return response


@app.post("/chat/clarify")
def clarify(req: ChatRequest):
    session = get_session_state(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    context = session.get("context", {})
    new_nlp = analyze_text(req.user_input)
    merged = merge_context(context, new_nlp)

    response = build_response(merged, rules, emergencies)

    add_chat_message(req.session_id, "user", req.user_input)
    add_chat_message(req.session_id, "assistant", response.get("message", ""))

    update_session_state(req.session_id, merged, req.user_id)

    if is_llm_available():
        response = enhance_response(
            response,
            req.user_input,
            context=merged,
            conversation_history=get_chat_history(req.session_id, limit=20),
        )

    return response
