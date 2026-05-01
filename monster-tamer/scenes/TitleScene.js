a// Title Scene - Old-school JRPG title screen with save slots

class TitleScene extends Phaser.Scene {
      constructor() {
                super({ key: 'TitleScene' });
                this.menuIndex = 0;
                this.maxMenuIndex = 2;
