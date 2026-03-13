from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
import os
from app.api import donations, matches, distribution
from app.db.elasticsearch import check_elasticsearch_connection, initialize_indices
from app.services.elastic_ai_agent import check_ai_agent_health
from app.services.match_engine import setup_matching_indices
from app.api.distribution import setup_lockers_index

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    logger.info("🚀 Starting SecondHand Hero API...")
    
    es_healthy = False
    if check_elasticsearch_connection():
        logger.info("✅ Elasticsearch connected")
        es_healthy = True

        if initialize_indices():
            logger.info("✅ All indices initialized")
        else:
            logger.warning("⚠️ Some indices failed to initialize")

        # Initialize matching indices (item_requests, matches)
        try:
            setup_matching_indices()
            logger.info("✅ Matching indices ready")
        except Exception as e:
            logger.warning(f"⚠️ Matching indices setup failed: {e}")

        # Initialize lockers index
        try:
            setup_lockers_index()
            logger.info("✅ Lockers index ready")
        except Exception as e:
            logger.warning(f"⚠️ Lockers index setup failed: {e}")

    else:
        logger.error("❌ Elasticsearch connection failed - API may not function properly")

    if es_healthy:
        agent_status = check_ai_agent_health()
        if agent_status['available'] and agent_status['enabled']:
            logger.info(f"✅ AI Agent '{agent_status['agent_id']}' is ready")
        elif agent_status['enabled']:
            logger.warning(f"⚠️ AI Agent '{agent_status['agent_id']}' is enabled but unavailable - using demo mode")
        else:
            logger.info("ℹ️ AI Agent disabled - running in demo mode")

    yield

    logger.info("🛑 Shutting down SecondHand Hero API...")


app = FastAPI(
    title="SecondHand Hero API",
    description="AI-powered platform for dignified school equipment redistribution",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"📥 {request.method} {request.url.path}")
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        f"📤 {request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {duration:.3f}s"
    )
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else "An error occurred"
        }
    )

app.include_router(donations.router,    prefix="/api/donations",    tags=["Donations"])
app.include_router(matches.router,      prefix="/api/matches",      tags=["Matches"])
app.include_router(distribution.router, prefix="/api/distribution", tags=["Distribution"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "SecondHand Hero Backend is Live 🎒",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    elasticsearch_status = {"status": "unknown", "connected": False}
    try:
        from app.db.elasticsearch import es_client
        info = es_client.info()
        elasticsearch_status = {
            "status": "healthy",
            "connected": True,
            "cluster_name": info.get('cluster_name'),
            "version": info.get('version', {}).get('number')
        }
    except Exception as e:
        elasticsearch_status = {
            "status": "unhealthy",
            "connected": False,
            "error": str(e)
        }

    agent_status = check_ai_agent_health()

    health_data = {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "api": {"status": "healthy"},
            "elasticsearch": elasticsearch_status,
            "ai_agent": {
                "status": "healthy" if agent_status['available'] else "degraded",
                "enabled": agent_status['enabled'],
                "available": agent_status['available'],
                "agent_id": agent_status.get('agent_id'),
                "mode": "ai" if (agent_status['enabled'] and agent_status['available']) else "demo"
            }
        }
    }

    messages = []
    if elasticsearch_status["status"] != "healthy":
        health_data["status"] = "unhealthy"
        messages.append("Elasticsearch unavailable - API cannot function")
    elif not agent_status["available"] and agent_status["enabled"]:
        health_data["status"] = "degraded"
        messages.append(f"AI Agent '{agent_status.get('agent_id')}' unavailable - using demo mode")
    elif not agent_status["enabled"]:
        messages.append("Running in demo mode (AI Agent disabled)")

    if messages:
        health_data["message"] = " | ".join(messages)

    return health_data

@app.get("/api/info", tags=["Health"])
async def api_info():
    agent_status = check_ai_agent_health()
    ai_mode = "Elastic AI Agent" if (agent_status['enabled'] and agent_status['available']) else "Demo Mode"

    return {
        "name": "SecondHand Hero API",
        "version": "1.0.0",
        "description": "AI-powered platform for dignified school equipment redistribution",
        "endpoints": {
            "donations": {
                "grade": "POST /api/donations/grade",
                "list":  "GET /api/donations"
            },
            "matches": {
                "search":     "GET /api/matches/search",
                "request":    "POST /api/matches/request",
                "my_matches": "GET /api/matches/my-matches/{user_id}",
                "batch":      "POST /api/matches/run-batch",
            },
            "distribution": {
                "lockers":  "GET /api/distribution/lockers",
                "request":  "POST /api/distribution/request/{item_id}",
                "collect":  "POST /api/distribution/collect/{item_id}",
            }
        },
        "features": [
            f"AI-powered quality grading ({ai_mode})",
            "Smart matching algorithm (Elasticsearch)",
            "QR code generation for private collection",
            "Locker reservation system",
            "CO2 impact tracking",
            "Dignity-first donation verification"
        ],
        "ai_agent": {
            "enabled":   agent_status['enabled'],
            "available": agent_status['available'],
            "agent_id":  agent_status.get('agent_id'),
            "mode":      "ai" if (agent_status['enabled'] and agent_status['available']) else "demo"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc":   "/redoc"
        }
    }

@app.get("/api/debug/indices", tags=["Debug"])
async def list_indices():
    try:
        from app.db.elasticsearch import es_client
        indices = es_client.cat.indices(format='json')
        formatted_indices = []
        for idx in indices:
            if not idx['index'].startswith('.'):
                formatted_indices.append({
                    "name":       idx['index'],
                    "health":     idx['health'],
                    "status":     idx['status'],
                    "docs_count": idx.get('docs.count', '0'),
                    "store_size": idx.get('store.size', '0b'),
                    "pri":        idx.get('pri', '1'),
                    "rep":        idx.get('rep', '1')
                })
        return {"status": "success", "count": len(formatted_indices), "indices": formatted_indices}
    except Exception as e:
        logger.error(f"Failed to list indices: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/debug/agent", tags=["Debug"])
async def check_agent():
    agent_status = check_ai_agent_health()
    return {
        "status": "success",
        "agent": agent_status,
        "environment": {
            "USE_AI_ASSISTANT": os.getenv('USE_AI_ASSISTANT', 'false'),
            "AGENT_ID":         os.getenv('AGENT_ID', 'secondhandhero_itemgrader')
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_exclude=["venv/*", "*.pyc", "__pycache__"],
        log_level="info"
    )