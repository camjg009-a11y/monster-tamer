// World Map Scene - Zone navigation
class WorldMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldMapScene' });
        this.selectedZone = null;
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x16213e).setOrigin(0);
        
        // Title
        this.add.text(width / 2, 30, 'World Map', {
            fontSize: '28px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Hero info header
        this.createHeroHeader();
        
        // Map area
        this.createMapArea();
        
        // Zone info panel
        this.createZonePanel();
        
        // Menu buttons
        this.createMenuButtons();
        
        // Select current zone by default
        this.selectedZone = gameState.currentZone;
        this.updateZonePanel();
    }
    
    createHeroHeader() {
        const header = this.add.container(400, 30);
        
        const bg = this.add.rectangle(0, 0, 350, 50, 0x2a2a3e, 0.8).setOrigin(0.5);
        header.add(bg);
        
        const icon = this.add.text(-150, 0, gameState.hero.icon, {
            fontSize: '24px'
        }).setOrigin(0.5);
        header.add(icon);
        
        const name = this.add.text(-110, -8, gameState.hero.name, {
            fontSize: '16px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        header.add(name);
        
        const stats = `Lv.${gameState.hero.level} · ${gameState.wins} wins · ${gameState.hero.gold}g`;
        const statsText = this.add.text(-110, 8, stats, {
            fontSize: '12px',
            fill: '#aaa'
        }).setOrigin(0, 0.5);
        header.add(statsText);
        
        this.heroHeader = header;
    }
    
    createMenuButtons() {
        const buttons = ['Party', 'Codex', 'Items', '⚙'];
        const startX = 620;
        const y = 30;
        
        buttons.forEach((label, i) => {
            const btn = this.add.text(startX + i * 60, y, label, {
                fontSize: '14px',
                fill: '#fff',
                backgroundColor: '#2a2a3e',
                padding: { x: 12, y: 6 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
            
            btn.on('pointerdown', () => {
                this.scene.launch('MenuScene', { tab: label.toLowerCase().replace('⚙', 'settings') });
                this.scene.pause();
            });
            
            btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3a3a4e' }));
            btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2a2a3e' }));
        });
    }
    
    createMapArea() {
        const mapBg = this.add.rectangle(400, 300, 600, 350, 0x2a2a3e).setOrigin(0.5);
        
        // Draw zone connections
        ZONE_CONNECTIONS.forEach(([from, to]) => {
            const zoneFrom = ZONES[from];
            const zoneTo = ZONES[to];
            
            const line = this.add.line(
                0, 0,
                zoneFrom.position.x, zoneFrom.position.y,
                zoneTo.position.x, zoneTo.position.y,
                zoneTo.unlocked ? 0x666666 : 0x444444,
                zoneTo.unlocked ? 1 : 0.5
            );
            line.setOrigin(0);
            line.setLineWidth(zoneTo.unlocked ? 2 : 1);
            if (!zoneTo.unlocked) line.setStrokeStyle(1, 0x444444, 1, true);
        });
        
        // Create zone nodes
        Object.values(ZONES).forEach(zone => {
            this.createZoneNode(zone);
        });
    }
    
    createZoneNode(zone) {
        const node = this.add.container(zone.position.x, zone.position.y);
        
        const isCurrent = zone.id === gameState.currentZone;
        const isSpawn = zone.id === gameState.spawnZone;
        const isSelected = zone.id === this.selectedZone;
        const wins = gameState.zoneWins[zone.id] || 0;
        
        // Node background
        const size = isCurrent ? 70 : 60;
        const bg = this.add.circle(0, 0, size / 2, 
            zone.unlocked ? Phaser.Display.Color.HexStringToColor(zone.color).color : 0x444444);
        bg.setStrokeStyle(isSelected ? 4 : 2, isSelected ? 0x7F77DD : 0xffffff);
        bg.setAlpha(zone.unlocked ? 1 : 0.5);
        node.add(bg);
        
        // Icon
        const icon = this.add.text(0, -8, zone.icon, {
            fontSize: '24px'
        }).setOrigin(0.5);
        node.add(icon);
        
        // Name
        const name = this.add.text(0, 18, zone.name.split(' ')[0], {
            fontSize: '10px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        node.add(name);
        
        // Indicators
        let indicators = '';
        if (isCurrent) indicators += '📍';
        if (isSpawn && !isCurrent) indicators += '⛺';
        if (wins > 0 && !zone.safe) indicators += '⭐'.repeat(Math.min(wins, 3));
        
        if (indicators) {
            const ind = this.add.text(0, 32, indicators, {
                fontSize: '10px'
            }).setOrigin(0.5);
            node.add(ind);
        }
        
        // Make interactive
        if (zone.unlocked) {
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerdown', () => {
                this.selectedZone = zone.id;
                this.updateZonePanel();
                this.scene.restart();
            });
        }
        
        node.zoneData = zone;
    }
    
    createZonePanel() {
        const panel = this.add.container(400, 540);
        
        const bg = this.add.rectangle(0, 0, 600, 100, 0x2a2a3e).setOrigin(0.5);
        panel.add(bg);
        
        this.zonePanel = panel;
        this.zonePanelBg = bg;
    }
    
    updateZonePanel() {
        // Clear existing content
        while (this.zonePanel.length > 1) {
            this.zonePanel.list[1].destroy();
        }
        
        if (!this.selectedZone) return;
        
        const zone = ZONES[this.selectedZone];
        const isCurrent = zone.id === gameState.currentZone;
        const isSpawn = zone.id === gameState.spawnZone;
        const wins = gameState.zoneWins[zone.id] || 0;
        
        // Zone name and type
        const title = this.add.text(-280, -30, zone.name, {
            fontSize: '18px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.zonePanel.add(title);
        
        const typeLabel = zone.safe ? 'Safe Zone' : zone.type + ' Zone';
        const winsLabel = wins > 0 && !zone.safe ? ` · ${wins} win${wins !== 1 ? 's' : ''}` : '';
        const subtitle = this.add.text(-280, -5, typeLabel + winsLabel, {
            fontSize: '12px',
            fill: zone.color
        }).setOrigin(0, 0.5);
        this.zonePanel.add(subtitle);
        
        // Description
        const desc = this.add.text(-280, 15, zone.description, {
            fontSize: '12px',
            fill: '#aaa'
        }).setOrigin(0, 0.5);
        this.zonePanel.add(desc);
        
        // Action buttons
        let btnX = -280;
        const btnY = 40;
        
        if (!zone.unlocked) {
            const lockText = this.add.text(btnX, btnY, `🔒 ${zone.unlockRequirement}`, {
                fontSize: '11px',
                fill: '#888'
            }).setOrigin(0, 0.5);
            this.zonePanel.add(lockText);
        } else if (isCurrent) {
            // Current zone actions
            if (zone.safe) {
                const restBtn = this.createButton(btnX, btnY, '✨ Rest & Heal');
                restBtn.on('pointerdown', () => {
                    gameState.rest();
                    this.scene.restart();
                });
                this.zonePanel.add(restBtn);
                btnX += 140;
            } else {
                const battleBtn = this.createButton(btnX, btnY, '⚔ Battle Here', true);
                battleBtn.on('pointerdown', () => {
                    this.scene.start('BattleScene', { zoneName: zone.id });
                });
                this.zonePanel.add(battleBtn);
                btnX += 140;
            }
            
            if (!isSpawn) {
                const spawnBtn = this.createButton(btnX, btnY, '⛺ Set Spawn');
                spawnBtn.on('pointerdown', () => {
                    gameState.spawnZone = zone.id;
                    gameState.save();
                    this.scene.restart();
                });
                this.zonePanel.add(spawnBtn);
            } else {
                const spawnLabel = this.add.text(btnX, btnY, '⛺ Spawn set', {
                    fontSize: '12px',
                    fill: zone.color
                }).setOrigin(0, 0.5);
                this.zonePanel.add(spawnLabel);
            }
        } else {
            // Other zones
            const travelBtn = this.createButton(btnX, btnY, '→ Travel Here');
            travelBtn.on('pointerdown', () => {
                gameState.currentZone = zone.id;
                if (zone.safe) gameState.rest();
                gameState.save();
                this.scene.restart();
            });
            this.zonePanel.add(travelBtn);
            btnX += 140;
            
            if (!isSpawn) {
                const spawnBtn = this.createButton(btnX, btnY, '⛺ Set Spawn');
                spawnBtn.on('pointerdown', () => {
                    gameState.spawnZone = zone.id;
                    gameState.save();
                    this.scene.restart();
                });
                this.zonePanel.add(spawnBtn);
            }
        }
    }
    
    createButton(x, y, text, primary = false) {
        const btn = this.add.text(x, y, text, {
            fontSize: '12px',
            fill: '#fff',
            backgroundColor: primary ? '#7F77DD' : '#2a2a3e',
            padding: { x: 12, y: 6 }
        })
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });
        
        btn.on('pointerover', () => btn.setStyle({ backgroundColor: primary ? '#534AB7' : '#3a3a4e' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: primary ? '#7F77DD' : '#2a2a3e' }));
        
        return btn;
    }
}
