
# Sandhill Road - PRD for Codex Bootstrap

## 1. Project Overview

**Name:** Sandhill Road  
**Genre:** Narrative-driven survival sim  
**Style:** Retro 8-bit, Oregon Trail-inspired  
**Platform:** Web (desktop-first)  
**Stack Recommendation:** React + TypeScript + JSON narrative engine OR Phaser.js if using canvas rendering  

---

## 2. Core Concept

Sandhill Road is a survival strategy game where you guide a startup founder from garage to exit, making high-stakes decisions across a branching storyline. It combines resource management (e.g. burn rate, morale) with random events, stat-based outcomes, and pixel art visuals. The game is designed to be played in a single session, but **each decision cycle simulates one in-game week**, affecting your startup's momentum, resources, and progress.

---

## 3. Game Flow

### Stages
- Garage
- Demo Day
- Fundraising
- PMF
- Scaling
- Crisis
- Exit

Each stage triggers random **event cards** with choices and consequences. Each event = 1 simulated week.

---

## 4. Key Modules

### A. Game State Manager (`/core/gameState.ts`)
- Tracks all mutable game values:
  - `founderStats`: health, morale, hustle, tech, luck
  - `companyStats`: runway, burnRate, users, productProgress
  - `stageProgress`: currentStage, completedEvents

### B. Narrative Engine (`/core/narrativeEngine.ts`)
- Loads event JSON
- Presents choices
- Resolves outcomes (RNG + stat modifiers)
- Advances in-game time by 1 week per decision

### C. Event Format Example (`/data/events.json`)

```json
{
  "id": "E001",
  "title": "Your Co-founder Wants to Switch Stacks",
  "description": "They say React Native is dying. Do you switch to Flutter?",
  "choices": [
    {
      "text": "Rebuild in Flutter",
      "result": {
        "morale": -1,
        "tech": +1,
        "weeksLost": 2
      }
    },
    {
      "text": "Stick with RN",
      "result": {
        "morale": -2,
        "tech": -1
      }
    }
  ],
  "requirements": {
    "tech": 5
  },
  "stage": "Demo Day"
}
```

### D. UI Components (`/components/`)
- `<EventCard />`: display choices and description
- `<StatsPanel />`: health, morale, runway, etc.
- `<Timeline />`: shows startup journey
- `<EndGameScreen />`: exit summary

---

## 5. Asset Integration

### Graphics
- Stored in `/assets/images/`
- Use PNGs with transparent backgrounds for characters, UI overlays
- Use pixel-art resolution scale (e.g. 160x144 base, upscale ×4)

### Audio (optional)
- `/assets/audio/`: UI pings, typing, Slack sounds

---

## 6. Tech Recommendations

### Frontend Stack
- React
- TypeScript
- Tailwind or CSS Modules
- JSON for event scripting

### Optional Frameworks
- InkJS (for narrative if complex)
- Phaser.js (if pixel art + animation is desired in canvas)

---

## 7. MVP Goals

- Playable from founder creation to one of 3 outcomes
- At least 30 narrative events implemented
- Basic pixel-art UI and core game loop
- Simple save/load via localStorage

---

## 8. Repo Structure

```
sandhill-road/
│
├── /public/
│   └── index.html
├── /src/
│   ├── /assets/
│   │   └── images/, audio/
│   ├── /components/
│   ├── /core/
│   │   ├── gameState.ts
│   │   └── narrativeEngine.ts
│   ├── /data/
│   │   └── events.json
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

---

## 9. Launch Plan (Post-MVP)

- Host early build on Vercel or Netlify
- Share with founders/testers via IndieHackers or X
- Collect gameplay feedback for balancing & event design
- Add more founder types, traits, and endings

---

## 10. Game Systems & Mechanics (Expanded)

### A. Time & Decision Rhythm

- Each event = **1 in-game week**
- Resources like stamina regenerate weekly
- Burn rate decreases cash per simulated week
- Some events span multiple weeks

---

### B. Core Resources

1. **Cash**
   - Split into:
     - **Personal Cash**: Earned via side gigs (Uber, FAANG moonlighting, freelance)
     - **Company Cash**: Used for runway, salaries, infra
   - Sources: investor funds, revenue, personal contribution

2. **Stamina**
   - Represents founder’s energy.
   - **Regenerates each simulated week** depending on morale, events, and rest choices

3. **Morale**
   - Affects:
     - Event outcomes
     - Stamina regen
     - Team loyalty
   - Rises/falls based on outcomes, momentum, character interactions

---

### C. Decision Authority Model

- Explore different team control schemes:
  1. **Solo Mode:** You direct all decisions.
  2. **Co-Founder Mode:** You make decisions with your co-founder.
  3. **Delegation Mode:** Set strategy parameters, and your team makes autonomous decisions influenced by traits.

---

### D. Business Model Logic (Future Scope)

- Different startup types may use different mechanics (e.g. SaaS vs. marketplace vs. enterprise)
- In v1: keep neutral system
- In v2: expand with modular business model logic

---

## 11. Design Theory & Cadence

- 78 simulated weeks (≈ 18 months) is the average lifespan of an early-stage startup.
- Each decision cycle = 2 minutes = ~2.5 hour total playthrough.
- Pacing supports emotional momentum and real-life alignment with startup storytelling.
- Future versions can include short or extended timeline modes.

---

## 12. Character Creation & Personal Cash Economy

### Starting Point

- Players begin with a **pot of personal cash** (e.g. $30,000)

### Spendable Customization Options

- $10,000 = +1 stamina capacity
- $10,000 = +10% stamina regeneration rate
- $10,000 = +10% resistance to morale-impacting events
- $10,000 = +5% pitch success rate
- $10,000 = +1 investor contact

This system introduces light RPG elements and trade-offs to the startup simulation.
