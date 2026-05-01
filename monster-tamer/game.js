// Main Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: 
                TitleScene,
        BootScene,
        StarterScene,
        WorldMapScene,
        BattleScene,
        MenuScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Global game reference
window.monsterTamerGame = game;

console.log('Monster Tamer - JRPG Edition');
console.log('===============================');
console.log('Built with Phaser 3');
console.log('Save/Load: Automatic via localStorage');
console.log('Controls: Click/Touch interface');
