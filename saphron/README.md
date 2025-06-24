# Adaptive Learning System

A modern, quantum-inspired adaptive learning system with a beautiful React frontend and Flask backend. The system uses reinforcement learning to adaptively select questions based on your knowledge progress across different topics.

## Features

- 🧠 **Quantum-Inspired Reinforcement Learning**: Uses TEBD (Time-Evolving Block Decimation) algorithm for intelligent question selection
- 📊 **Real-time Progress Tracking**: Visual progress bars and charts showing mastery across topics
- 🎨 **Modern React UI**: Beautiful Material-UI interface with responsive design
- 🔄 **Adaptive Question Selection**: Questions are selected based on your current knowledge state
- 📈 **Learning Analytics**: Detailed progress visualization and statistics

## Tech Stack

- **Frontend**: React 18, Material-UI, Recharts
- **Backend**: Flask, TensorFlow, Quimb (quantum computing library)
- **AI/ML**: Deep Q-Learning with quantum-inspired action selection

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pip

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd saphron
   npm run install-deps
   ```

2. **Install Python dependencies:**
   ```bash
   pip install flask flask-cors tensorflow numpy quimb
   ```

### Running the Application

**Option 1: Run both frontend and backend together**
```bash
npm start
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## How It Works

### Learning Algorithm

1. **Knowledge State**: The system tracks your mastery level (0-1) across 10 different topics
2. **Question Selection**: Uses a quantum-inspired TEBD algorithm to select the most appropriate question
3. **Adaptive Learning**: Correct answers increase your knowledge in the corresponding topic
4. **Reinforcement Learning**: The DQN agent learns from your responses to improve question selection

### API Endpoints

- `GET /api/question` - Get the next adaptive question
- `POST /api/submit` - Submit an answer and get feedback
- `GET /api/stats` - Get learning statistics
- `POST /api/reset` - Reset your learning session

## Project Structure

```
saphron/
├── frontend/                 # React frontend
│   ├── src/
│   │   └── App.js           # Main React component
│   └── package.json
├── rl_agent_engine/         # Flask backend
│   ├── api_server.py        # Main API server
│   ├── aqua_train_new.json  # Question bank
│   └── tebd_app_topic_fix.py # Original Flask app
├── package.json             # Root package.json
└── README.md
```

## Customization

### Adding New Questions

Edit `rl_agent_engine/aqua_train_new.json` to add new questions:

```json
{
  "question": "Your question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
  "answer": 0,
  "topic": 5,
  "difficulty": 2
}
```

### Modifying Learning Parameters

In `api_server.py`, you can adjust:
- Learning rate: `learning_rate=0.001`
- Knowledge increment: `+= 0.1`
- Epsilon decay: `epsilon_decay = 0.95`

## Troubleshooting

### Common Issues

1. **Port already in use**: 
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`
   - Or use different ports in the respective configs

2. **Python import errors**:
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python version compatibility

3. **CORS errors**:
   - Ensure the backend is running on port 5001
   - Check that flask-cors is properly installed

### Development

For development, you can run the frontend in development mode with hot reloading:
```bash
cd frontend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 