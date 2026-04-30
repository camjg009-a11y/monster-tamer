// Zone Definitions
const ZONES = {
    village: {
        id: 'village',
        name: 'Silver Village',
        icon: '🏘️',
        safe: true,
        unlocked: true,
        description: 'A sanctuary. Rest here to fully recover.',
        position: { x: 200, y: 250 },
        color: '#9FE1CB',
        encounters: []
    },
    
    demon_wastes: {
        id: 'demon_wastes',
        name: 'Demon Wastes',
        icon: '🌋',
        type: 'Demon',
        difficulty: 1,
        unlocked: true,
        description: 'Scorched badlands. Demon beasts roam freely.',
        position: { x: 100, y: 100 },
        color: '#DC143C',
        encounters: [
            { monsterId: 'imp', baseHp: 22, baseAtk: 9, baseDef: 5, xp: 35, gold: 14 },
            { monsterId: 'hellhound', baseHp: 28, baseAtk: 11, baseDef: 6, xp: 48, gold: 18 }
        ]
    },
    
    phantom_moor: {
        id: 'phantom_moor',
        name: 'Phantom Moor',
        icon: '🌙',
        type: 'Ghost',
        difficulty: 1,
        unlocked: true,
        description: 'A misty bog haunted by restless spirits.',
        position: { x: 100, y: 400 },
        color: '#9B96C9',
        encounters: [
            { monsterId: 'skulker', baseHp: 19, baseAtk: 8, baseDef: 3, xp: 30, gold: 12 },
            { monsterId: 'wraith', baseHp: 24, baseAtk: 10, baseDef: 4, xp: 45, gold: 16 }
        ]
    },
    
    celestial_rise: {
        id: 'celestial_rise',
        name: 'Celestial Rise',
        icon: '☁️',
        type: 'Angel',
        difficulty: 1,
        unlocked: true,
        description: 'High peaks where angel-kind descend.',
        position: { x: 450, y: 100 },
        color: '#F5C842',
        encounters: [
            { monsterId: 'cherub', baseHp: 20, baseAtk: 8, baseDef: 5, xp: 32, gold: 13 },
            { monsterId: 'seraphim', baseHp: 26, baseAtk: 10, baseDef: 7, xp: 50, gold: 19 }
        ]
    },
    
    shadow_temple: {
        id: 'shadow_temple',
        name: 'Shadow Temple',
        icon: '⛩️',
        type: 'Mixed',
        difficulty: 3,
        unlocked: false,
        description: 'Ancient shrine where all darkness converges.',
        position: { x: 500, y: 280 },
        color: '#A32D2D',
        unlockRequirement: 'Win once in all 3 outer zones',
        encounters: []
    }
};

// Zone connections for map paths
const ZONE_CONNECTIONS = [
    ['village', 'demon_wastes'],
    ['village', 'phantom_moor'],
    ['village', 'celestial_rise'],
    ['demon_wastes', 'shadow_temple'],
    ['phantom_moor', 'shadow_temple'],
    ['celestial_rise', 'shadow_temple']
];
