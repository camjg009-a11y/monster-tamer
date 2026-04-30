// Menu Scene - Inventory, Codex, Party, Settings
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    init(data) {
        this.currentTab = data.tab || 'party';
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Semi-transparent overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
        overlay.setInteractive();
        
        // Menu panel
        const panel = this.add.rectangle(width / 2, height / 2, 600, 500, 0x1a1a2e).setOrigin(0.5);
        
        // Close button
        const closeBtn = this.add.text(width / 2 + 270, height / 2 - 230, '✕', {
            fontSize: '24px',
            fill: '#fff'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        
        closeBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('WorldMapScene');
        });
        
        // Tab buttons
        const tabs = ['Party', 'Codex', 'Items', 'Settings'];
        const tabY = height / 2 - 210;
        
        tabs.forEach((tab, i) => {
            const tabBtn = this.add.text(
                width / 2 - 270 + i * 140,
                tabY,
                tab,
                {
                    fontSize: '14px',
                    fill: tab.toLowerCase() === this.currentTab ? '#7F77DD' : '#888',
                    fontStyle: 'bold'
                }
            )
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });
            
            tabBtn.on('pointerdown', () => {
                this.currentTab = tab.toLowerCase();
                this.scene.restart({ tab: this.currentTab });
            });
        });
        
        // Tab content
        this.contentContainer = this.add.container(width / 2, height / 2 - 120);
        this.renderTabContent();
    }
    
    renderTabContent() {
        if (this.currentTab === 'party') {
            this.renderParty();
        } else if (this.currentTab === 'codex') {
            this.renderCodex();
        } else if (this.currentTab === 'items') {
            this.renderItems();
        } else if (this.currentTab === 'settings') {
            this.renderSettings();
        }
    }
    
    renderParty() {
        // Hero
        const heroCard = this.createPartyCard(-250, 0, {
            name: gameState.hero.name,
            icon: gameState.hero.icon,
            type: 'Hero',
            level: gameState.hero.level,
            hp: gameState.hero.hp,
            maxHp: gameState.hero.maxHp,
            atk: gameState.hero.atk,
            def: gameState.hero.def
        });
        this.contentContainer.add(heroCard);
        
        // Monster
        const monster = gameState.player.monsters[0];
                const monsterCard = this.createPartyCard(50, 0, {
                                name: monster.name,
                                icon: monster.sprite,
                                type: monster.type,
                                level: 1,
                                hp: monster.baseStats.hp,
                                maxHp: monster.baseStats.hp,
                                mp: monster.baseStats.mp,
                                maxMp: monster.baseStats.mp,
                                atk: monster.baseStats.atk,
                                def: monster.baseStats.def,
                                moves: monster.moves
                });this.contentContainer.add(monsterCard);
    }
    
    createPartyCard(x, y, data) {
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 280, 300, 0x2a2a3e);
        card.add(bg);
        
        const icon = this.add.text(0, -120, data.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);
        card.add(icon);
        
        const name = this.add.text(0, -60, data.name, {
            fontSize: '18px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        card.add(name);
        
        const type = this.add.text(0, -35, data.type, {
            fontSize: '14px',
            fill: '#7F77DD'
        }).setOrigin(0.5);
        card.add(type);
        
        const stats = this.add.text(0, -5, `Lv.${data.level} · ATK ${data.atk} · DEF ${data.def}`, {
            fontSize: '12px',
            fill: '#aaa'
        }).setOrigin(0.5);
        card.add(stats);
        
        // HP bar
        const hpLabel = this.add.text(0, 25, `HP: ${data.hp}/${data.maxHp}`, {
            fontSize: '11px',
            fill: '#1D9E75'
        }).setOrigin(0.5);
        card.add(hpLabel);
        
        if (data.mp !== undefined) {
            const mpLabel = this.add.text(0, 45, `MP: ${data.mp}/${data.maxMp}`, {
                fontSize: '11px',
                fill: '#7F77DD'
            }).setOrigin(0.5);
            card.add(mpLabel);
            
            if (data.moves && data.moves.length > 0) {
                const movesText = data.moves.map(m => m.name).join(' · ');
                const moves = this.add.text(0, 80, movesText, {
                    fontSize: '10px',
                    fill: '#666',
                    wordWrap: { width: 260 },
                    align: 'center'
                }).setOrigin(0.5);
                card.add(moves);
            }
        }
        
        return card;
    }
    
    renderCodex() {
        const title = this.add.text(0, -150, 'Monster Codex', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.contentContainer.add(title);
        
        const gridContainer = this.add.container(0, 0);
        
        Object.values(MONSTERS).forEach((monster, i) => {
            const status = gameState.codex[monster.id];
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = col * 170 - 170;
            const y = row * 120 - 60;
            
            const entry = this.createCodexEntry(x, y, monster, status);
            gridContainer.add(entry);
        });
        
        this.contentContainer.add(gridContainer);
    }
    
    createCodexEntry(x, y, monster, status) {
        const entry = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 150, 100, 0x2a2a3e);
        bg.setAlpha(status ? 1 : 0.3);
        entry.add(bg);
        
        if (!status) {
            const unknown = this.add.text(0, -20, '❓', {
                fontSize: '32px'
            }).setOrigin(0.5);
            entry.add(unknown);
            
            const qText = this.add.text(0, 15, '???', {
                fontSize: '12px',
                fill: '#666'
            }).setOrigin(0.5);
            entry.add(qText);
        } else {
            const sprite = this.add.text(0, -25, monster.sprite, {
                fontSize: '28px'
            }).setOrigin(0.5);
            entry.add(sprite);
            
            const name = this.add.text(0, 5, monster.name, {
                fontSize: '11px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            entry.add(name);
            
            const badge = this.add.text(0, 20, status.toUpperCase(), {
                fontSize: '9px',
                fill: status === 'owned' ? '#1D9E75' : '#7F77DD',
                backgroundColor: status === 'owned' ? '#0F6E56' : '#534AB7',
                padding: { x: 6, y: 2 }
            }).setOrigin(0.5);
            entry.add(badge);
            
            const num = this.add.text(0, 35, `#${String(monster.num).padStart(3, '0')}`, {
                fontSize: '9px',
                fill: '#666'
            }).setOrigin(0.5);
            entry.add(num);
        }
        
        return entry;
    }
    
    renderItems() {
        const title = this.add.text(0, -150, 'Inventory', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.contentContainer.add(title);
        
        const items = Object.values(gameState.inventory).filter(item => item.quantity > 0);
        
        if (items.length === 0) {
            const empty = this.add.text(0, 0, 'Bag is empty', {
                fontSize: '14px',
                fill: '#666'
            }).setOrigin(0.5);
            this.contentContainer.add(empty);
            return;
        }
        
        items.forEach((item, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = col * 180 - 180;
            const y = row * 100 - 30;
            
            const itemCard = this.createItemCard(x, y, item);
            this.contentContainer.add(itemCard);
        });
    }
    
    createItemCard(x, y, item) {
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 160, 80, 0x2a2a3e);
        card.add(bg);
        
        const icon = this.add.text(0, -20, item.icon, {
            fontSize: '28px'
        }).setOrigin(0.5);
        card.add(icon);
        
        const name = this.add.text(0, 10, `${item.name} ×${item.quantity}`, {
            fontSize: '12px',
            fill: '#fff'
        }).setOrigin(0.5);
        card.add(name);
        
        const desc = this.add.text(0, 25, item.description, {
            fontSize: '10px',
            fill: '#666'
        }).setOrigin(0.5);
        card.add(desc);
        
        return card;
    }
    
    renderSettings() {
        const title = this.add.text(0, -150, 'Settings', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.contentContainer.add(title);
        
        const nameLabel = this.add.text(0, -80, 'Hero Name:', {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        this.contentContainer.add(nameLabel);
        
        const currentName = this.add.text(0, -55, gameState.hero.name, {
            fontSize: '18px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.contentContainer.add(currentName);
        
        const iconLabel = this.add.text(0, 0, 'Hero Icon:', {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        this.contentContainer.add(iconLabel);
        
        const currentIcon = this.add.text(0, 40, gameState.hero.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);
        this.contentContainer.add(currentIcon);
    }
}
