const { v5: uuidv5 } = require('uuid');
const NAMESPACE = '0e9cb7b2-e5c4-4dec-a3d8-564d23c014b7';

const providers = [
  'Explore Origin','Space Odyssey','Travel Nova','Galaxy Express',
  'SpaceX','Space Voyager','Spacegenix','Explore Dynamite','Space Piper','Spacelux'
].map(name => ({ id: uuidv5(name, NAMESPACE), name }));

module.exports = providers; // array
