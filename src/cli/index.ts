#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import {
  initGame,
  getGameState,
  saveGame,
  loadGame,
  GameStage,
  advanceWeek
} from '../core/gameState';
import {
  loadEvents,
  startEvent,
  makeChoice,
  clearCurrentEvent,
  getCurrentEvent,
  getStageDescription,
  progressToNextStage,
  triggerRandomEvent
} from '../core/narrativeEngine';

// ASCII art banner
const showBanner = () => {
  console.clear();
  console.log(
    chalk.yellowBright(
      figlet.textSync('Sandhill Road', { 
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log(chalk.greenBright('A Startup Simulation Game'));
  console.log('-------------------------------------------\n');
};

// Show game stats
const showStats = () => {
  const state = getGameState();
  console.log(chalk.cyan('\n=== FOUNDER STATS ==='));
  console.log(`${chalk.bold('Health:')} ${state.founderStats.health}`);
  console.log(`${chalk.bold('Morale:')} ${state.founderStats.morale}`);
  console.log(`${chalk.bold('Hustle:')} ${state.founderStats.hustle}`);
  console.log(`${chalk.bold('Tech:')} ${state.founderStats.tech}`);
  console.log(`${chalk.bold('Luck:')} ${state.founderStats.luck}`);
  console.log(`${chalk.bold('Stamina:')} ${state.founderStats.stamina}/${state.founderStats.maxStamina}`);
  console.log(`${chalk.bold('Personal Cash:')} $${state.founderStats.personalCash.toLocaleString()}`);
  
  console.log(chalk.magenta('\n=== COMPANY STATS ==='));
  console.log(`${chalk.bold('Company Cash:')} $${state.companyStats.companyCash.toLocaleString()}`);
  console.log(`${chalk.bold('Burn Rate:')} $${state.companyStats.burnRate.toLocaleString()}/week`);
  console.log(`${chalk.bold('Runway:')} ${state.companyStats.runway} weeks`);
  console.log(`${chalk.bold('Users:')} ${state.companyStats.users.toLocaleString()}`);
  console.log(`${chalk.bold('Product Progress:')} ${state.companyStats.productProgress}%`);
  console.log(`${chalk.bold('Revenue:')} $${state.companyStats.revenue.toLocaleString()}/week`);
  
  console.log(chalk.yellow('\n=== PROGRESS ==='));
  console.log(`${chalk.bold('Current Stage:')} ${state.stageProgress.currentStage}`);
  console.log(`${chalk.bold('Week:')} ${state.stageProgress.week}`);
  console.log(`${chalk.bold('Events Completed:')} ${state.stageProgress.completedEvents.length}`);
  console.log('\n-------------------------------------------\n');
};

// Main game loop
const gameLoop = async () => {
  let gameRunning = true;

  while (gameRunning) {
    const state = getGameState();
    
    if (state.gameOver) {
      console.log(chalk.red('\n=== GAME OVER ==='));
      console.log(chalk.red(state.gameOverReason || 'Your startup journey has ended.'));
      console.log('\n');
      
      const { playAgain } = await inquirer.prompt({
        type: 'confirm',
        name: 'playAgain',
        message: 'Would you like to play again?',
        default: false
      });
      
      if (playAgain) {
        await startNewGame();
      } else {
        gameRunning = false;
        console.log(chalk.yellowBright('Thanks for playing Sandhill Road!'));
      }
      
      continue;
    }
    
    // Get or start a new event
    let currentEvent = getCurrentEvent();
    
    if (!currentEvent) {
      currentEvent = startEvent();
      
      if (!currentEvent) {
        console.log(chalk.yellow('No available events for the current stage.'));
        console.log(chalk.yellow('Progressing to the next stage...'));

        const nextStage = progressToNextStage();
        console.log(chalk.green(`\nYou've reached the ${nextStage} stage!`));
        console.log(chalk.green(getStageDescription(nextStage)));

        // Advance time since a week passes even without an event
        advanceWeek();

        const randomEvent = triggerRandomEvent();
        if (randomEvent) {
          console.log(chalk.magentaBright(`\n*** Random Event: ${randomEvent.title} ***`));
          console.log(chalk.magenta(`${randomEvent.description}\n`));
        }

        await inquirer.prompt({
          type: 'input',
          name: 'continue',
          message: 'Press ENTER to continue...'
        });

        continue;
      }
    }
    
    console.clear();
    showBanner();
    showStats();
    
    // Display the event
    console.log(chalk.cyan(`\n=== ${currentEvent.title} ===`));
    console.log(`${currentEvent.description}\n`);
    
    // Display choices
    const choices = currentEvent.choices.map(choice => ({
      name: choice.text,
      value: choice.id
    }));
    
    choices.push({ 
      name: 'Save Game', 
      value: 'save' 
    });
    
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What will you do?',
      choices
    });
    
    if (choice === 'save') {
      saveGame();
      console.log(chalk.green('Game saved!'));
      await inquirer.prompt({
        type: 'input',
        name: 'continue',
        message: 'Press ENTER to continue...'
      });
      continue;
    }
    
    // Handle the choice
    const result = makeChoice(choice);
    
    console.log('\n' + chalk.yellow(result.resultText) + '\n');

    const randomEvent = triggerRandomEvent();
    if (randomEvent) {
      console.log(chalk.magentaBright(`\n*** Random Event: ${randomEvent.title} ***`));
      console.log(chalk.magenta(`${randomEvent.description}\n`));
    }

    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press ENTER to continue...'
    });
    
    clearCurrentEvent();
    
    // If there's a next event specified, start it
    if (result.nextEvent) {
      startEvent(result.nextEvent);
    }
  }
};

// Character creation
const createCharacter = async () => {
  console.clear();
  showBanner();
  
  console.log(chalk.yellowBright('Welcome to Sandhill Road!\n'));
  console.log('You are about to embark on a journey to build a startup.');
  console.log('Make tough decisions, manage your resources, and try to survive the startup life.\n');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'founderName',
      message: 'What is your name?',
      default: 'Founder'
    },
    {
      type: 'input',
      name: 'companyName',
      message: 'What is your company name?',
      default: 'Startup Inc.'
    },
    {
      type: 'list',
      name: 'initialCash',
      message: 'How much personal cash do you start with?',
      choices: [
        { name: 'Bootstrapped ($10,000)', value: 10000 },
        { name: 'Some Savings ($30,000)', value: 30000 },
        { name: 'Rich Parents ($100,000)', value: 100000 }
      ],
      default: 30000
    }
  ]);
  
  return answers;
};

// Start a new game
const startNewGame = async () => {
  const { founderName, companyName, initialCash } = await createCharacter();
  
  // Initialize the game state
  initGame(founderName, companyName, initialCash);
  
  // Load events
  await loadEvents();
  
  // Start the game loop
  await gameLoop();
};

// Main menu
const mainMenu = async () => {
  showBanner();
  
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Welcome to Sandhill Road!',
    choices: [
      { name: 'New Game', value: 'new' },
      { name: 'Load Game', value: 'load' },
      { name: 'Exit', value: 'exit' }
    ]
  });
  
  switch (action) {
    case 'new':
      await startNewGame();
      break;
    case 'load':
      const savedGame = loadGame();
      if (savedGame) {
        console.log(chalk.green('Game loaded successfully!'));
        await loadEvents();
        await gameLoop();
      } else {
        console.log(chalk.red('No saved game found.'));
        await mainMenu();
      }
      break;
    case 'exit':
      console.log(chalk.yellow('Thanks for playing Sandhill Road!'));
      process.exit(0);
  }
};

// Start the game
(async () => {
  try {
    await mainMenu();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})(); 