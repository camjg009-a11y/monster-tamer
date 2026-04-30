# Monster Tamer - JRPG Game

A professional turn-based monster taming RPG built with Phaser.js game engine.

## 🎮 Features

- **Complete Battle System**: Turn-based combat with type effectiveness (Demon/Ghost/Angel triangle)
- **World Map**: 5 zones to explore with zone progression system
- **Monster Collection**: 9 unique monsters with lore, abilities, and move sets
- **Codex System**: Track discovered and owned creatures
- **Party Management**: Hero + Monster companion system
- **Inventory**: Items, equipment, and resource management
- **Save/Load**: Automatic localStorage persistence
- **Level Up System**: Gain XP, level up, unlock new zones

## 🚀 How to Run

### Method 1: Simple HTTP Server (Recommended)

1. Download all files and maintain the folder structure:
```
monster-tamer/
├── index.html
├── game.js
├── data/
│   ├── monsters.js
│   ├── zones.js
│   └── items.js
├── managers/
│   ├── GameState.js
│   └── BattleManager.js
└── scenes/
    ├── BootScene.js
    ├── StarterScene.js
    ├── WorldMapScene.js
    ├── BattleScene.js
    └── MenuScene.js
```

2. Run a local server:

**Python 3:**
```bash
cd monster-tamer
python -m http.server 8000
```

**Node.js:**
```bash
cd monster-tamer
npx http-server -p 8000
```

**VS Code:**
Install "Live Server" extension, right-click index.html → "Open with Live Server"

3. Open browser to `http://localhost:8000`

### Method 2: Direct File Open

Simply double-click `index.html` - most browsers will run it directly (Chrome, Firefox, Edge).

## 🎯 Game Controls

- **Click/Tap**: All interactions are mouse/touch based
- **Battle**: Choose actions for Hero and Monster, review, then confirm
- **World Map**: Click zones to select, then travel or battle
- **Menus**: Access Party, Codex, Items, and Settings from buttons

## 🔧 Customization & Expansion

### Adding New Monsters

Edit `data/monsters.js` - add entries to the `MONSTERS` object with stats, moves, and abilities.

### Adding New Zones

Edit `data/zones.js` - define new zones with positions, encounters, and unlock requirements.

### Adding Items

Edit `data/items.js` - create new consumables or equipment.

### Replacing Sprites

The game currently uses emoji placeholders. To add real artwork:

1. Generate/create sprite images (recommended: 128x128 PNG with transparent background)
2. Place images in `assets/sprites/` folder
3. Update sprite references in monster data

Example:
```javascript
// In data/monsters.js
emberpaw: {
    // ... other fields
    sprite: 'assets/sprites/emberpaw.png', // Instead of emoji
}
```

4. Load sprites in `BootScene.js` preload():
```javascript
this.load.image('emberpaw', 'assets/sprites/emberpaw.png');
```

## 📁 Project Structure

### Data Layer
- `monsters.js`: All creature definitions with stats, moves, types
- `zones.js`: World map zones and encounter tables
- `items.js`: Consumables and equipment

### Game Logic
- `GameState.js`: Save/load, player data, progression
- `BattleManager.js`: Combat calculations, turn flow, damage

### Scenes (Phaser Screens)
- `BootScene.js`: Initial loading and save detection
- `StarterScene.js`: Choose your starter monster
- `WorldMapScene.js`: Zone navigation and travel
- `BattleScene.js`: Turn-based combat interface
- `MenuScene.js`: Party, Codex, Inventory, Settings

## 🎨 Next Steps for Evolution

1. **Add Real Sprites**: Replace emoji with actual artwork
2. **Monster Catching**: Add pokéball-style capture mechanics
3. **Evolution System**: Monsters evolve at certain levels
4. **More Monsters**: Expand to 20-30 creatures
5. **Monster Switching**: Swap monsters mid-battle
6. **Abilities Implementation**: Make passive abilities actually work in combat
7. **Status Effects**: Poison, burn, sleep, etc.
8. **Shop System**: Buy items and equipment in village
9. **Sound & Music**: Add audio for atmosphere
10. **Boss Battles**: Unique encounters with special rewards
11. **Multiple Save Slots**: Let players have multiple games
12. **Mobile Deployment**: Package as app with Cordova/Capacitor

## 🛠️ Technical Details

- **Engine**: Phaser 3.70.0
- **Rendering**: Canvas + WebGL
- **Save System**: localStorage (client-side)
- **Resolution**: 800x600 (scales to fit screen)
- **Browser Support**: Chrome, Firefox, Safari, Edge (modern versions)

## 📝 Development Tips

- Open browser console (F12) to see debug logs
- Save data stored in localStorage under key 'monsterTamerSave'
- Clear save: `localStorage.removeItem('monsterTamerSave')` in console
- All scenes are modular - edit independently
- Game state is global (`gameState` variable)

## 🎮 Gameplay Guide

1. **Start**: Choose one of 3 starter monsters
2. **Explore**: Travel to different zones from world map
3. **Battle**: Defeat enemies to gain XP and gold
4. **Collect**: Fill your codex by encountering all monsters
5. **Upgrade**: Level up to increase stats
6. **Unlock**: Win battles to unlock the Shadow Temple

Enjoy your monster taming adventure!
