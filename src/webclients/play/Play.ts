export class Play {
    id: number;
    title: string;
    genreId: number;
    century: number;

    constructor(id: number, title: string, genreId: number, century: number) {
        this.id = id;
        this.title = title;
        this.genreId = genreId
        this.century = century
    }
}
