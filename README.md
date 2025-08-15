# 🧠 Saphron Quore: Quantum-Inspired Adaptive Learning System

An interactive web-based adaptive learning platform that combines **Deep Q-Learning (DQN)** with a **quantum-inspired TEBD (Time-Evolving Block Decimation)** algorithm to recommend the most effective questions to users based on their evolving mastery. The system features a modern React frontend and a Flask backend, with real-time progress tracking and a dynamic dashboard.

<img width="1470" height="760" alt="Screenshot 2025-08-15 at 1 32 51 PM" src="https://github.com/user-attachments/assets/1fa571a5-2c2e-418f-921e-d3e6d0d3be4b" />
<img width="1463" height="767" alt="Screenshot 2025-08-15 at 1 33 14 PM" src="https://github.com/user-attachments/assets/5844857d-dea8-4671-bbdc-8aa70fbedf3c" />

---

## Features

- **Quantum-Inspired Reinforcement Learning**: Combines DQN and TEBD for intelligent, non-repetitive question selection
- **Dynamic Dashboard**: See your overall mastery, recent quiz activity, and profile stats update in real time
- **Real-time Progress Tracking**: Visualize your mastery across all topics as you answer questions
- **Modern UI**: Responsive, accessible React interface with shadcn/ui, Tailwind CSS, and beautiful animations
- **Learning Analytics**: Track your accuracy, topic strengths, and session history
- **Adaptive Question Selection**: Questions adapt to your current knowledge state and learning needs

---

## Architecture

- **Frontend**: React 19, shadcn/ui, Tailwind CSS, Recharts, Axios
- **Backend**: Flask, TensorFlow, Quimb (quantum computing), NumPy
- **AI/ML**: Deep Q-Learning agent with TEBD-based action selection

---

## Project Structure

```
saphron-quore-new-copy/
├── saphron/
│   ├── frontend/           # React frontend (UI, dashboard, quiz)
│   └── rl_agent_engine/    # Flask backend (API, DQN+TEBD logic)
├── README.md               # (this file)
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- Python 3.8+

### 1. Install Python backend dependencies
```bash
cd saphron/rl_agent_engine
pip install -r requirements.txt
```

### 2. Install frontend dependencies
```bash
cd ../../saphron/frontend
npm install
```

### 3. Run the backend (Flask API)
```bash
cd ../rl_agent_engine
python api_server.py
# Runs on http://localhost:5001
```

### 4. Run the frontend (React app)
```bash
cd ../frontend
npm start
# Runs on http://localhost:3000
```

---

## How It Works

- The backend maintains a knowledge state vector for each user, representing mastery per topic.
- When a user requests a question, the backend uses DQN+TEBD to select the most effective next question, balancing challenge, diversity, and learning potential.
- User answers are submitted to the backend, which updates the knowledge state and learning model.
- The frontend displays questions, collects answers, and visualizes progress and analytics in real time.
- The dashboard dynamically updates overall mastery, recent activity (tracked in-browser), and profile stats.

---

## API Endpoints

- `GET /api/question` — Get the next adaptive question
- `POST /api/submit` — Submit an answer and get feedback
- `GET /api/stats` — Get current knowledge state and stats
- `POST /api/reset` — Reset the user session

---

## Dashboard Features

- **Progress**: See your overall mastery as a percentage, plus a breakdown by topic
- **Recent Activity**: View your latest quiz answers, correctness, and timestamps (tracked in-browser)
- **Profile**: See total questions answered, accuracy, and topic-wise mastery
- All dashboard data updates live as you interact with the quiz

---

## Customization

### Add New Questions
Edit `saphron/rl_agent_engine/aqua_train_new.json`:
```json
{
  "question": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "answer": 1,
  "topic": 0,
  "difficulty": 1
}
```

### Adjust Learning Parameters
Edit `api_server.py` for:
- Learning rate, epsilon decay, knowledge increment, etc.

---

## Dependencies

### Backend (`saphron/rl_agent_engine/requirements.txt`)
- flask==3.0.3
- flask-cors==4.0.1
- tensorflow==2.15.0
- numpy==1.24.3
- quimb==1.4.0
- scipy==1.11.4

### Frontend (`saphron/frontend/package.json`)
- react, react-dom, react-router-dom
- shadcn-ui, tailwindcss, lucide-react
- axios, recharts, class-variance-authority, etc.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and test thoroughly
4. Submit a pull request

---

## License

MIT License — see LICENSE file for details. 
