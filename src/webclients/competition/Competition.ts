export class Competition {
    id: number;
    name: string;
    dateOfStart: string;
    dateOfEnd: string;

    constructor(id: number, name: string, dateOfStart: string, dateOfEnd: string) {
        this.id = id;
        this.dateOfStart = dateOfStart;
        this.dateOfEnd = dateOfEnd
        this.name = name
    }
}
