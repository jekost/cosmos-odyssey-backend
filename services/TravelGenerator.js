// services/travelgenerator.js (CommonJS)
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const planets = require('../constants/planets');
const providers = require('../constants/providers');
const legs = require('../constants/legs');

class TravelGenerator {
    constructor() {
        this.planets = planets;
        this.providers = providers;
        this.legs = legs;
        this.namespace = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'; // fixed namespace for UUIDv5
    } 

    getRandomDateInFuture(minutesAheadMin, minutesAheadMax) {
        const now = new Date();
        const minutesToAdd = Math.floor(
            Math.random() * (minutesAheadMax - minutesAheadMin + 1) + minutesAheadMin
        );
        return new Date(now.getTime() + minutesToAdd * 60000);
    }

    calculateTravelTime(distance) {
        const hours = Math.floor(distance / 5_000_000); // arbitrary scaling factor
        return hours * 60 * 60 * 1000; // milliseconds
    }

    generateTravels() {
        const now = new Date();
        const validUntil = new Date(
            now.getTime() + (15 + Math.floor(Math.random() * 5) - 2) * 60000
        );

        return {
            id: uuidv4(),
            validUntil: validUntil.toISOString(),
            legs: this.legs.map((leg) => {
                const routeInfo = {
                    id: leg.id,
                    from: (() => {
                        const p = this.planets.find((p) => p.id === leg.fromId);
                        return { id: p.id, name: p.name };
                    })(),
                    to: (() => {
                        const p = this.planets.find((p) => p.id === leg.toId);
                        return { id: p.id, name: p.name };
                    })(),
                    distance: leg.distance
                };

                const legProviders = this.providers
                    .filter(() => Math.random() > 0.5) // random subset
                    .map((provider) => {
                        const flightStart = this.getRandomDateInFuture(20, 60);
                        const flightEnd = new Date(
                            flightStart.getTime() +
                            this.calculateTravelTime(routeInfo.distance)
                        );

                        return {
                            id: uuidv5(`${leg.id}-${provider.id}-${flightStart.toISOString()}`, this.namespace),
                            company: provider,
                            price: parseFloat(
                                (routeInfo.distance * (Math.random() * 0.5 + 0.5) / 1000).toFixed(2)
                            ),
                            flightStart: flightStart.toISOString(),
                            flightEnd: flightEnd.toISOString()
                        };
                    });

                return {
                    id: leg.id,
                    routeInfo,
                    providers: legProviders
                };
            })
        };
    }
}

module.exports = TravelGenerator;
