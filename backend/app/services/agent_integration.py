# app/services/agent_integration.py
from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

es = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTICSEARCH_API_KEY")
)

AGENT_ID = os.getenv("ELASTIC_AGENT_ID", "secondhandhero_smartmatcher")

async def get_agent_explanation(item: dict, request: dict) -> dict:
    """
    Call the Elastic agent using the existing ES connection + agent ID.
    Returns AI match explanation to attach to the match result.
    """
    prompt = f"""
    Please evaluate this match:

    Donated Item:
    - Name: {item.get('name')}
    - Category: {item.get('category')}
    - Grade: {item.get('grade')}
    - School: {item.get('school')}
    - Description: {item.get('description')}

    Student Request:
    - Category: {request.get('category')}
    - School: {request.get('school')}
    - Urgency: {request.get('urgency')}

    Return your assessment in JSON format as per your instructions.
    """

    try:
        response = es.perform_request(
            method="POST",
            path=f"/_inference/chat_completion/{AGENT_ID}/_stream",
            headers={"Content-Type": "application/json"},  # ADD THIS
            body={
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )
        return {"agent_explanation": response.get("choices", [{}])[0].get("message", {}).get("content", "")}
    except Exception as e:
        print(f"⚠️ Agent call failed (non-blocking): {e}")
        return {"agent_explanation": None}
