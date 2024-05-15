export class Repertoire {
    id: number;
    startOfSeason: string;
    endOfSeason: string;

    constructor(id: number, startOfSeason: string, endOfSeason: string) {
        this.id = id;
        this.startOfSeason = startOfSeason;
        this.endOfSeason = endOfSeason
    }
}
