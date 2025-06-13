# 🧠 Adaptive Math Tutor (DQN + TEBD)

An interactive web-based adaptive math tutor that combines **Deep Q-Learning (DQN)** with a **quantum-inspired TEBD (Time-Evolving Block Decimation)** algorithm to recommend the most effective math questions to users based on their evolving topic mastery.

This system intelligently adjusts both the difficulty and topic of questions in real-time by modeling structured correlations between topics — inspired by entanglement in quantum systems. It emulates the decision-making process of a highly attentive tutor, delivering content tailored to reinforce weak areas, avoid redundancy, and promote efficient concept acquisition.

---

## 🧠 How It Works

At its core, this tutor represents the learner's knowledge as a vector of mastery values — one per topic (e.g., addition, multiplication, fractions). These values range from 0.0 to 1.0 and are updated continuously based on the student’s performance.

### 🎯 State Representation
The agent maintains a **state vector** `s = [x₀, x₁, ..., xₙ]`, where each `xᵢ` indicates mastery level in topic `i`. Correct answers increase the respective value, simulating learning progress.

### 🧠 Decision Engine
To decide which question to present next, the system uses:

- **DQN (Deep Q-Network):** A neural network trained to predict the expected learning reward (Q-value) for each available question given the current mastery state.
- **TEBD Selector:** Instead of simply choosing the highest Q-value or using ε-greedy or softmax sampling, the system uses a **TEBD-based strategy** that constructs a Matrix Product State (MPS) over the action space. This simulates correlations (like conceptual overlap or question redundancy) and applies time-evolution to balance diversity, challenge, and relevance.

The result is a structurally-aware selection process that:
- Avoids repeating similar questions
- Smoothly transitions across related topics
- Chooses questions that maximize learning potential based on historical mastery and structural relationships

### 📈 Reinforcement Learning Loop
1. A question is selected based on the current mastery state and TEBD-smoothed Q-values.
2. The student responds via the web interface.
3. A reward is assigned (1 if correct, 0 otherwise).
4. The mastery vector is updated, and the experience is stored.
5. The DQN is periodically trained on past interactions via experience replay to improve its policy.

---

## 📚 Dataset & Question Model

The questions come from the [AQuA-RAT dataset](https://huggingface.co/datasets/deepmind/aqua_rat), a curated collection of algebraic and arithmetic word problems.

Each question is:
- Categorized by `topic` (e.g., arithmetic, algebra)
- Assigned a `difficulty` level using heuristics based on text complexity
- Presented in a multiple-choice format (A-E), aligned with the DQN’s action space

---

## 🌐 Interface

The user interface is built in **Flask** and served as a lightweight web app. Users answer questions through a simple form. After each response, the system displays:
- Feedback (Correct/Incorrect)
- The updated mastery vector, giving a transparent view of learning progress

The interface supports quick iteration and immediate insight into the agent’s adaptive behavior.

---

## 🧬 Why Quantum-Inspired?

Traditional reinforcement learning methods assume that each question (action) is independent. In reality, questions can be conceptually related — e.g., understanding fractions often depends on addition mastery. The TEBD-based selector, inspired by quantum entanglement models, represents these dependencies as entangled “states” across the action space. It evolves these states in time, producing smoother, more pedagogically sound question sequences.

This adds a layer of structure and intentionality to the learning path that classical exploration strategies don’t provide.

---

This system serves as both a research prototype and a practical tool, demonstrating how quantum-inspired machine learning techniques can enhance educational technology by making tutoring more personalized, efficient, and intellectually grounded.
