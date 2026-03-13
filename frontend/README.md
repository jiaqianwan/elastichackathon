🦸‍♂️ SecondHand Hero
Bridging the participation gap and ending the graduation waste cycle.

SecondHand Hero is a community-driven platform designed to remove the stigma of "hand-me-downs" through AI Quality Grading and Dignified Distribution. We help students access verified CCA gear and school essentials while promoting a circular "Kampong Spirit" economy.

🚀 Quick Start (For Developers & Judges)
1. Prerequisites
Node.js (v18+)

Python (3.9+)

GitHub Access: Ensure you have accepted the collaborator invite.

Credentials: A .env file in the /backend folder with valid AWS and Elasticsearch keys.

2. Frontend Setup (React + Tailwind v4)
PowerShell
cd frontend
npm install        # Installs React, Lucide, and Tailwind v4
npm run dev        # Starts the Vite dev server at http://localhost:5173
3. Backend Setup (FastAPI + AI)
PowerShell
cd backend
python -m venv venv           # Create virtual environment
.\venv\Scripts\activate       # Activate (Windows)
[cite_start]pip install -r requirements.txt # Install dependencies [cite: 1]
uvicorn main:app --reload     # Start the API at http://localhost:8000
🛠️ The Tech Stack
Frontend: React.js with Tailwind CSS v4 for a high-quality, modern UI.

Backend: FastAPI (Python) for high-performance asynchronous processing.

AI Brain: Amazon Bedrock (Claude 3) for automated item quality grading and dignity checks.

Search: Elasticsearch for predictive matching between donors and recipients.

Distribution: Secure, private QR-code generation for "Dignified Pickups".

✨ Key Features
AI Quality Grading: Snap a photo, and our AI ensures the item is "Hero Quality," assigning a Grade A/B status to maintain dignity.

Impact Dashboard: Real-time tracking of CO2 saved and peer wealth generated.

Private Collection: QR codes enable students to collect items from lockers discreetly, removing the "charity" stigma.

🤝 Troubleshooting
If you encounter a "Repository not found" error when cloning:

Ensure you are authenticated in your terminal.

If using HTTPS, use a Personal Access Token (PAT) instead of your password.

Recommended: Use GitHub Desktop for a seamless, browser-based login exper