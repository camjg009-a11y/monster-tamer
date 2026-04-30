# Quick Update Guide

## How to Update Your Game Without Reinstalling Everything

The game is designed with **modular files** so you can update specific parts without touching everything else.

### 📦 What Each File Does

| File | What It Controls | When to Update |
|------|-----------------|----------------|
| **data/monsters.js** | All monster stats, moves, abilities | Adding new monsters, balancing stats |
| **data/zones.js** | World map zones, encounters | Adding new areas, changing difficulty |
| **data/items.js** | Inventory items, equipment | Adding new items/equipment |
| **managers/GameState.js** | Save/load, progression logic | Changing save system, unlocks |
| **managers/BattleManager.js** | Combat calculations | Tweaking damage formulas, combat |
| **scenes/BattleScene.js** | Battle UI and flow | Changing battle interface |
| **scenes/WorldMapScene.js** | World map UI | Changing map layout |
| **scenes/StarterScene.js** | Starter selection | Changing starter screen |
| **scenes/MenuScene.js** | Menus (Party/Codex/Items) | Changing menu displays |
| **index.html** | Main entry point | Rarely needs changes |
| **game.js** | Phaser config | Rarely needs changes |

### 🔄 Common Updates

#### Adding a New Monster

1. **Only update:** `data/monsters.js`
2. Add your monster to the `MONSTERS` object
3. Add it to a zone's encounters in `data/zones.js`
4. Done! Reload the page.

#### Adding a New Zone

1. **Only update:** `data/zones.js`
2. Add zone to `ZONES` object
3. Add connections to `ZONE_CONNECTIONS`
4. Create encounters for that zone
5. Done! Reload the page.

#### Tweaking Battle Damage

1. **Only update:** `managers/BattleManager.js`
2. Edit the `calculateDamage()` function
3. Done! Reload the page.

#### Adding Real Sprite Images

1. **Create folder:** `assets/sprites/`
2. **Add images:** Place PNG files there (e.g., `emberpaw.png`)
3. **Update:** `scenes/BootScene.js` to load them:
```javascript
preload() {
    this.load.image('emberpaw', 'assets/sprites/emberpaw.png');
    // ... load all sprites
}
```
4. **Update:** `data/monsters.js` - change sprite from emoji to image key:
```javascript
sprite: 'emberpaw'  // instead of '🐺'
```
5. **Update rendering** in all scene files where sprites are displayed

### 🎯 Fast Updates (No Full Reinstall)

**To update data only:**
- Replace just the `data/` folder
- Your save file persists (it's in localStorage)

**To update battle system:**
- Replace just `managers/BattleManager.js`

**To update UI:**
- Replace just the specific scene file(s)

### 💾 Your Save Data

Your save is stored in the browser's localStorage under key `monsterTamerSave`.

**To keep your save when updating:**
- Don't clear browser data
- The save survives file replacements

**To reset your save:**
- Open browser console (F12)
- Run: `localStorage.removeItem('monsterTamerSave')`
- Reload page

### 🚀 Best Update Workflow

1. **Backup your current folder** (just in case)
2. **Identify which file controls what you want to change** (see table above)
3. **Edit only that file**
4. **Test in browser** (Ctrl+Shift+R to hard reload)
5. If it works, you're done!

### 📝 Version Control (Optional)

If you want to track changes:
```bash
cd monster-tamer
git init
git add .
git commit -m "Initial version"

# After making changes:
git add data/monsters.js
git commit -m "Added new monster: Flamewing"
```

This lets you undo changes if something breaks!

### 🎨 Adding Your Generated Images

Once you have images from DALL-E/Midjourney:

1. Create `assets/sprites/` folder
2. Name images after monster IDs: `emberpaw.png`, `tidalfin.png`, etc.
3. Update ONLY these files:
   - `scenes/BootScene.js` (add preload code)
   - `data/monsters.js` (change sprite value)
   - Scene files that render sprites (optional: for better sizing)

You don't need to replace the entire game!

---

**Pro Tip:** Keep the original download as a "clean" backup. Make changes to a copy. If something breaks, compare files to see what changed.
