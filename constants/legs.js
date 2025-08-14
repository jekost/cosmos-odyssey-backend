// constants/legs.js
const { v5: uuidv5 } = require('uuid');

// Deterministic namespace (fixed forever so UUIDs don't change)
const NAMESPACE = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

// Fixed planet UUIDs (these must match constants/planets.js)
const planets = [
    { id: uuidv5('Mercury', NAMESPACE), name: 'Mercury' },
    { id: uuidv5('Venus', NAMESPACE),   name: 'Venus' },
    { id: uuidv5('Earth', NAMESPACE),   name: 'Earth' },
    { id: uuidv5('Mars', NAMESPACE),    name: 'Mars' },
    { id: uuidv5('Jupiter', NAMESPACE), name: 'Jupiter' },
    { id: uuidv5('Saturn', NAMESPACE),  name: 'Saturn' },
    { id: uuidv5('Uranus', NAMESPACE),  name: 'Uranus' },
    { id: uuidv5('Neptune', NAMESPACE), name: 'Neptune' }
];

// Approximate distances between planets (in km, placeholder values)
const distanceMap = {
    'Mercury-Venus': 50000000,
    'Mercury-Earth': 92000000,
    'Mercury-Mars': 120000000,
    'Mercury-Jupiter': 628000000,
    'Mercury-Saturn': 1275000000,
    'Mercury-Uranus': 2720000000,
    'Mercury-Neptune': 4350000000,
    'Venus-Earth': 41000000,
    'Venus-Mars': 80000000,
    'Venus-Jupiter': 670000000,
    'Venus-Saturn': 1340000000,
    'Venus-Uranus': 2790000000,
    'Venus-Neptune': 4500000000,
    'Earth-Mars': 78000000,
    'Earth-Jupiter': 628730000,
    'Earth-Saturn': 1275000000,
    'Earth-Uranus': 2723950000,
    'Earth-Neptune': 4351400000,
    'Mars-Jupiter': 550000000,
    'Mars-Saturn': 1220000000,
    'Mars-Uranus': 2660000000,
    'Mars-Neptune': 4290000000,
    'Jupiter-Saturn': 651000000,
    'Jupiter-Uranus': 2140000000,
    'Jupiter-Neptune': 3660000000,
    'Saturn-Uranus': 1430000000,
    'Saturn-Neptune': 2900000000,
    'Uranus-Neptune': 1620000000
};

// Generate legs
const legs = [];
for (const from of planets) {
    for (const to of planets) {
        if (from.id === to.id) continue; // skip same planet

        const key1 = `${from.name}-${to.name}`;
        const key2 = `${to.name}-${from.name}`;
        const distance = distanceMap[key1] || distanceMap[key2] || 0;

        legs.push({
            id: uuidv5(`${from.name}-${to.name}`, NAMESPACE),
            fromId: from.id,
            toId: to.id,
            distance
        });
    }
}

module.exports = legs;
