export class BlacklistManager {
    constructor(statsManager) {
        this.statsManager = statsManager;
        this.rivals = [
            { id: 15, name: "Sonny", bounty: 1000, wins: 0, car: "Volkswagen Golf GTI", bio: "Sonny's got a lot of cash, which he spent on his ride. He's at the bottom of the list, but don't underestimate him." },
            { id: 14, name: "Taz", bounty: 5000, wins: 1, car: "Lexus IS 300", bio: "This guy has a major problem with anyone who isn't a Blacklist racer." },
            { id: 13, name: "Vic", bounty: 10000, wins: 2, car: "Toyota Supra", bio: "Vic's been holding down the #13 spot for a long time." },
            { id: 12, name: "Izzy", bounty: 20000, wins: 3, car: "Mazda RX-8", bio: "Izzy's a queen of the streets. She's got style and speed." },
            { id: 11, name: "Big Lou", bounty: 35000, wins: 4, car: "Mitsubishi Eclipse", bio: "He's big, his car is big, and his ego is even bigger." },
            { id: 10, name: "Baron", bounty: 50000, wins: 6, car: "Porsche Cayman S", bio: "Baron is a rich kid who thinks he's better than everyone. Prove him wrong." },
            { id: 9, name: "Earl", bounty: 75000, wins: 8, car: "Mitsubishi Lancer Evolution VIII", bio: "Earl's a technical driver. He knows every corner of this city." },
            { id: 8, name: "Jewels", bounty: 100000, wins: 10, car: "Ford Mustang GT", bio: "She's fast and aggressive. Don't let the name fool you." },
            { id: 7, name: "Kaze", bounty: 150000, wins: 12, car: "Mercedes-Benz CLK 500", bio: "Kaze is crazy. She'll run you off the road just for fun." },
            { id: 6, name: "Ming", bounty: 220000, wins: 15, car: "Lamborghini Gallardo", bio: "Ming is a perfectionist. His car is always in top shape." },
            { id: 5, name: "Webster", bounty: 300000, wins: 18, car: "Chevrolet Corvette C6", bio: "Webster is a veteran. He's seen it all and won most of it." },
            { id: 4, name: "JV", bounty: 400000, wins: 21, car: "Dodge Viper SRT-10", bio: "JV's a heavyweight. He's got the power and the skill." },
            { id: 3, name: "Ronnie", bounty: 550000, wins: 25, car: "Aston Martin DB9", bio: "Ronnie is Razor's right-hand man. He's dangerous." },
            { id: 2, name: "Bull", bounty: 750000, wins: 30, car: "Mercedes-Benz SLR McLaren", bio: "Bull is a wall. You'll have to drive perfectly to beat him." },
            { id: 1, name: "Razor", bounty: 1000000, wins: 40, car: "BMW M3 GTR", bio: "The man who took your ride. It's time to take it back." }
        ];
    }

    getCurrentRival() {
        // First one that isn't defeated
        return this.rivals.find(r => !this.statsManager.stats.defeatedRivals.includes(r.id));
    }

    canChallenge(rivalId) {
        const rival = this.rivals.find(r => r.id === rivalId);
        if (!rival) return false;

        const stats = this.statsManager.stats;
        return stats.totalBounty >= rival.bounty && stats.totalWins >= rival.wins;
    }

    defeatRival(rivalId) {
        if (!this.statsManager.stats.defeatedRivals.includes(rivalId)) {
            this.statsManager.stats.defeatedRivals.push(rivalId);
            this.statsManager.save();
            this.statsManager.notify(`RIVAL ${rivalId} DEFEATED!`, 'yellow');
        }
    }
}
