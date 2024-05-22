export class Title {
    id: number;
    name: string;
    competitionId: number;
    competitionName: string;

    constructor(id: number, name: string, competitionId: number, competitionName: string) {
        this.id = id;
        this.name = name;
        this.competitionId = competitionId
        this.competitionName = competitionName
    }
}
