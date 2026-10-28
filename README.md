# Gem Collector

A 2D top-down survival arcade game built with vanilla HTML5 Canvas, CSS, and modern JavaScript (ES Modules).

Explore a large open world, collect glowing gems to increase your score, and dodge waves of hostile creatures to survive and climb the leaderboard.

---

## Features

- **Large 2D World & Camera**: A 6400×6400 procedural grass world with a smooth viewport camera tracking player movement.
- **Player Mechanics**: Full directional movement (WASD) with animated sprites for idle and walking states, health tracking, and sound effects.
- **Enemy AI**: Three enemy types with custom movement, animation, and collision damage:
  - **Ants**: Swarming ground units.
  - **Bats**: Fast flyers.
  - **Bears**: Heavy-hitting bruisers.
  - *Flocking/Separation*: Built-in obstacle avoidance so enemies push away from each other while chasing the player.
- **Audio & Visual FX**: Background music system with randomized track selection, plus SFX for gem collection and damage.
- **Authentication & Leaderboard**:
  - User registration and login with form validation stored locally (`localStorage`).
  - Guest mode support.
  - Session tracking (`sessionStorage`) with persistent high-score leaderboard.
- **Responsive UI**: Glassmorphic dashboard, collapsible navigation drawer, profile overlay, and in-game HUD.

---

## Controls

| Action | Key |
| --- | --- |
| Move Up | <kbd>W</kbd> |
| Move Left | <kbd>A</kbd> |
| Move Down | <kbd>S</kbd> |
| Move Right | <kbd>D</kbd> |
| Pause / Resume | <kbd>Esc</kbd> |
| Restart (Game Over) | <kbd>R</kbd> |

---

## Project Structure

```text
HTML_JS_Game/
├── Assets/                 # Sprites, icons, map tiles, SFX, and background music
├── HTML_Webpages/
│   ├── game.html          # Main game canvas & HUD
│   ├── leaderboards.html  # High scores table
│   └── log_reg.html       # Authentication interface
├── JS_files/
│   ├── credentials.js     # User registration, login, and validation
│   ├── game.js            # Game loop, entity management, physics, and canvas rendering
│   ├── leaderboards.js    # Leaderboard rendering and score sorting
│   ├── module.js          # Shared state and storage helpers
│   └── script.js          # Global UI events (sidebar, header, session logout)
├── index.html             # Landing page
├── style.css              # App styling and responsive layout
└── README.md
```

---

## Getting Started

Because the game uses JavaScript ES Modules (`<script type="module">`), opening `index.html` directly via the `file://` protocol will trigger browser CORS restrictions. You must serve it through a local HTTP server.

### Option 1: VS Code Live Server
1. Open this project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **Open with Live Server**.

### Option 2: Python
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 3: Node.js (`npx serve`)
```bash
npx serve .
```

