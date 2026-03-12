from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import donations, matches, distribution

app = FastAPI(title="SecondHand Hero API")

# Allow your Vite frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes from your project structure [cite: 34, 35, 36]
app.include_router(donations.router, prefix="/api/donations", tags=["Donations"])
app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])
app.include_router(distribution.router, prefix="/api/distribution", tags=["Distribution"])

@app.get("/")
async def root():
    return {"message": "SecondHand Hero Backend is Live"}