// Game State Manager - Handles save/load and global game state
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.hero = {
            name: 'Aria',
            icon: '🧙',
            level: 1,
            hp: 30,
            maxHp: 30,
            atk: 8,
            def: 5,
            gold: 40,
            xp: 0,
            guarding: false
        };
        
        this.player = null; // Current monster companion
        this.wins = 0;
        this.currentZone = 'village';
        this.spawnZone = 'village';
        
        this.zoneWins = {
            demon_wastes: 0,
            phantom_moor: 0,
            celestial_rise: 0,
            shadow_temple: 0
        };
        
        this.inventory = {};
        Object.values(ITEMS).forEach(item => {
            this.inventory[item.id] = { ...item, quantity: item.initialQuantity };
        });
        
        this.equipment = {
            weapon: 'worn_wand',
            armor: 'cloth_robe',
            accessory: 'mana_bead',
            boots: 'swift_sandals'
        };
        
        this.codex = {}; // Discovery status: null (unseen), 'seen', 'owned'
        Object.keys(MONSTERS).forEach(id => {
            this.codex[id] = null;
        });
    }
    
    // Set starting monster
    setStarter(monsterId) {
        const monsterDef = MONSTERS[monsterId];
        this.player = this.createMonsterInstance(monsterId, 1);
        this.codex[monsterId] = 'owned';
    }
    
    // Create a monster instance with current stats
    createMonsterInstance(monsterId, level) {
        const def = MONSTERS[monsterId];
        return {
            id: monsterId,
            name: def.name,
            type: def.type,
            sprite: def.sprite,
            level: level,
            xp: 0,
            maxHp: def.baseStats.hp,
            currentHp: def.baseStats.hp,
            maxMp: def.baseStats.mp,
            currentMp: def.baseStats.mp,
            atk: def.baseStats.atk,
            def: def.baseStats.def,
            moves: def.moves.map(m => ({ ...m })),
            ability: { ...def.ability }
        };
    }
    
    // Level up hero and monster
    levelUp() {
        this.hero.level++;
        this.hero.xp = 0;
        this.hero.atk++;
        this.hero.def++;
        this.hero.maxHp += 4;
        this.hero.hp = Math.min(this.hero.hp + 6, this.hero.maxHp);
        
        if (this.player) {
            this.player.level++;
            this.player.atk += 2;
            this.player.def++;
            this.player.maxHp += 5;
            this.player.maxMp += 3;
            this.player.currentHp = Math.min(this.player.currentHp + 6, this.player.maxHp);
            this.player.currentMp = Math.min(this.player.currentMp + 4, this.player.maxMp);
        }
        
        // Random potion reward
        if (Math.random() < 0.55) {
            this.inventory.potion.quantity++;
        }
    }
    
    // Save game to localStorage
    save() {
        const saveData = {
            hero: this.hero,
            player: this.player,
            wins: this.wins,
            currentZone: this.currentZone,
            spawnZone: this.spawnZone,
            zoneWins: this.zoneWins,
            inventory: this.inventory,
            equipment: this.equipment,
            codex: this.codex
        };
        
        localStorage.setItem('monsterTamerSave', JSON.stringify(saveData));
        console.log('Game saved!');
    }
    
    // Load game from localStorage
    load() {
        const saved = localStorage.getItem('monsterTamerSave');
        if (!saved) return false;
        
        try {
            const data = JSON.parse(saved);
            this.hero = data.hero;
            this.player = data.player;
            this.wins = data.wins;
            this.currentZone = data.currentZone;
            this.spawnZone = data.spawnZone;
            this.zoneWins = data.zoneWins;
            this.inventory = data.inventory;
            this.equipment = data.equipment;
            this.codex = data.codex;
            
            console.log('Game loaded!');
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }
    
    // Rest at safe zone
    rest() {
        this.hero.hp = this.hero.maxHp;
        if (this.player) {
            this.player.currentHp = this.player.maxHp;
            this.player.currentMp = this.player.maxMp;
        }
    }
    
    // Return to spawn after defeat
    returnToSpawn() {
        this.currentZone = this.spawnZone;
        this.hero.hp = Math.max(this.hero.hp, Math.floor(this.hero.maxHp * 0.5));
        if (this.player) {
            this.player.currentHp = Math.max(this.player.currentHp, Math.floor(this.player.maxHp * 0.35));
            this.player.currentMp = Math.max(this.player.currentMp, Math.floor(this.player.maxMp * 0.4));
        }
    }
}

// Global instance
const gameState = new GameState();
