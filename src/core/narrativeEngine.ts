// Narrative Engine for Sandhill Road
// Handles events, choices, and outcomes

import { 
  GameState, 
  getGameState, 
  updateGameState, 
  advanceWeek, 
  GameStage 
} from './gameState';

export type EventChoice = {
  id: string;
  text: string;
  requires?: Partial<Record<string, number>>;
  result: Partial<Record<string, number>>;
  resultText: string;
  nextEvent?: string;
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  image?: string;
  choices: EventChoice[];
  requirements?: Partial<Record<string, number>>;
  stage: GameStage | GameStage[];
  repeatable?: boolean;
  weight?: number; // Higher weight = more likely to be selected
};

// Event database
let eventsDatabase: GameEvent[] = [];

// Current event being shown to the player
let currentEvent: GameEvent | null = null;

// Load all events from JSON
export const loadEvents = async (): Promise<void> => {
  try {
    // In a browser environment, we'd fetch from a URL
    // In Node, we could use fs module
    let eventsData;
    
    if (typeof window !== 'undefined') {
      // Browser environment
      const response = await fetch('/data/comprehensive-events.json');
      eventsData = await response.json();
    } else {
      // Node environment - using dynamic import instead of require
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src/data/comprehensive-events.json');
      const fileData = await fs.readFile(filePath, 'utf-8');
      eventsData = JSON.parse(fileData);
    }
    
    eventsDatabase = eventsData;
    return;
  } catch (error) {
    console.error("Failed to load events:", error);
    throw new Error("Failed to load game events");
  }
};

// Filter events based on current game state and requirements
export const getAvailableEvents = (): GameEvent[] => {
  const state = getGameState();
  const currentStage = state.stageProgress.currentStage;
  const completedEvents = state.stageProgress.completedEvents;
  
  return eventsDatabase.filter(event => {
    // Check if event is for the current stage
    const validStage = Array.isArray(event.stage) 
      ? event.stage.includes(currentStage)
      : event.stage === currentStage;
    
    if (!validStage) return false;
    
    // Check if event was already completed and is not repeatable
    if (!event.repeatable && completedEvents.includes(event.id)) {
      return false;
    }
    
    // Check requirements
    if (event.requirements) {
      for (const [stat, value] of Object.entries(event.requirements)) {
        // Check if the requirement is met
        const statPath = stat.split('.');
        let currentValue: any = state;
        
        for (const path of statPath) {
          if (currentValue && currentValue[path] !== undefined) {
            currentValue = currentValue[path];
          } else {
            return false; // Required stat not found
          }
        }
        
        // Compare the value based on type
        if (typeof currentValue === 'number' && typeof value === 'number') {
          if (currentValue < value) {
            return false; // Requirement not met
          }
        } else if (typeof currentValue === 'boolean' && typeof value === 'boolean') {
          if (currentValue !== value) {
            return false; // Requirement not met
          }
        }
      }
    }
    
    return true;
  });
};

// Select a random event from available ones, weighted by their weights
export const selectRandomEvent = (): GameEvent | null => {
  const availableEvents = getAvailableEvents();
  
  if (availableEvents.length === 0) {
    return null;
  }
  
  // Calculate total weight
  const totalWeight = availableEvents.reduce((sum, event) => 
    sum + (event.weight || 1), 0);
  
  // Select random event based on weight
  let randomValue = Math.random() * totalWeight;
  
  for (const event of availableEvents) {
    const weight = event.weight || 1;
    
    if (randomValue <= weight) {
      return event;
    }
    
    randomValue -= weight;
  }
  
  // Fallback in case of rounding errors
  return availableEvents[0];
};

// Get the current event
export const getCurrentEvent = (): GameEvent | null => {
  return currentEvent;
};

// Start a new event
export const startEvent = (eventId?: string): GameEvent | null => {
  let event: GameEvent | null = null;
  
  if (eventId) {
    // Find specific event
    event = eventsDatabase.find(e => e.id === eventId) || null;
  } else {
    // Pick a random event
    event = selectRandomEvent();
  }
  
  if (!event) {
    return null;
  }
  
  currentEvent = event;
  return event;
};

// Make a choice and handle the outcome
export const makeChoice = (choiceId: string): { 
  success: boolean; 
  resultText: string;
  nextEvent?: string;
} => {
  if (!currentEvent) {
    return { 
      success: false, 
      resultText: "No active event." 
    };
  }
  
  const choice = currentEvent.choices.find(c => c.id === choiceId);
  
  if (!choice) {
    return { 
      success: false, 
      resultText: "Invalid choice." 
    };
  }
  
  // Check if the choice has requirements
  if (choice.requires) {
    const state = getGameState();
    
    for (const [stat, value] of Object.entries(choice.requires)) {
      // Check if the requirement is met
      const statPath = stat.split('.');
      let currentValue: any = state;
      
      for (const path of statPath) {
        if (currentValue && currentValue[path] !== undefined) {
          currentValue = currentValue[path];
        } else {
          return { 
            success: false, 
            resultText: "You don't meet the requirements for this choice." 
          };
        }
      }
      
      // Compare the value based on type
      if (typeof currentValue === 'number' && typeof value === 'number') {
        if (currentValue < value) {
          return { 
            success: false, 
            resultText: `Your ${stat} (${currentValue}) is too low. Need at least ${value}.` 
          };
        }
      } else if (typeof currentValue === 'boolean' && typeof value === 'boolean') {
        if (currentValue !== value) {
          return { 
            success: false, 
            resultText: `Requirement not met: ${stat} must be ${value}.` 
          };
        }
      }
    }
  }
  
  // Apply the results of the choice
  updateGameState(state => {
    // Create a copy to modify
    let newState = { ...state };
    
    // Mark the event as completed
    if (currentEvent) {
      newState.stageProgress.completedEvents = [
        ...newState.stageProgress.completedEvents,
        currentEvent.id
      ];
    }
    
    // Apply the choice results
    for (const [stat, value] of Object.entries(choice.result)) {
      // Handle special cases
      if (stat === 'weeksLost' && typeof value === 'number') {
        // Add multiple weeks to the counter
        for (let i = 0; i < value; i++) {
          advanceWeek();
        }
        continue;
      }
      
      if (stat === 'gameOver' && typeof value === 'boolean' && value === true) {
        newState.gameOver = true;
        continue;
      }
      
      if (stat === 'gameOverReason' && typeof value === 'string') {
        newState.gameOverReason = value;
        continue;
      }
      
      // Handle nested stats (including companyFlags)
      const statPath = stat.split('.');
      if (statPath.length === 2) {
        const [category, attribute] = statPath;
        
        if (newState[category as keyof GameState] && 
            typeof newState[category as keyof GameState] === 'object') {
          const categoryObj = newState[category as keyof GameState] as Record<string, any>;
          
          if (categoryObj && categoryObj[attribute] !== undefined) {
            if (typeof categoryObj[attribute] === 'number' && typeof value === 'number') {
              categoryObj[attribute] = Math.max(0, categoryObj[attribute] + value);
            } else {
              // For booleans, strings, and direct number assignments
              categoryObj[attribute] = value;
            }
          }
        }
      }
    }
    
    return newState;
  });
  
  // Advance time by one week unless the choice specified a different time span
  if (!choice.result.weeksLost) {
    advanceWeek();
  }
  
  // Return the result and the next event if specified
  return { 
    success: true, 
    resultText: choice.resultText,
    nextEvent: choice.nextEvent
  };
};

// Clear the current event
export const clearCurrentEvent = (): void => {
  currentEvent = null;
};

// Helper functions for the narrative engine
export const getStageDescription = (stage: GameStage): string => {
  const descriptions: Record<GameStage, string> = {
    [GameStage.Garage]: "You're working from your garage, trying to build an MVP.",
    [GameStage.DemoDay]: "It's time to present your startup at a demo day.",
    [GameStage.Fundraising]: "You're meeting with investors to raise your seed round.",
    [GameStage.PMF]: "You're iterating on your product to find product-market fit.",
    [GameStage.Scaling]: "Your product is gaining traction, and it's time to scale.",
    [GameStage.Crisis]: "Your startup is facing a major crisis.",
    [GameStage.Exit]: "You're exploring exit opportunities for your startup."
  };
  
  return descriptions[stage] || "Unknown stage";
};

// Progress to the next stage
export const progressToNextStage = (): GameStage => {
  const stageOrder = [
    GameStage.Garage,
    GameStage.DemoDay,
    GameStage.Fundraising,
    GameStage.PMF,
    GameStage.Scaling,
    GameStage.Crisis,
    GameStage.Exit
  ];
  
  const state = getGameState();
  const currentStageIndex = stageOrder.indexOf(state.stageProgress.currentStage);
  
  if (currentStageIndex < 0 || currentStageIndex >= stageOrder.length - 1) {
    return state.stageProgress.currentStage;
  }
  
  const nextStage = stageOrder[currentStageIndex + 1];
  
  updateGameState(state => ({
    ...state,
    stageProgress: {
      ...state.stageProgress,
      currentStage: nextStage
    }
  }));
  
  return nextStage;
}; 