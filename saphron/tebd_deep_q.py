import numpy as np
import random
from collections import deque
import tensorflow as tf
from tensorflow.keras import layers
import quimb as qu
import quimb.tensor as qtn
import sys

class Tee:
    def __init__(self, filename):
        self.terminal = sys.stdout
        self.log = open(filename, "a")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        self.terminal.flush()
        self.log.flush()

sys.stdout = Tee("session_log6.txt")
sys.stderr = sys.stdout  # Redirect errors too


# --- Math Questions Only ---
QUESTION_BANK = [
    {"question": "What is 5 + 7?", "options": ["12", "11", "13"], "answer": 0, "topic": 0, "difficulty": 0},
    {"question": "What is 15 + 29?", "options": ["44", "43", "42"], "answer": 0, "topic": 0, "difficulty": 1},
    {"question": "What is 103 + 208?", "options": ["311", "301", "321"], "answer": 0, "topic": 0, "difficulty": 2},

    {"question": "What is 12 - 7?", "options": ["5", "4", "6"], "answer": 0, "topic": 1, "difficulty": 0},
    {"question": "What is 63 - 28?", "options": ["35", "34", "36"], "answer": 0, "topic": 1, "difficulty": 1},
    {"question": "What is 523 - 109?", "options": ["414", "413", "424"], "answer": 0, "topic": 1, "difficulty": 2},

    {"question": "What is 4 * 3?", "options": ["12", "11", "13"], "answer": 0, "topic": 2, "difficulty": 0},
    {"question": "What is 17 * 3?", "options": ["51", "50", "52"], "answer": 0, "topic": 2, "difficulty": 1},
    {"question": "What is 123 * 3?", "options": ["369", "359", "379"], "answer": 0, "topic": 2, "difficulty": 2},

    {"question": "What is 9 / 3?", "options": ["3", "2", "4"], "answer": 0, "topic": 3, "difficulty": 0},
    {"question": "What is 48 / 4?", "options": ["12", "11", "13"], "answer": 0, "topic": 3, "difficulty": 1},
    {"question": "What is 144 / 12?", "options": ["12", "11", "13"], "answer": 0, "topic": 3, "difficulty": 2},

    {"question": "If you buy 3 pens at $2 each, how much?", "options": ["$6", "$5", "$7"], "answer": 0, "topic": 4, "difficulty": 1},
    {"question": "A train travels 60 miles in 2 hours. Speed?", "options": ["30 mph", "40 mph", "50 mph"], "answer": 0, "topic": 4, "difficulty": 2},
    {"question": "You have 5 apples. You eat 2. How many left?", "options": ["3", "4", "2"], "answer": 0, "topic": 4, "difficulty": 0},

    {"question": "What is 1/2 + 1/4?", "options": ["3/4", "1/2", "2/4"], "answer": 0, "topic": 5, "difficulty": 1},
    {"question": "What is 3/5 - 1/5?", "options": ["2/5", "3/5", "1/5"], "answer": 0, "topic": 5, "difficulty": 1},
    {"question": "What is 0.5 + 0.25?", "options": ["0.75", "0.5", "1.0"], "answer": 0, "topic": 6, "difficulty": 1},
    {"question": "What is 1.2 - 0.7?", "options": ["0.5", "0.6", "0.4"], "answer": 0, "topic": 6, "difficulty": 1},

    {"question": "What is 9 + 3?", "options": ["12", "13", "11"], "answer": 0, "topic": 0, "difficulty": 0},
    {"question": "What is 2 * (3 + 5)?", "options": ["16", "14", "12"], "answer": 0, "topic": 4, "difficulty": 2},
    {"question": "If you split $10 between 2 people?", "options": ["$5", "$4", "$6"], "answer": 0, "topic": 4, "difficulty": 0},
]


NUM_TOPICS = 7 
ACTION_SIZE = len(QUESTION_BANK)
STATE_SIZE = NUM_TOPICS

# --- Q-Network ---

# INPUT: [x, y, z]
#   x = mastery level in Topic 0 (e.g., addition)
#   y = mastery level in Topic 1 (e.g., subtraction)
#   z = mastery level in Topic 2 (e.g., multiplication)

# Each value is between 0 and 1, with higher values = better mastery.

# OUTPUT: [a, b, c, d, e, f]
# Each value is the predicted Q-value (expected future reward) for asking a specific question:
#   a = Topic 0, Easy Question
#   b = Topic 0, Hard Question
#   c = Topic 1, Easy Question
#   d = Topic 1, Hard Question
#   e = Topic 2, Easy Question
#   f = Topic 2, Hard Question

# These Q-values are used to select the best action (question to prompt) via argmax
# They represent expected learning gain
def build_model():
    model = tf.keras.Sequential([
        layers.Dense(32, input_dim=STATE_SIZE, activation='relu'),
        layers.Dense(32, activation='relu'),
        layers.Dense(ACTION_SIZE, activation='linear')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                  loss='mse')
    return model

def tebd_structured_action_selector(q_values, topics, difficulties, prev_action=None, bond_dim=4, dt=0.1, steps=3):
        """
        TEBD-based action selector with explicit structural encoding:
        - Entanglement is introduced between adjacent actions using 2-site gates
        - Topic, difficulty, and previous action are encoded as soft correlations
        - Final MPS reflects a structured, compressed policy from which we sample

        Args:
            q_values: predicted learning gains per question
            topics: topic ID per question
            difficulties: difficulty level per question
            prev_action: action to avoid repeating (temporal context)
            bond_dim: max allowed correlation (entanglement) between actions
            dt: timestep (evolution parameter)
            steps: number of TEBD sweeps (depth of structure modeling)

        Returns:
            index of selected action
        """
       
        q_values = list(q_values)
        n = len(q_values)
        if n < 2:
            return 0

        # 🔢 Step 1: Softmax-normalized Q-values → initial probability amplitudes
        probs = np.exp(q_values - np.max(q_values))
        probs /= np.sum(probs)

        # 🔧 Step 2: Build initial unentangled MPS (product state)
        # Each site holds a biased vector toward its Q-value
        mps = qtn.MPS_computational_state('0' * n)
        for i in range(n):
            bias = probs[i]
            state = np.array([np.sqrt(1 - bias), np.sqrt(bias)])
            # encode into local amplitude
            # Step 2: Build initial MPS with correct structure
            mps_tensors = []
            for i in range(n):
                bias = probs[i]
                data = np.array([np.sqrt(1 - bias), np.sqrt(bias)]).reshape(2, 1, 1)
                t = qtn.Tensor(data, inds=(f"k{i}", f"b{i}_L", f"b{i}_R"))
                mps_tensors.append(t)

            mps = qtn.TensorNetwork(mps_tensors)


        # 🔁 Step 3: Apply TEBD evolution to entangle neighboring actions
        for _ in range(steps):
            for i in range(n - 1):
                t1, d1 = topics[i], difficulties[i]
                t2, d2 = topics[i + 1], difficulties[i + 1]

                # Hierarchical structure: encode similarity as penalty
                # High penalty = reduce correlation = discourage grouping
                penalty = 0.0
                if prev_action in [i, i + 1]:
                    penalty += 0.5  # sequential bias: avoid repetition
                if t1 == t2:
                    penalty += 0.25  # topic similarity: group or separate
                if d1 == d2:
                    penalty += 0.25  # difficulty similarity: smooth progression

                # 🔗 Coupling = raw Q-based importance - penalty
                # This coupling defines the strength of correlation to encode
                coupling = (q_values[i] * q_values[i + 1]) - penalty

                # 🧠 Entanglement generation step
                # The following gate creates entanglement between site i and i+1
                H = np.kron(np.eye(4), np.eye(4)) - dt * coupling * np.eye(16)
                U = qu.expm(-H * dt).reshape(2, 2, 2, 2)

                # 🔁 Apply gate + compress → this is where bonds (entanglement) form
                mps.apply_two_site_gate(
                    U, i, i + 1,
                    contract='swap+split',
                    max_bond=bond_dim  # controls entanglement capacity
                )

        # 📏 Step 4: Contract each site’s environment to estimate output probabilities
        final_probs = []
        for i in range(n):
            # Partial trace ≈ measuring one action in context of all others
            red = mps.partial_trace_complement(i)
            z_expect = red.expectation(qu.pauli('Z'))  # Expectation of Z: diag(1, -1)
            prob_1 = (1 - z_expect) / 2
            final_probs.append(max(0, prob_1))  # measurement result

        # 🔮 Step 5: Sample based on evolved, structure-aware distribution
        final_probs = np.array(final_probs)
        final_probs /= np.sum(final_probs)
        return int(np.random.choice(n, p=final_probs))

# --- Agent ---
class DQNAgent:
    # 
    def __init__(self):
        # Stores past experiences as (state, action, reward, next_state, done)
        # Used for experience replay to stabilize training
        self.memory = deque(maxlen=2000)  
        
        # Deep neural network that predicts Q-values for all possible questions
        # Input: current mastery state → Output: Q-values for each question
        self.model = build_model()  
        
        # Exploration rate — initially 100%, meaning the agent picks random questions
        self.epsilon = 1.0  
        
        # Minimum exploration rate — ensures at least 5% of questions remain randomized
        self.epsilon_min = 0.05  
        
        # After each training round: epsilon *= epsilon_decay
        # Gradually reduces randomness, so agent relies more on learned Q-values over time
        self.epsilon_decay = 0.95  
        
        # Discount factor for future rewards in Q-learning
        # Q(s, a) = reward + gamma * max(Q(next_state))
        # - Small gamma → prioritize immediate learning gain (reward)
        # - Large gamma → prioritize long-term learning gain (future mastery)
        self.gamma = 0.95  
    
    # INPUT: [x, y, z]
    # OUTPUT: index of the question
    
    # Generate the Q-values list and choose the one with highest reward 
    # Use the entanglement-correlations and structural encoding of TEBD to choose the most efficient actions
    def act(self, state, prev_action=None):
        # Exploration
        if np.random.rand() < self.epsilon:
            return random.randrange(ACTION_SIZE)
        
        # Exploitation: structured TEBD selector
        q_values = self.model.predict(state[np.newaxis, :], verbose=0)[0]

        # Correct topic and difficulty info from QUESTION_BANK
        topics = [q['topic'] for q in QUESTION_BANK]
        difficulties = [q.get('difficulty', 0) for q in QUESTION_BANK]  # Example placeholder logic

        # Use TEBD structured selector
        return tebd_structured_action_selector(q_values, topics, difficulties, prev_action=prev_action)


    # INPUT: state, action, reward, next_state, done 
        # state: input vector [x, y, z] of mastery before the question
        # action: index of question currently being prompted to student 
        # reward: 0 or 1, whether the student was correct/incorrect 
        # next_state: updated input vector [x2, y2, z2] of mastery after the question
        # done: boolean checking if the session is over
    #OUTPUT: appends these parameters in a tuple to the memory queue 
    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    
    def replay(self, batch_size=8):
        # Skip training if memory queue doesn't have enough experiences 
        if len(self.memory) < batch_size:
            return
        
        #Choose a random sample of experiences from memory queue 
        minibatch = random.sample(self.memory, batch_size)

        #Loop through each experience in the random sample 
        for state, action, reward, next_state, done in minibatch:
            #Effectively saying, Q(s, a) = reward + gamma * max(Q(next_state))
            target = reward if done else reward + self.gamma * np.amax(self.model.predict(next_state[np.newaxis, :], verbose=0)[0])
            
            #Vector of current Q-values for this state 
            target_f = self.model.predict(state[np.newaxis, :], verbose=0)

            #Update the Q-value for the question being prompted currently 
            target_f[0][action] = target

            #Train the model after updating the Q-value vector 
            self.model.fit(state[np.newaxis, :], target_f, epochs=1, verbose=0)

        #Decrease randomness rate each iteration
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

# --- Initialize ---
agent = DQNAgent()
user_knowledge = np.array([0.2] * NUM_TOPICS)

# --- Interactive Loop ---

for episode in range(25):
    print(f"\n📘 Quiz Session {episode+1}")
    state = np.copy(user_knowledge)
    
    action = agent.act(state, prev_action=action if episode > 0 else None)
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

