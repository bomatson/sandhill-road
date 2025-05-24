// File Storage Utility for persisting game data
import fs from 'fs';
import path from 'path';
import os from 'os';

// Create a save directory in the user's home directory
const SAVE_DIR = path.join(os.homedir(), '.sandhill-road');
const SAVE_FILE = path.join(SAVE_DIR, 'save.json');

// Ensure the save directory exists
export const initStorage = (): void => {
  if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
  }
};

// Save data to a file
export const saveToFile = (data: any): void => {
  try {
    initStorage();
    fs.writeFileSync(SAVE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save data to file:', error);
  }
};

// Load data from a file
export const loadFromFile = (): any | null => {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      const data = fs.readFileSync(SAVE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load data from file:', error);
  }
  
  return null;
};

// Check if a save file exists
export const saveFileExists = (): boolean => {
  return fs.existsSync(SAVE_FILE);
};

// Delete the save file
export const deleteSaveFile = (): void => {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      fs.unlinkSync(SAVE_FILE);
    }
  } catch (error) {
    console.error('Failed to delete save file:', error);
  }
}; 