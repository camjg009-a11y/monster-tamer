// Boot Scene - Initial loading and setup
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            fill: '#fff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            fill: '#fff'
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Update loading bar
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Load assets (placeholder - will be replaced with real sprites)
        // For now we'll use emoji/text-based graphics
        
        // Hide HTML loading indicator
        const loadingEl = document.getElementById('loading');
        if (loadingEl) loadingEl.classList.add('hidden');
    }
    
    create() {
        // Try to load saved game
        const loaded = gameState.load();
        
        if (loaded && gameState.player) {
            // Has saved game with starter chosen
            this.scene.start('WorldMapScene');
        } else {
            // New game - choose starter
            gameState.reset();
            this.scene.start('StarterScene');
        }
    }
}
