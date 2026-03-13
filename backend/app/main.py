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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting SecondHand Hero API...")
    
    # Check Elasticsearch connection
    es_healthy = False
    if check_elasticsearch_connection():
        logger.info("✅ Elasticsearch connected")
        es_healthy = True
        # Initialize indices if they don't exist
        if initialize_indices():
            logger.info("✅ All indices initialized")
        else:
            logger.warning("⚠️ Some indices failed to initialize")
    else:
        logger.error("❌ Elasticsearch connection failed - API may not function properly")
    
    # Check AI Agent status
    if es_healthy:
        agent_status = check_ai_agent_health()
        if agent_status['available'] and agent_status['enabled']:
            logger.info(f"✅ AI Agent '{agent_status['agent_id']}' is ready")
        elif agent_status['enabled']:
            logger.warning(f"⚠️ AI Agent '{agent_status['agent_id']}' is enabled but unavailable - using demo mode")
        else:
            logger.info("ℹ️ AI Agent disabled - running in demo mode")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down SecondHand Hero API...")

# Initialize FastAPI app
app = FastAPI(
    title="SecondHand Hero API",
    description="AI-powered platform for dignified school equipment redistribution",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
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

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests with timing"""
    start_time = time.time()
    
    # Log request
    logger.info(f"📥 {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log response
    logger.info(
        f"📤 {request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {duration:.3f}s"
    )
    
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler for unhandled errors"""
    logger.error(f"❌ Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else "An error occurred"
        }
    )

# Include API routers
app.include_router(
    donations.router, 
    prefix="/api/donations", 
    tags=["Donations"]
)
app.include_router(
    matches.router, 
    prefix="/api/matches", 
    tags=["Matches"]
)
app.include_router(
    distribution.router, 
    prefix="/api/distribution", 
    tags=["Distribution"]
)

# Root endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API status"""
    return {
        "message": "SecondHand Hero Backend is Live 🎒",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Comprehensive health check for all services"""
    
    # Check Elasticsearch
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
    
    # Check AI Agent
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
    
    # Determine overall status and messages
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

# API Info endpoint
@app.get("/api/info", tags=["Health"])
async def api_info():
    """Get API information and available endpoints"""
    
    # Get AI Agent status for feature list
    agent_status = check_ai_agent_health()
    ai_mode = "Elastic AI Agent" if (agent_status['enabled'] and agent_status['available']) else "Demo Mode"
    
    return {
        "name": "SecondHand Hero API",
        "version": "1.0.0",
        "description": "AI-powered platform for dignified school equipment redistribution",
        "endpoints": {
            "donations": {
                "grade": "POST /api/donations/grade",
                "list": "GET /api/donations"
            },
            "matches": {
                "find": "GET /api/matches",
                "create": "POST /api/matches"
            },
            "distribution": {
                "qr_code": "GET /api/distribution/qr/{item_id}"
            }
        },
        "features": [
            f"AI-powered quality grading ({ai_mode})",
            "Smart matching algorithm (Elasticsearch)",
            "QR code generation for collection",
            "CO2 impact tracking",
            "Dignity-first donation verification"
        ],
        "ai_agent": {
            "enabled": agent_status['enabled'],
            "available": agent_status['available'],
            "agent_id": agent_status.get('agent_id'),
            "mode": "ai" if (agent_status['enabled'] and agent_status['available']) else "demo"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }

# Debug endpoint to check indices
@app.get("/api/debug/indices", tags=["Debug"])
async def list_indices():
    """List all Elasticsearch indices (for debugging)"""
    try:
        from app.db.elasticsearch import es_client
        indices = es_client.cat.indices(format='json')
        
        # Filter and format indices
        formatted_indices = []
        for idx in indices:
            if not idx['index'].startswith('.'):  # Hide system indices
                formatted_indices.append({
                    "name": idx['index'],
                    "health": idx['health'],
                    "status": idx['status'],
                    "docs_count": idx.get('docs.count', '0'),
                    "store_size": idx.get('store.size', '0b'),
                    "pri": idx.get('pri', '1'),
                    "rep": idx.get('rep', '1')
                })
        
        return {
            "status": "success",
            "count": len(formatted_indices),
            "indices": formatted_indices
        }
    except Exception as e:
        logger.error(f"Failed to list indices: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# Debug endpoint to check AI Agent
@app.get("/api/debug/agent", tags=["Debug"])
async def check_agent():
    """Check AI Agent status and configuration"""
    agent_status = check_ai_agent_health()
    
    return {
        "status": "success",
        "agent": agent_status,
        "environment": {
            "USE_AI_ASSISTANT": os.getenv('USE_AI_ASSISTANT', 'false'),
            "AGENT_ID": os.getenv('AGENT_ID', 'secondhandhero_itemgrader')
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