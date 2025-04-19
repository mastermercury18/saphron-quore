import numpy as np
import random
from collections import deque
import tensorflow as tf
from tensorflow.keras import layers

# --- Math Questions Only ---
QUESTION_BANK = [
    {"question": "What is 6 + 3?", "options": ["6", "9", "12"], "answer": 1, "topic": 0},       # basic addition
    {"question": "What is 12 - 5?", "options": ["6", "7", "8"], "answer": 1, "topic": 0},      # subtraction
    {"question": "What is 3 * 4?", "options": ["7", "12", "14"], "answer": 1, "topic": 1},     # multiplication
    {"question": "What is 16 / 4?", "options": ["4", "5", "6"], "answer": 0, "topic": 1},      # division
    {"question": "What is (2 + 3) * 2?", "options": ["10", "12", "8"], "answer": 0, "topic": 2} # multi-step
]

NUM_TOPICS = 3  # addition/subtraction, multiplication/division, multi-step
ACTION_SIZE = len(QUESTION_BANK)
STATE_SIZE = NUM_TOPICS

# --- Q-Network ---
def build_model():
    model = tf.keras.Sequential([
        layers.Dense(32, input_dim=STATE_SIZE, activation='relu'),
        layers.Dense(32, activation='relu'),
        layers.Dense(ACTION_SIZE, activation='linear')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                  loss='mse')
    return model

# --- Agent ---
class DQNAgent:
    def __init__(self):
        self.memory = deque(maxlen=2000)
        self.model = build_model()
        self.epsilon = 1.0
        self.epsilon_min = 0.05
        self.epsilon_decay = 0.95
        self.gamma = 0.95

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(ACTION_SIZE)
        q_values = self.model.predict(state[np.newaxis, :], verbose=0)
        return np.argmax(q_values[0])

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def replay(self, batch_size=8):
        if len(self.memory) < batch_size:
            return
        minibatch = random.sample(self.memory, batch_size)
        for state, action, reward, next_state, done in minibatch:
            target = reward if done else reward + self.gamma * np.amax(self.model.predict(next_state[np.newaxis, :], verbose=0)[0])
            target_f = self.model.predict(state[np.newaxis, :], verbose=0)
            target_f[0][action] = target
            self.model.fit(state[np.newaxis, :], target_f, epochs=1, verbose=0)
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

# --- Initialize ---
agent = DQNAgent()
user_knowledge = np.array([0.2, 0.2, 0.2])  # start weak in all topics

# --- Interactive Loop ---
for episode in range(10):
    print(f"\n📘 Quiz Session {episode+1}")
    state = np.copy(user_knowledge)
    
    action = agent.act(state)
    q = QUESTION_BANK[action]
    
    print(f"🧠 Q: {q['question']}")
    for i, option in enumerate(q['options']):
        print(f"  {i}: {option}")
    
    try:
        user_input = int(input("Your answer (0/1/2): ").strip())
    except:
        user_input = -1

    correct = int(user_input == q['answer'])
    print("✅ Correct!" if correct else f"❌ Incorrect. Correct answer is: {q['options'][q['answer']]}")
    
    # Learning update
    topic = q['topic']
    reward = 1 if correct else 0
    if correct:
        user_knowledge[topic] += 0.1  # simulate improvement
    
    next_state = np.copy(user_knowledge)
    agent.remember(state, action, reward, next_state, done=False)
    agent.replay()

    print(f"🧠 Current knowledge: {np.round(user_knowledge, 2)}")

print("\n🎓 Done! The agent should now recommend more of what you need.")