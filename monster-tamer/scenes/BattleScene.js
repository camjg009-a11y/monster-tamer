// Battle Scene - Turn-based combat
class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }
    
    init(data) {
        this.zoneName = data.zoneName;
        this.battleManager = new BattleManager(this);
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x16213e).setOrigin(0);
        
        // Generate enemies
        this.battleManager.generateEnemies(this.zoneName);
        
        // Create UI
        this.createBattleArena();
        this.createBattleLog();
        this.createActionPanel();
        
        // Initial log
        const enemyNames = this.battleManager.enemies.map(e => e.name).join(' & ');
        this.addLog(`${enemyNames} appeared! ${gameState.hero.name}'s turn.`, '#FFF');
        
        // Start battle
        this.battleManager.phase = 'HERO';
        this.updateActionPanel();
    }
    
    createBattleArena() {
        const arena = this.add.container(400, 200);
        
        // Enemy row
        const enemyRow = this.add.container(0, -80);
        this.battleManager.enemies.forEach((enemy, i) => {
            const card = this.createEnemyCard(i * 180 - (this.battleManager.enemies.length - 1) * 90, 0, enemy);
            enemyRow.add(card);
        });
        arena.add(enemyRow);
        
        // Ally row
        const allyRow = this.add.container(0, 80);
        const heroCard = this.createHeroCard(-120, 0);
        const monsterCard = this.createMonsterCard(120, 0);
        allyRow.add(heroCard);
        allyRow.add(monsterCard);
        arena.add(allyRow);
        
        this.arena = arena;
    }
    
    createEnemyCard(x, y, enemy) {
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 140, 120, 0x2a2a3e);
        card.add(bg);
        
        const sprite = this.add.text(0, -30, enemy.sprite, {
            fontSize: '40px'
        }).setOrigin(0.5);
        card.add(sprite);
        
        const name = this.add.text(0, 10, enemy.name, {
            fontSize: '12px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        card.add(name);
        
        const hpBar = this.add.rectangle(0, 35, 120, 8, 0x1a1a2e);
        card.add(hpBar);
        
        const hpFill = this.add.rectangle(-60, 35, 120, 8, 0xE24B4A).setOrigin(0, 0.5);
        card.add(hpFill);
        
        const hpText = this.add.text(0, 48, `${enemy.currentHp}/${enemy.maxHp}`, {
            fontSize: '10px',
            fill: '#aaa'
        }).setOrigin(0.5);
        card.add(hpText);
        
        card.enemy = enemy;
        card.hpFill = hpFill;
        card.hpText = hpText;
        
        return card;
    }
    
    createHeroCard(x, y) {
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 140, 120, 0x2a2a3e);
        card.add(bg);
        
        const sprite = this.add.text(0, -30, gameState.hero.icon, {
            fontSize: '40px'
        }).setOrigin(0.5);
        card.add(sprite);
        
        const name = this.add.text(0, 10, gameState.hero.name, {
            fontSize: '12px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        card.add(name);
        
        const hpBar = this.add.rectangle(0, 35, 120, 8, 0x1a1a2e);
        card.add(hpBar);
        
        const hpFill = this.add.rectangle(-60, 35, 120, 8, 0x1D9E75).setOrigin(0, 0.5);
        card.add(hpFill);
        
        const hpText = this.add.text(0, 48, `${gameState.hero.hp}/${gameState.hero.maxHp}`, {
            fontSize: '10px',
            fill: '#aaa'
        }).setOrigin(0.5);
        card.add(hpText);
        
        this.heroCard = card;
        this.heroCard.hpFill = hpFill;
        this.heroCard.hpText = hpText;
        
        return card;
    }
    
    createMonsterCard(x, y) {
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 140, 120, 0x2a2a3e);
        card.add(bg);
        
        const sprite = this.add.text(0, -30, gameState.player.sprite, {
            fontSize: '40px'
        }).setOrigin(0.5);
        card.add(sprite);
        
        const name = this.add.text(0, 10, gameState.player.name, {
            fontSize: '12px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        card.add(name);
        
        const hpBar = this.add.rectangle(0, 30, 120, 6, 0x1a1a2e);
        card.add(hpBar);
        
        const hpFill = this.add.rectangle(-60, 30, 120, 6, 0x1D9E75).setOrigin(0, 0.5);
        card.add(hpFill);
        
        const mpBar = this.add.rectangle(0, 40, 120, 4, 0x1a1a2e);
        card.add(mpBar);
        
        const mpFill = this.add.rectangle(-60, 40, 120, 4, 0x7F77DD).setOrigin(0, 0.5);
        card.add(mpFill);
        
        const stats = this.add.text(0, 52, `HP:${gameState.player.currentHp}/${gameState.player.maxHp} MP:${gameState.player.currentMp}/${gameState.player.maxMp}`, {
            fontSize: '9px',
            fill: '#aaa'
        }).setOrigin(0.5);
        card.add(stats);
        
        this.monsterCard = card;
        this.monsterCard.hpFill = hpFill;
        this.monsterCard.mpFill = mpFill;
        this.monsterCard.statsText = stats;
        
        return card;
    }
    
    createBattleLog() {
        const log = this.add.container(400, 380);
        
        const bg = this.add.rectangle(0, 0, 600, 80, 0x2a2a3e).setOrigin(0.5);
        log.add(bg);
        
        this.logText = this.add.text(-280, -30, '', {
            fontSize: '12px',
            fill: '#fff',
            wordWrap: { width: 560 }
        }).setOrigin(0, 0);
        log.add(this.logText);
        
        this.battleLog = log;
    }
    
    createActionPanel() {
        this.actionPanel = this.add.container(400, 500);
    }
    
    updateActionPanel() {
        // Clear existing
        this.actionPanel.removeAll(true);
        
        const phase = this.battleManager.phase;
        
        if (phase === 'HERO') {
            this.showHeroActions();
        } else if (phase === 'MONSTER') {
            this.showMonsterActions();
        } else if (phase === 'REVIEW') {
            this.showReviewPanel();
        }
    }
    
    showHeroActions() {
        const title = this.add.text(0, -50, `Hero's Turn — ${gameState.hero.name}`, {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        this.actionPanel.add(title);
        
        const actions = [
            { label: 'Strike', desc: 'Physical · Pwr 10' },
            { label: 'Guard', desc: 'Reduce next hit' },
            { label: 'Item', desc: 'Use from bag' },
            { label: 'Skip', desc: 'Pass turn' }
        ];
        
        actions.forEach((action, i) => {
            const btn = this.createActionButton(i * 150 - 225, -10, action.label, action.desc);
            btn.on('pointerdown', () => this.handleHeroAction(action.label.toLowerCase()));
            this.actionPanel.add(btn);
        });
    }
    
    showMonsterActions() {
        const title = this.add.text(0, -50, `Monster's Turn — ${gameState.player.name}`, {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        this.actionPanel.add(title);
        
        gameState.player.moves.forEach((move, i) => {
            const canUse = gameState.player.currentMp >= move.cost;
            const btn = this.createMoveButton(
                (i % 2) * 300 - 150,
                Math.floor(i / 2) * 50 - 10,
                move,
                canUse
            );
            
            if (canUse) {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerdown', () => {
                    this.battleManager.queueMonsterAction({ type: 'move', moveIndex: i });
                    this.battleManager.phase = 'REVIEW';
                    this.updateActionPanel();
                });
            }
            
            this.actionPanel.add(btn);
        });
    }
    
    showReviewPanel() {
        const title = this.add.text(0, -70, 'Review Your Turn', {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        this.actionPanel.add(title);
        
        const confirmBtn = this.createActionButton(0, 20, 'Confirm Turn', '', true);
        confirmBtn.on('pointerdown', () => this.executeTurn());
        this.actionPanel.add(confirmBtn);
    }
    
    createActionButton(x, y, label, desc, primary = false) {
        const btn = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 140, 60, primary ? 0x7F77DD : 0x2a2a3e);
        bg.setInteractive({ useHandCursor: true });
        btn.add(bg);
        
        const labelText = this.add.text(0, desc ? -8 : 0, label, {
            fontSize: '14px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        btn.add(labelText);
        
        if (desc) {
            const descText = this.add.text(0, 8, desc, {
                fontSize: '10px',
                fill: '#aaa'
            }).setOrigin(0.5);
            btn.add(descText);
        }
        
        bg.on('pointerover', () => bg.setFillStyle(primary ? 0x534AB7 : 0x3a3a4e));
        bg.on('pointerout', () => bg.setFillStyle(primary ? 0x7F77DD : 0x2a2a3e));
        
        return btn;
    }
    
    createMoveButton(x, y, move, enabled) {
        const btn = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 280, 40, 0x2a2a3e);
        bg.setAlpha(enabled ? 1 : 0.5);
        btn.add(bg);
        
        const name = this.add.text(-130, -8, move.name, {
            fontSize: '13px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        btn.add(name);
        
        const info = this.add.text(-130, 8, `${move.type} · Pwr ${move.power} · ${move.cost} MP`, {
            fontSize: '10px',
            fill: '#aaa'
        }).setOrigin(0, 0.5);
        btn.add(info);
        
        return btn;
    }
    
    handleHeroAction(action) {
        if (action === 'strike') {
            this.battleManager.queueHeroAction({ type: 'strike' });
            this.battleManager.phase = 'MONSTER';
            this.updateActionPanel();
        } else if (action === 'guard') {
            this.battleManager.queueHeroAction({ type: 'guard' });
            this.battleManager.phase = 'MONSTER';
            this.updateActionPanel();
        } else if (action === 'item') {
            // TODO: Item selection UI
            this.battleManager.queueHeroAction({ type: 'skip' });
            this.battleManager.phase = 'MONSTER';
            this.updateActionPanel();
        } else if (action === 'skip') {
            this.battleManager.queueHeroAction({ type: 'skip' });
            this.battleManager.phase = 'MONSTER';
            this.updateActionPanel();
        }
    }
    
    executeTurn() {
        // Execute hero action
        const heroLogs = this.battleManager.executeHeroAction();
        heroLogs.forEach(log => this.addLog(log.text, log.color));
        this.updateBars();
        
        // Execute monster action
        const monsterLogs = this.battleManager.executeMonsterAction();
        monsterLogs.forEach(log => this.addLog(log.text, log.color));
        this.updateBars();
        
        // Check victory
        if (this.battleManager.allEnemiesDefeated()) {
            this.time.delayedCall(1000, () => this.handleVictory());
            return;
        }
        
        // Execute enemy turn
        this.battleManager.phase = 'ENEMY';
        this.updateActionPanel();
        
        this.time.delayedCall(1000, () => {
            const enemyLogs = this.battleManager.executeEnemyTurn();
            enemyLogs.forEach(log => this.addLog(log.text, log.color));
            this.updateBars();
            
            // Check defeat
            if (this.battleManager.playerDefeated()) {
                this.time.delayedCall(1000, () => this.handleDefeat());
                return;
            }
            
            // Next turn
            this.battleManager.phase = 'HERO';
            this.battleManager.queuedHeroAction = null;
            this.battleManager.queuedMonsterAction = null;
            this.updateActionPanel();
        });
    }
    
    updateBars() {
        // Update enemy bars
        this.arena.list[0].list.forEach(card => {
            const enemy = card.enemy;
            const pct = Math.max(0, enemy.currentHp / enemy.maxHp);
            card.hpFill.width = 120 * pct;
            card.hpText.setText(`${Math.max(0, enemy.currentHp)}/${enemy.maxHp}`);
            card.setAlpha(enemy.currentHp <= 0 ? 0.4 : 1);
        });
        
        // Update hero bar
        const heroPct = Math.max(0, gameState.hero.hp / gameState.hero.maxHp);
        this.heroCard.hpFill.width = 120 * heroPct;
        this.heroCard.hpText.setText(`${Math.max(0, gameState.hero.hp)}/${gameState.hero.maxHp}`);
        
        // Update monster bars
        const monHpPct = Math.max(0, gameState.player.currentHp / gameState.player.maxHp);
        const monMpPct = Math.max(0, gameState.player.currentMp / gameState.player.maxMp);
        this.monsterCard.hpFill.width = 120 * monHpPct;
        this.monsterCard.mpFill.width = 120 * monMpPct;
        this.monsterCard.statsText.setText(
            `HP:${Math.max(0, gameState.player.currentHp)}/${gameState.player.maxHp} MP:${Math.max(0, gameState.player.currentMp)}/${gameState.player.maxMp}`
        );
    }
    
    addLog(text, color = '#FFF') {
        const currentText = this.logText.text;
        const newText = currentText ? currentText + '\n' + text : text;
        
        // Keep only last 3 lines
        const lines = newText.split('\n');
        const displayText = lines.slice(-3).join('\n');
        
        this.logText.setText(displayText);
    }
    
    handleVictory() {
        const results = this.battleManager.handleVictory(this.zoneName);
        gameState.save();
        
        // Show victory screen
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        const victory = this.add.text(400, 200, '🏆 Victory!', {
            fontSize: '48px',
            fill: '#FFD700'
        }).setOrigin(0.5);
        
        const xpText = this.add.text(400, 280, `+${results.totalXp} XP · +${results.totalGold} Gold`, {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        if (results.leveledUp) {
            const levelUp = this.add.text(400, 320, `🎉 Level Up! Now level ${gameState.hero.level}`, {
                fontSize: '18px',
                fill: '#1D9E75'
            }).setOrigin(0.5);
        }
        
        const continueBtn = this.add.text(400, 400, 'Return to Map', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#7F77DD',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        
        continueBtn.on('pointerdown', () => {
            this.scene.start('WorldMapScene');
        });
    }
    
    handleDefeat() {
        gameState.returnToSpawn();
        gameState.save();
        
        // Show defeat screen
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        const defeat = this.add.text(400, 200, '💀 Defeated...', {
            fontSize: '48px',
            fill: '#D85A30'
        }).setOrigin(0.5);
        
        const msg = this.add.text(400, 280, `Returning to ${ZONES[gameState.spawnZone].name}`, {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const continueBtn = this.add.text(400, 360, 'Return to Camp', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#7F77DD',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        
        continueBtn.on('pointerdown', () => {
            this.scene.start('WorldMapScene');
        });
    }
}
