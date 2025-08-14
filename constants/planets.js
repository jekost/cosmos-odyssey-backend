const { v5: uuidv5 } = require('uuid');
const NAMESPACE = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

const planets = [
  { name: 'Mercury', distanceFromSun: 57_900_000 },
  { name: 'Venus',   distanceFromSun: 108_200_000 },
  { name: 'Earth',   distanceFromSun: 149_600_000 },
  { name: 'Mars',    distanceFromSun: 227_900_000 },
  { name: 'Jupiter', distanceFromSun: 778_500_000 },
  { name: 'Saturn',  distanceFromSun: 1_433_500_000 },
  { name: 'Uranus',  distanceFromSun: 2_872_500_000 },
  { name: 'Neptune', distanceFromSun: 4_495_100_000 },
].map(p => ({ id: uuidv5(p.name, NAMESPACE), ...p }));

module.exports = planets; // <-- export the ARRAY directly
