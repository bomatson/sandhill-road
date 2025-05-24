#!/usr/bin/env node

// Simple entry point for Sandhill Road game
// This allows us to run the game with just "node index.js"

// We use the ts-node runtime to execute the TypeScript directly
require('ts-node/register');
require('./src/cli/index.ts');

console.log('Starting Sandhill Road...'); 