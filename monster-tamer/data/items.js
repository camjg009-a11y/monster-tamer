// Item Definitions
const ITEMS = {
    potion: {
        id: 'potion',
        name: 'Potion',
        icon: '🧪',
        description: 'Hero +20 HP',
        type: 'healing',
        effect: { target: 'hero', stat: 'hp', amount: 20 },
        initialQuantity: 2
    },
    
    ether: {
        id: 'ether',
        name: 'Ether',
        icon: '💧',
        description: 'Monster +12 MP',
        type: 'mana',
        effect: { target: 'monster', stat: 'mp', amount: 12 },
        initialQuantity: 1
    },
    
    elixir: {
        id: 'elixir',
        name: 'Elixir',
        icon: '✨',
        description: '+15HP +8MP both',
        type: 'recovery',
        effect: [
            { target: 'hero', stat: 'hp', amount: 15 },
            { target: 'monster', stat: 'mp', amount: 8 }
        ],
        initialQuantity: 1
    }
};

// Equipment Definitions
const EQUIPMENT = {
    weapon: {
        slot: 'weapon',
        label: 'Weapon',
        items: {
            worn_wand: {
                id: 'worn_wand',
                name: 'Worn Wand',
                icon: '🪄',
                bonus: { atk: 2 },
                description: '+2 ATK'
            }
        }
    },
    
    armor: {
        slot: 'armor',
        label: 'Armor',
        items: {
            cloth_robe: {
                id: 'cloth_robe',
                name: 'Cloth Robe',
                icon: '👘',
                bonus: { def: 1 },
                description: '+1 DEF'
            }
        }
    },
    
    accessory: {
        slot: 'accessory',
        label: 'Accessory',
        items: {
            mana_bead: {
                id: 'mana_bead',
                name: 'Mana Bead',
                icon: '📿',
                bonus: { mp: 4 },
                description: '+4 MP'
            }
        }
    },
    
    boots: {
        slot: 'boots',
        label: 'Boots',
        items: {
            swift_sandals: {
                id: 'swift_sandals',
                name: 'Swift Sandals',
                icon: '👡',
                bonus: { spd: 1 },
                description: '+1 SPD'
            }
        }
    }
};

// Hero icons available
const HERO_ICONS = ['🧙', '🧝', '🦸', '🦹', '🥷', '🧛', '🧞', '🧚', '🤴', '👸', '🧑', '🎭'];
