# Contributing to Sandhill Road

Thank you for considering contributing to Sandhill Road! This document provides guidelines and steps for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/yourusername/sandhill-road/issues)
- If not, create a new issue with a descriptive title and detailed steps to reproduce

### Suggesting Features

- Check if the feature has already been suggested in [Issues](https://github.com/yourusername/sandhill-road/issues)
- If not, create a new issue with a descriptive title and detailed description of the feature

### Adding New Events

The easiest way to contribute is by adding new narrative events to the game:

1. Fork the repository
2. Create a new branch: `git checkout -b add-event-xyz`
3. Add your event to `src/data/events.json` following the existing format:

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

4. Commit your changes: `git commit -m "Add new event: XYZ"`
5. Push to your fork: `git push origin add-event-xyz`
6. Submit a pull request

### Guidelines for New Events

- Ensure each event has a unique ID (increment from the last one)
- Balance the outcomes so no single choice is always the best
- Keep the writing style consistent with existing events
- Use appropriate stat changes that make sense for the event
- Place the event in the appropriate game stage

### Code Contributions

1. Fork the repository
2. Create a new branch: `git checkout -b feature-xyz`
3. Make your changes
4. Run the linter: `npm run lint`
5. Test your changes: `npm test`
6. Commit your changes: `git commit -m "Add feature XYZ"`
7. Push to your fork: `git push origin feature-xyz`
8. Submit a pull request

## Pull Request Process

1. Update the README.md with details of changes if appropriate
2. Update the version number following [SemVer](http://semver.org/)
3. Your PR will be reviewed by maintainers, who may request changes
4. Once approved, your PR will be merged

## Development Environment

1. Clone the repository: `git clone https://github.com/yourusername/sandhill-road.git`
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`

## Style Guide

- Use TypeScript for all code
- Follow ESLint rules configured in the project
- Use 2 spaces for indentation
- Use camelCase for variables and functions, PascalCase for classes and interfaces
- Write descriptive variable names and comments

## Thank You!

Your contributions help make this project better. Thank you for your time and effort! 