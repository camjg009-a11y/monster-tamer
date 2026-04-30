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
                            fill: '#aaa',
                            fontStyle: 'bold'
            }).setOrigin(0.5);

            // Starter options
            const starters = ['emberpaw', 'tidalfin', 'mosscreep'];
                const startX = width / 2 - 250;
                const y = 280;

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
                            padding: { x: 30, y: 15 }
            }).setOrigin(0.5).setInteractive();

            this.beginButton.setAlpha(0.5);
                this.beginButton.on('pointerdown', () => this.beginAdventure());
    }

    createStarterCard(x, y, monster) {
                const card = this.add.container(x, y);

            // Card background
            const bg = this.add.rectangle(0, 0, 220, 280, 0x2a2a3e);
                const border = this.add.rectangle(0, 0, 220, 280);
                border.setStrokeStyle(3, 0x555555);

            // Type indicator
            const typeColors = { Demon: 0xFF4444, Ghost: 0x6666FF, Angel: 0xFFDD44 };
                const typeBar = this.add.rectangle(0, -140, 220, 30, typeColors[monster.type]);
                const typeText = this.add.text(0, -140, monster.type, {
                                fontSize: '14px',
                                fill: '#000',
                                fontStyle: 'bold'
                }).setOrigin(0.5);

            // Monster emoji
        const emoji = this.add.text(0, -80, monster.sprite, {                            fontSize: '64px'
            }).setOrigin(0.5);

            // Name
            const name = this.add.text(0, -30, monster.name, {
                            fontSize: '20px',
                            fill: '#fff',
                            fontStyle: 'bold'
            }).setOrigin(0.5);

            // Type text
            const type = this.add.text(0, -5, monster.type, {
                            fontSize: '14px',
                            fill: typeColors[monster.type]
            }).setOrigin(0.5);

            // Stats
        const stats = this.add.text(0, 30, `HP ${monster.baseStats.hp} · MP ${monster.baseStats.mp} · ATK ${monster.baseStats.atk}`, {                            fontSize: '14px',
                            fill: '#aaa'
            }).setOrigin(0.5);

            // Description
            const desc = this.add.text(0, 100, monster.description, {
                            fontSize: '12px',
                            fill: '#ccc',
                            align: 'center',
                            wordWrap: { width: 200 }
            }).setOrigin(0.5);

            card.add([bg, border, typeBar, typeText, emoji, name, type, stats, desc]);
                card.setSize(220, 280);
                card.setInteractive();

            card.on('pointerover', () => {
                            border.setStrokeStyle(3, 0xFFFFFF);
            });

            card.on('pointerout', () => {
                            if (this.selectedStarter !== monster.id) {
                                                border.setStrokeStyle(3, 0x555555);
                            }
            });

            card.border = border;
                return card;
    }

    selectStarter(id, card) {
                // Reset all borders
            this.starterCards.forEach(c => {
                            c.border.setStrokeStyle(3, 0x555555);
            });

            // Highlight selected
            card.border.setStrokeStyle(3, 0x00FF00);
                this.selectedStarter = id;
                this.beginButton.setAlpha(1);
    }

    beginAdventure() {
                if (!this.selectedStarter) return;

            // Initialize game state
            gameState.player.starter = this.selectedStarter;
                gameState.player.monsters = [this.selectedStarter];
                gameState.save();

            this.scene.start('MenuScene');
    }
}
