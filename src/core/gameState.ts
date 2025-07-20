// Game state manager for Sandhill Road
// Tracks all mutable game values

import { saveToFile, loadFromFile } from '../utils/fileStorage';

/** Types of businesses players can choose */
export enum BusinessType {
  SaaS = 'SaaS',
  AI = 'AI',
  Marketplace = 'Marketplace',
  Physical = 'Physical Goods',
  Biotech = 'Biotech'
}

export type FounderStats = {
  health: number;
  morale: number;
  hustle: number;
  tech: number;
  luck: number;
  stamina: number;
  maxStamina: number;
  staminaRegen: number;
  personalCash: number;
};

export type CompanyStats = {
  runway: number;
  burnRate: number;
  users: number;
  productProgress: number;
  companyCash: number;
  revenue: number;
  investorTrust: number;
  /**
   * Represents how reliant the business is on a physical supply chain.
   * 0 means no dependency while higher values amplify disruptions like pandemics.
   */
  supplyChainExposure: number;
};

export enum GameStage {
  Garage = "Garage",
  DemoDay = "Demo Day",
  Fundraising = "Fundraising",
  PMF = "PMF",
  Scaling = "Scaling",
  Crisis = "Crisis",
  Exit = "Exit"
}

export type StageProgress = {
  currentStage: GameStage;
  week: number;
  completedEvents: string[];
  availableEvents: string[];
  completedExclusiveGroups: string[];
};

export type CompanyFlags = {
  hasCoFounder: boolean;
  coFounderEquity: number;
  inAccelerator: boolean;
  acceleratorName?: string;
  hasRaisedSeed: boolean;
  hasRaisedSeriesA: boolean;
  hasPMF: boolean;
  hasFirstEmployee: boolean;
  hasOffice: boolean;
  hasBoard: boolean;
  majorCrisisSurvived: boolean;
  exitOffersReceived: number;
};

export type GameState = {
  founderName: string;
  companyName: string;
  /** Type of business being built */
  businessType: BusinessType;
  founderStats: FounderStats;
  companyStats: CompanyStats;
  stageProgress: StageProgress;
  companyFlags: CompanyFlags;
  gameOver: boolean;
  gameOverReason?: string;
};

// Default starting values for a new game
export const createInitialGameState = (
  founderName: string,
  companyName: string,
  businessType: BusinessType,
  initialPersonalCash: number = 30000
): GameState => {
  return {
    founderName,
    companyName,
    businessType,
    founderStats: {
      health: 8,
      morale: 10,
      hustle: 5,
      tech: 5,
      luck: 5,
      stamina: 10,
      maxStamina: 10,
      staminaRegen: 3,
      personalCash: initialPersonalCash
    },
    companyStats: {
      runway: 12, // weeks
      burnRate: 5000, // per week
      users: 0,
      productProgress: 0,
      companyCash: 10000,
      revenue: 0,
      investorTrust: 5,
      supplyChainExposure: 0
    },
    stageProgress: {
      currentStage: GameStage.Garage,
      week: 1,
      completedEvents: [],
      availableEvents: [],
      completedExclusiveGroups: []
    },
    companyFlags: {
      hasCoFounder: false,
      coFounderEquity: 0,
      inAccelerator: false,
      acceleratorName: undefined,
      hasRaisedSeed: false,
      hasRaisedSeriesA: false,
      hasPMF: false,
      hasFirstEmployee: false,
      hasOffice: false,
      hasBoard: false,
      majorCrisisSurvived: false,
      exitOffersReceived: 0
    },
    gameOver: false
  };
};

// Game state singleton
let gameState: GameState | null = null;

// Game state methods
export const initGame = (
  founderName: string,
  companyName: string,
  businessType: BusinessType,
  initialCash: number = 30000
): GameState => {
  gameState = createInitialGameState(founderName, companyName, businessType, initialCash);
  return gameState;
};

export const getGameState = (): GameState => {
  if (!gameState) {
    throw new Error("Game state not initialized. Call initGame first.");
  }
  return gameState;
};

export const updateGameState = (updater: (state: GameState) => GameState): GameState => {
  if (!gameState) {
    throw new Error("Game state not initialized. Call initGame first.");
  }
  
  gameState = updater(gameState);
  return gameState;
};

export const saveGame = (): void => {
  if (!gameState) {
    throw new Error("No game to save");
  }
  
  try {
    // Check if we're in a browser or Node environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('sandhillRoadSave', JSON.stringify(gameState));
    } else {
      // In Node.js, use file storage
      saveToFile(gameState);
    }
  } catch (error) {
    console.error("Failed to save game:", error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    let savedGame: string | null = null;
    
    // Check if we're in a browser or Node environment
    if (typeof window !== 'undefined' && window.localStorage) {
      savedGame = localStorage.getItem('sandhillRoadSave');
      if (savedGame) {
        gameState = JSON.parse(savedGame);
        return gameState;
      }
    } else {
      // In Node.js, use file storage
      const data = loadFromFile();
      if (data) {
        gameState = data;
        return gameState;
      }
    }
  } catch (error) {
    console.error("Failed to load game:", error);
  }
  
  return null;
};

export const endGame = (reason: string): void => {
  if (!gameState) return;
  
  updateGameState(state => ({
    ...state,
    gameOver: true,
    gameOverReason: reason
  }));
};

// Weekly update function
export const advanceWeek = (): void => {
  if (!gameState || gameState.gameOver) return;
  
  updateGameState(state => {
    // Update week counter
    const newWeek = state.stageProgress.week + 1;
    
    // Calculate new values
    const newStamina = Math.min(
      state.founderStats.maxStamina,
      state.founderStats.stamina + state.founderStats.staminaRegen
    );
    
    const newCompanyCash = state.companyStats.companyCash - state.companyStats.burnRate;
    const newRunway = Math.floor(newCompanyCash / state.companyStats.burnRate);
    
    // Check for game over conditions
    if (newCompanyCash <= 0) {
      return {
        ...state,
        companyStats: {
          ...state.companyStats,
          companyCash: 0,
          runway: 0
        },
        stageProgress: {
          ...state.stageProgress,
          week: newWeek
        },
        gameOver: true,
        gameOverReason: "Your company ran out of money."
      };
    }
    
    if (state.founderStats.health <= 0) {
      return {
        ...state,
        stageProgress: {
          ...state.stageProgress,
          week: newWeek
        },
        gameOver: true,
        gameOverReason: "Your health deteriorated completely. You had to step down."
      };
    }
    
    // Normal weekly update
    return {
      ...state,
      founderStats: {
        ...state.founderStats,
        stamina: newStamina
      },
      companyStats: {
        ...state.companyStats,
        companyCash: newCompanyCash,
        runway: newRunway
      },
      stageProgress: {
        ...state.stageProgress,
        week: newWeek
      }
    };
  });
};    