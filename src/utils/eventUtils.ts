// Utility functions for handling events and their effects

import { GameState, updateGameState } from "../core/gameState";
import { EventChoice } from "../core/narrativeEngine";

/**
 * Applies a result to the game state
 * This handles dot notation for nested properties
 */
export const applyResult = (
  result: Partial<Record<string, number>>
): void => {
  updateGameState(state => {
    // Create a deep copy of the state
    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    
    // Apply each result key-value pair
    for (const [key, value] of Object.entries(result)) {
      if (key === 'weeksLost' || value === undefined) continue; // Handled separately or skip undefined
      
      const path = key.split('.');
      
      if (path.length === 1) {
        // Direct property on state - we'd need to handle each possible direct property specifically
        // For the current game state, we don't actually have direct number properties at the root level
        // This is just here for completeness
        console.warn(`Direct property updates not supported: ${key}`);
      } else if (path.length === 2) {
        // Nested property
        const [category, prop] = path;
        const categoryKey = category as keyof GameState;
        const categoryObj = newState[categoryKey];
        
        if (categoryObj && typeof categoryObj === 'object') {
          // Use type assertion to treat it as a record
          const objWithProps = categoryObj as Record<string, any>;
          
          if (typeof objWithProps[prop] === 'number') {
            objWithProps[prop] = Math.max(0, objWithProps[prop] + value);
          }
        }
      }
    }
    
    return newState;
  });
};

/**
 * Checks if player meets requirements for a choice
 */
export const meetsRequirements = (
  state: GameState,
  requires?: Partial<Record<string, number>>
): boolean => {
  if (!requires) return true;
  
  for (const [key, reqValue] of Object.entries(requires)) {
    // Skip if the required value is undefined
    if (reqValue === undefined) continue;
    
    const path = key.split('.');
    let currentValue: any = state;
    
    for (const prop of path) {
      if (currentValue && currentValue[prop] !== undefined) {
        currentValue = currentValue[prop];
      } else {
        return false; // Required stat not found
      }
    }
    
    // Compare value
    if (typeof currentValue === 'number') {
      if (currentValue < reqValue) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Get available choices for an event based on player stats
 */
export const getAvailableChoices = (
  state: GameState,
  choices: EventChoice[]
): EventChoice[] => {
  return choices.filter(choice => 
    !choice.requires || meetsRequirements(state, choice.requires)
  );
}; 