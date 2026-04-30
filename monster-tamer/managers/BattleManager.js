// Battle Manager - Handles combat calculations and turn flow
class BattleManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.phase = 'HERO'; // HERO, MONSTER, REVIEW, ENEMY, COMPLETE
        this.queuedHeroAction = null;
        this.queuedMonsterAction = null;
        this.battleLog = [];
    }
    
    // Generate enemy encounters
    generateEnemies(zoneName) {
        const zone = ZONES[zoneName];
        if (!zone || !zone.encounters || zone.encounters.length === 0) {
            return [];
        }
        
        const encounterPool = zone.encounters;
        const zoneWins = gameState.zoneWins[zoneName] || 0;
        const difficulty = zone.difficulty || 1;
        
        // Determine number of enemies
        let count = 1;
        if (zoneWins >= 1 || difficulty >= 3) {
            const r = Math.random();
            count = difficulty >= 3 
                ? (r < 0.35 ? 1 : r < 0.75 ? 2 : 3)
                : (r < 0.65 ? 1 : r < 0.9 ? 2 : 3);
        }
        
        // Create enemies
        this.enemies = [];
        for (let i = 0; i < count; i++) {
            const template = Phaser.Utils.Array.GetRandom(encounterPool);
            const monster = MONSTERS[template.monsterId];
            const scaling = Math.floor((zoneWins + difficulty - 1) * 1.1);
            
            this.enemies.push({
                id: template.monsterId,
                name: monster.name,
                type: monster.type,
                sprite: monster.sprite,
                level: 1 + zoneWins,
                maxHp: template.baseHp + scaling * 2,
                currentHp: template.baseHp + scaling * 2,
                atk: template.baseAtk + scaling,
                def: template.baseDef + Math.floor(scaling / 2),
                xp: template.xp,
                gold: template.gold,
                index: i
            });
            
            // Mark as seen in codex
            if (!gameState.codex[template.monsterId]) {
                gameState.codex[template.monsterId] = 'seen';
            }
        }
        
        return this.enemies;
    }
    
    // Calculate damage
    calculateDamage(attacker, defender, power) {
        const baseDmg = (attacker * power) / (defender + 5);
        const variance = Math.floor(Math.random() * 3) - 1;
        return Math.max(1, Math.floor(baseDmg) + variance);
    }
    
    // Get type effectiveness multiplier
    getTypeMultiplier(attackType, defenderType) {
        return TYPE_CHART[attackType][defenderType] || 1.0;
    }
    
    // Queue hero action
    queueHeroAction(action) {
        this.queuedHeroAction = action;
    }
    
    // Queue monster action
    queueMonsterAction(action) {
        this.queuedMonsterAction = action;
    }
    
    // Execute hero action
    executeHeroAction() {
        const action = this.queuedHeroAction;
        const log = [];
        
        if (action.type === 'strike') {
            const target = this.getFirstAliveEnemy();
            if (target) {
                const dmg = this.calculateDamage(gameState.hero.atk + 2, target.def, 10);
                target.currentHp -= dmg;
                log.push({ text: `${gameState.hero.name} strikes ${target.name} for ${dmg} damage!`, color: '#FFF' });
            }
        } else if (action.type === 'guard') {
            gameState.hero.guarding = true;
            log.push({ text: `${gameState.hero.name} takes a defensive stance! 🛡`, color: '#1D9E75' });
        } else if (action.type === 'item') {
            const item = gameState.inventory[action.itemId];
            if (item && item.quantity > 0) {
                item.quantity--;
                const effects = Array.isArray(item.effect) ? item.effect : [item.effect];
                
                effects.forEach(eff => {
                    const target = eff.target === 'hero' ? gameState.hero : gameState.player;
                    const stat = eff.stat;
                    
                    if (stat === 'hp') {
                        const heal = Math.min(eff.amount, target.maxHp - target.hp);
                        target.hp += heal;
                        log.push({ text: `${item.name} restored ${heal} HP to ${target.name}!`, color: '#1D9E75' });
                    } else if (stat === 'mp') {
                        const restore = Math.min(eff.amount, target.maxMp - target.currentMp);
                        target.currentMp += restore;
                        log.push({ text: `${item.name} restored ${restore} MP to ${target.name}!`, color: '#7F77DD' });
                    }
                });
            }
        } else if (action.type === 'skip') {
            log.push({ text: `${gameState.hero.name} skips their turn.`, color: '#888' });
        }
        
        return log;
    }
    
    // Execute monster action
    executeMonsterAction() {
        const action = this.queuedMonsterAction;
        const log = [];
        
        if (gameState.player.currentHp <= 0) {
            return log;
        }
        
        if (action.type === 'skip') {
            log.push({ text: `${gameState.player.name} skips their turn.`, color: '#888' });
            return log;
        }
        
        const move = gameState.player.moves[action.moveIndex];
        const target = this.getFirstAliveEnemy();
        
        if (!target || gameState.player.currentMp < move.cost) {
            return log;
        }
        
        gameState.player.currentMp -= move.cost;
        const multiplier = this.getTypeMultiplier(move.type, target.type);
        const dmg = Math.round(this.calculateDamage(gameState.player.atk, target.def, move.power) * multiplier);
        target.currentHp -= dmg;
        
        let effectiveness = '';
        if (multiplier > 1) effectiveness = ' Super effective!';
        else if (multiplier < 1) effectiveness = ' Not very effective...';
        
        const color = TYPE_THEMES[move.type].text;
        log.push({ text: `${gameState.player.name} used ${move.name}! ${dmg} damage!${effectiveness}`, color });
        
        return log;
    }
    
    // Execute enemy turn
    executeEnemyTurn() {
        const log = [];
        const aliveEnemies = this.enemies.filter(e => e.currentHp > 0);
        
        aliveEnemies.forEach(enemy => {
            // Choose target (hero or monster)
            const targetHero = gameState.player.currentHp <= 0 || Math.random() < 0.5;
            const target = targetHero ? gameState.hero : gameState.player;
            
            // Calculate defense with guard bonus
            const defValue = target.def + (targetHero && gameState.hero.guarding ? 4 : 0);
            const multiplier = this.getTypeMultiplier(enemy.type, targetHero ? 'Normal' : gameState.player.type);
            const dmg = Math.max(1, Math.round(this.calculateDamage(enemy.atk, defValue, 9) * multiplier));
            
            if (targetHero) {
                gameState.hero.hp -= dmg;
                const guardText = gameState.hero.guarding ? ' (guarded!)' : '';
                log.push({ text: `${enemy.name} attacks ${gameState.hero.name} for ${dmg} damage!${guardText}`, color: '#D85A30' });
            } else {
                gameState.player.currentHp -= dmg;
                log.push({ text: `${enemy.name} attacks ${gameState.player.name} for ${dmg} damage!`, color: '#D85A30' });
            }
        });
        
        // Reset guard
        gameState.hero.guarding = false;
        
        return log;
    }
    
    // Get first alive enemy
    getFirstAliveEnemy() {
        return this.enemies.find(e => e.currentHp > 0) || null;
    }
    
    // Check if all enemies are defeated
    allEnemiesDefeated() {
        return this.enemies.every(e => e.currentHp <= 0);
    }
    
    // Check if player lost
    playerDefeated() {
        return gameState.hero.hp <= 0;
    }
    
    // Handle victory
    handleVictory(zoneName) {
        gameState.zoneWins[zoneName] = (gameState.zoneWins[zoneName] || 0) + 1;
        gameState.wins++;
        
        const totalXp = this.enemies.reduce((sum, e) => sum + e.xp, 0) + gameState.wins * 4;
        const totalGold = this.enemies.reduce((sum, e) => sum + e.gold, 0) + gameState.wins * 2;
        
        gameState.hero.xp += totalXp;
        gameState.hero.gold += totalGold;
        
        let leveledUp = false;
        if (gameState.hero.xp >= gameState.hero.level * 60) {
            gameState.levelUp();
            leveledUp = true;
        }
        
        // Check shadow temple unlock
        ZONES.shadow_temple.unlocked = 
            gameState.zoneWins.demon_wastes > 0 &&
            gameState.zoneWins.phantom_moor > 0 &&
            gameState.zoneWins.celestial_rise > 0;
        
        return { totalXp, totalGold, leveledUp };
    }
    
    // Reset for new battle
    reset() {
        this.enemies = [];
        this.phase = 'HERO';
        this.queuedHeroAction = null;
        this.queuedMonsterAction = null;
        this.battleLog = [];
        gameState.hero.guarding = false;
    }
}
