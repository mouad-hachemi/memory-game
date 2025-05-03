# Memory Game

Welcome to **Memory Games**, a React-based web app featuring two fun and brain-challenging memory games:

## Screenshots
![memory-game-shot1](https://github.com/user-attachments/assets/8c3a609a-1e4b-4a27-8ac1-91a4c6dcf52a)
![memory-game-shot2](https://github.com/user-attachments/assets/ffac4ce9-19ee-43d7-8eaf-0a080c2d7301)


## 🧠 Game Modes

### 1. Find Pairs
In this classic memory game, players flip cards to find matching pairs. The grid size increases with the selected difficulty level.

- **Levels**:
  - New Born (2x2)
  - Child (4x4)
  - Secondary Student (6x6)
  - Graduate (8x8)
  - Einstein (10x10)

- **Features**:
  - Timer to track how long the player takes.
  - Scoreboard that shows:
    - ❌ Number of misses
    - 🎯 One-shot matches
    - ⏳ Total time taken
    - Difficulty level
  - Persistent scores using `localStorage`.

---

### 2. Arrow Dance
In this game, the system shows a sequence of moves, and the player must repeat them in order. The sequence grows longer after each successful round.

- **Features**:
  - Increasing difficulty.
  - Immediate feedback on mistakes.
  - Play until you lose.
  - Score based on the longest correct sequence.

---

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/memory-games.git
   cd memory-games
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm run dev
   ```
## 🛠 Technologies
- React
- JavaScript (ES6+)
- CSS
- Vite
- LocalStorage (for score saving)

## 📄 License
This project is open-source and free to use for learning or personal projects.
