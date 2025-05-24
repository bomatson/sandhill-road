# Sandhill Road

[![npm version](https://img.shields.io/npm/v/sandhill-road.svg)](https://www.npmjs.com/package/sandhill-road)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A narrative-driven startup simulation game where you guide a founder from garage to exit, making high-stakes decisions across a branching storyline.

## Description

Sandhill Road is a text-based survival strategy game inspired by Oregon Trail, but set in the high-stakes world of startups. You'll manage resources, make critical decisions, and try to navigate the challenges of startup life. Each decision you make simulates one in-game week, affecting your startup's momentum, resources, and progress.

![Sandhill Road Screenshot](https://raw.githubusercontent.com/yourusername/sandhill-road/main/assets/screenshot.png)

## Features

- Text-based adventure with ASCII graphics
- Resource management (burn rate, morale, stamina, etc.)
- Branching narrative with different outcomes
- Stat-based decision outcomes
- Multiple game stages: Garage, Demo Day, Fundraising, PMF, Scaling, Crisis, Exit
- Save/load game progress
- 20+ unique narrative events

## Installation

### Global Installation (Recommended)

```bash
npm install -g sandhill-road
```

Then run the game from anywhere:

```bash
sandhill-road
```

### Local Installation

```bash
git clone https://github.com/yourusername/sandhill-road.git
cd sandhill-road
npm install
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
7. **Exit** - Exploring exit opportunities for your startup

## Adding New Events

The game is designed to be easily extensible. To add new events:

1. Fork the repository
2. Open `src/data/events.json`
3. Add a new event object following this structure:

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

4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## Development

### Build the project

```bash
npm run build
```

### Running in development mode

```bash
npm run dev
```

### Release Process

```bash
npm run release
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on the process for submitting pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/yourusername/sandhill-road/tags).

## Authors

* **Your Name** - *Initial work* - [yourusername](https://github.com/yourusername)

See also the list of [contributors](https://github.com/yourusername/sandhill-road/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Oregon Trail and startup life
- Built with Node.js, TypeScript, and Inquirer 
- Built with Node.js, TypeScript, and Inquirer 