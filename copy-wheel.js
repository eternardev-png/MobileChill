const fs = require('fs');
const path = require('path');

const source = 'C:/Users/User/.gemini/antigravity/brain/967e9a9f-7331-451e-be12-89c912f3c200/roulette_wheel_bg_1768618000949.png';
const dest = path.join(__dirname, 'assets', 'roulette_wheel.png');

// Create assets directory
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// Copy file
fs.copyFileSync(source, dest);
console.log('Roulette wheel image copied successfully!');
