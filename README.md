# Sandhill Road

A narrative-driven startup simulation game where you guide a founder from garage to exit, making high-stakes decisions across a branching storyline.

## Description

Sandhill Road is a text-based survival strategy game inspired by Oregon Trail. You'll manage resources, make critical decisions, and try to navigate the challenges of startup life. Each decision you make simulates one in-game week, affecting your startup's momentum, resources, and progress.

## Features

- Text-based adventure with ASCII graphics
- Resource management (burn rate, morale, stamina, etc.)
- Branching narrative with different outcomes
- Stat-based decision outcomes
- Multiple game stages: Garage, Demo Day, Fundraising, PMF, Scaling, Crisis, Exit
- Save/load game progress

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sandhill-road.git
   cd sandhill-road
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the game:
   ```
   npm start
   ```

## How to Play

- Choose your founder's name and company name
- Start with a certain amount of personal cash
- Make strategic decisions that affect your company's success
- Manage your resources wisely
- Try to reach a successful exit

## Game Stages

1. **Garage** - Working from your garage to build an MVP
2. **Demo Day** - Presenting your startup at a demo day
3. **Fundraising** - Meeting with investors to raise your seed round
4. **PMF** - Iterating on your product to find product-market fit
5. **Scaling** - Growing your product and team
6. **Crisis** - Facing a major challenge that threatens your company
7. **Exit** - Exploring exit opportunities

## Adding New Events

The game is designed to be easily extensible. To add new events:

1. Open `src/data/events.json`
2. Add a new event object following this structure:

```json
{
  "id": "E0XX",
  "title": "Event Title",
  "description": "Event description text",
  "choices": [
    {
      "id": "C001",
      "text": "Choice text",
      "result": {
        "founderStats.morale": -1,
        "companyStats.productProgress": 5
      },
      "resultText": "The outcome of your choice"
    }
  ],
  "stage": "Garage",
  "weight": 1
}
```

Fields explained:
- `id`: Unique identifier for the event
- `title`: Title displayed to the player
- `description`: The event's description
- `choices`: Array of possible choices
  - `id`: Unique identifier for the choice
  - `text`: The text displayed to the player
  - `requires` (optional): Stats required to select this choice
  - `result`: Changes to stats when this choice is selected
  - `resultText`: The outcome text displayed to the player
  - `nextEvent` (optional): ID of the next event to trigger
- `stage`: Game stage when this event can occur
- `weight`: Relative probability of this event occurring
- `repeatable` (optional): Whether this event can repeat

## Development

### Build the project

```
npm run build
```

### Running in development mode

```
npm run dev
```

## Future Enhancements

- Web-based GUI version
- More narrative events
- Expanded game mechanics
- Multiplayer mode (compete with friends)
- Mobile support

## License

MIT

## Acknowledgments

- Inspired by Oregon Trail and startup life
- Built with Node.js, TypeScript, and Inquirer 