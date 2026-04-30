// Starter Selection Scene
class StarterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StarterScene' });
        this.selectedStarter = null;
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);
        
        // Title
        this.add.text(width / 2, 60, 'Choose Your Starter', {
            fontSize: '32px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(width / 2, 100, 'Demon beats Angel · Angel beats Ghost · Ghost beats Demon', {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        
        // Starter options
        const starters = ['emberpaw', 'tidalfin', 'mosscreep'];
        const startX = width / 2 - 250;
        const y = 200;
        
        this.starterCards = [];
        
        starters.forEach((id, index) => {
            const monster = MONSTERS[id];
            const x = startX + index * 250;
            
            const card = this.createStarterCard(x, y, monster);
            this.starterCards.push(card);
            
            card.on('pointerdown', () => {
                this.selectStarter(id, card);
            });
        });
        
        // Begin button
        this.beginButton = this.add.text(width / 2, height - 80, 'Begin Adventure', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#7F77DD',
            padding: { x: 30, y: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setAlpha(0.5);
        
        this.beginButton.on('pointerdown', () => {
            if (this.selectedStarter) {
                gameState.setStarter(this.selectedStarter);
                gameState.save();
                this.scene.start('WorldMapScene');
            }
        });
        
        this.beginButton.on('pointerover', () => {
            if (this.selectedStarter) {
                this.beginButton.setStyle({ backgroundColor: '#534AB7' });
            }
        });
        
        this.beginButton.on('pointerout', () => {
            this.beginButton.setStyle({ backgroundColor: '#7F77DD' });
        });
    }
    
    createStarterCard(x, y, monster) {
        const container = this.add.container(x, y);
        
        const theme = TYPE_THEMES[monster.type];
        
        // Card background
        const bg = this.add.rectangle(0, 0, 200, 280, 0x2a2a3e);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(theme.border).color);
        container.add(bg);
        
        // Monster sprite (using emoji for now)
        const sprite = this.add.text(0, -80, monster.sprite, {
            fontSize: '60px'
        }).setOrigin(0.5);
        container.add(sprite);
        
        // Name
        const name = this.add.text(0, -20, monster.name, {
            fontSize: '18px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(name);
        
        // Type badge
        const typeBadge = this.add.text(0, 10, monster.type, {
            fontSize: '14px',
            fill: theme.border,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(typeBadge);
        
        // Stats
        const stats = `HP ${monster.baseStats.hp} · MP ${monster.baseStats.mp} · ATK ${monster.baseStats.atk}`;
        const statsText = this.add.text(0, 40, stats, {
            fontSize: '12px',
            fill: '#aaa'
        }).setOrigin(0.5);
        container.add(statsText);
        
        // Description (shortened)
        const desc = monster.description.substring(0, 80) + '...';
        const descText = this.add.text(0, 90, desc, {
            fontSize: '11px',
            fill: '#888',
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0.5);
        container.add(descText);
        
        // Make interactive
        bg.setInteractive({ useHandCursor: true });
        container.setSize(200, 280);
        
        container.selectedOutline = null;
        
        return container;
    }
    
    selectStarter(id, card) {
        this.selectedStarter = id;
        
        // Remove previous selection
        this.starterCards.forEach(c => {
            if (c.selectedOutline) {
                c.selectedOutline.destroy();
                c.selectedOutline = null;
            }
        });
        
        // Add selection outline
        card.selectedOutline = this.add.rectangle(0, 0, 206, 286, 0x7F77DD, 0)
            .setStrokeStyle(4, 0x7F77DD);
        card.addAt(card.selectedOutline, 0);
        
        // Enable begin button
        this.beginButton.setAlpha(1);
    }
}
