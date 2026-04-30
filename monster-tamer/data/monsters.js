// Monster Database
const MONSTERS = {
    emberpaw: {
        id: 'emberpaw',
        num: 1,
        name: 'Emberpaw',
        type: 'Demon',
        rarity: 'Starter',
        habitat: 'Starter choice',
        description: 'A hell-wolf pup wreathed in crimson flames. Fiercely loyal to those it bonds with, its howl can ignite fear in the hearts of angels.',
        sprite: '🐺', // Placeholder - will be replaced with real images
        baseStats: {
            hp: 34,
            mp: 26,
            atk: 12,
            def: 6
        },
        ability: {
            name: 'Infernal Vigor',
            description: 'Demon-type moves deal 5% more damage'
        },
        moves: [
            { name: 'Hellclaw', power: 10, type: 'Demon', cost: 4 },
            { name: 'Brimstone Bite', power: 14, type: 'Demon', cost: 8 },
            { name: 'Tackle', power: 8, type: 'Normal', cost: 2 },
            { name: 'Inferno', power: 18, type: 'Demon', cost: 12 }
        ]
    },
    
    tidalfin: {
        id: 'tidalfin',
        num: 2,
        name: 'Tidalfin',
        type: 'Ghost',
        rarity: 'Starter',
        habitat: 'Starter choice',
        description: 'An ethereal octopus that drifts between realms. Its tentacles can grasp both the living and the dead, seeking those with pure intentions.',
        sprite: '🐙',
        baseStats: {
            hp: 30,
            mp: 30,
            atk: 10,
            def: 8
        },
        ability: {
            name: 'Spectral Flow',
            description: 'Restores 2 MP at the end of each turn'
        },
        moves: [
            { name: 'Phantom Rush', power: 10, type: 'Ghost', cost: 4 },
            { name: 'Soul Drain', power: 13, type: 'Ghost', cost: 7 },
            { name: 'Tackle', power: 8, type: 'Normal', cost: 2 },
            { name: 'Haunting Wave', power: 18, type: 'Ghost', cost: 12 }
        ]
    },
    
    mosscreep: {
        id: 'mosscreep',
        num: 3,
        name: 'Mosscreep',
        type: 'Angel',
        rarity: 'Starter',
        habitat: 'Starter choice',
        description: 'A divine swan touched by celestial light. Its song can heal wounds and calm raging storms while protecting sacred groves across the realm.',
        sprite: '🦢',
        baseStats: {
            hp: 36,
            mp: 22,
            atk: 9,
            def: 9
        },
        ability: {
            name: 'Sacred Blessing',
            description: 'Restores 3 HP at the end of each turn'
        },
        moves: [
            { name: 'Sacred Vine', power: 10, type: 'Angel', cost: 4 },
            { name: 'Holy Blade', power: 13, type: 'Angel', cost: 7 },
            { name: 'Tackle', power: 8, type: 'Normal', cost: 2 },
            { name: 'Divine Burst', power: 18, type: 'Angel', cost: 12 }
        ]
    },
    
    imp: {
        id: 'imp',
        num: 4,
        name: 'Imp',
        type: 'Demon',
        rarity: 'Common',
        habitat: 'Demon Wastes',
        description: 'Mischievous demons that roam scorched wastelands. They delight in causing minor chaos and testing the resolve of mortal travelers.',
        sprite: '😈',
        baseStats: {
            hp: 22,
            mp: 16,
            atk: 9,
            def: 5
        },
        ability: {
            name: 'Trickster',
            description: '15% chance to dodge incoming physical attacks'
        },
        moves: []
    },
    
    hellhound: {
        id: 'hellhound',
        num: 5,
        name: 'Hellhound',
        type: 'Demon',
        rarity: 'Uncommon',
        habitat: 'Demon Wastes',
        description: 'Massive beasts of living flame and fury. Once guardians of ancient demon lords, they now hunt freely through burning volcanic lands.',
        sprite: '🦁',
        baseStats: {
            hp: 28,
            mp: 18,
            atk: 11,
            def: 6
        },
        ability: {
            name: 'Flame Body',
            description: 'Attackers who make contact take 2 damage in return'
        },
        moves: []
    },
    
    skulker: {
        id: 'skulker',
        num: 6,
        name: 'Skulker',
        type: 'Ghost',
        rarity: 'Common',
        habitat: 'Phantom Moor',
        description: 'Restless spirits of forgotten souls. They wander misty bogs endlessly, seeking to complete unfinished tasks from their mortal lives.',
        sprite: '💀',
        baseStats: {
            hp: 19,
            mp: 20,
            atk: 8,
            def: 3
        },
        ability: {
            name: 'Phase Shift',
            description: '20% chance to phase through attacks and avoid damage'
        },
        moves: []
    },
    
    wraith: {
        id: 'wraith',
        num: 7,
        name: 'Wraith',
        type: 'Ghost',
        rarity: 'Uncommon',
        habitat: 'Phantom Moor',
        description: 'Vengeful specters born from intense betrayal. Their piercing screams echo through fog and can freeze the blood of even the bravest.',
        sprite: '🦇',
        baseStats: {
            hp: 24,
            mp: 24,
            atk: 10,
            def: 4
        },
        ability: {
            name: 'Life Drain',
            description: 'Restores HP equal to 5% of damage dealt to enemies'
        },
        moves: []
    },
    
    cherub: {
        id: 'cherub',
        num: 8,
        name: 'Cherub',
        type: 'Angel',
        rarity: 'Common',
        habitat: 'Celestial Rise',
        description: 'Young celestial beings learning the ways of divine judgment. Their gentle light can soothe suffering and guide lost travelers home.',
        sprite: '🕊️',
        baseStats: {
            hp: 20,
            mp: 18,
            atk: 8,
            def: 5
        },
        ability: {
            name: 'Divine Grace',
            description: 'Recovers from harmful status effects 30% faster'
        },
        moves: []
    },
    
    seraphim: {
        id: 'seraphim',
        num: 9,
        name: 'Seraphim',
        type: 'Angel',
        rarity: 'Uncommon',
        habitat: 'Celestial Rise',
        description: 'Sacred warriors cloaked in radiant wings. They descend from holy mountain peaks to smite evil and protect the innocent from darkness.',
        sprite: '🦋',
        baseStats: {
            hp: 26,
            mp: 22,
            atk: 10,
            def: 7
        },
        ability: {
            name: 'Radiant Shield',
            description: 'Reduces incoming Ghost-type damage by 15%'
        },
        moves: []
    }
};

// Type effectiveness multipliers
const TYPE_CHART = {
    Demon: { Angel: 1.5, Ghost: 0.7, Demon: 1.0, Normal: 1.0 },
    Ghost: { Demon: 1.5, Angel: 0.7, Ghost: 1.0, Normal: 1.0 },
    Angel: { Ghost: 1.5, Demon: 0.7, Angel: 1.0, Normal: 1.0 },
    Normal: { Demon: 1.0, Ghost: 1.0, Angel: 1.0, Normal: 1.0 }
};

// Type color themes
const TYPE_THEMES = {
    Demon: { bg: '#3D1414', border: '#DC143C', text: '#DC143C' },
    Ghost: { bg: '#FDFCFF', border: '#E8E5F5', text: '#9B96C9' },
    Angel: { bg: '#FFF8E1', border: '#F5C842', text: '#F5C842' },
    Normal: { bg: '#E0E0E0', border: '#888', text: '#444' }
};
