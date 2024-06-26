export class Performance {
    id: number;
    playTitle: string;
    playGenre: string;
    centuryOfPlayWriting: number;
    authorFirstName: string;
    authorSecondName: string;
    startTime: string;
    endTime: string;
    hallTitle: string;
    ageCategory: string;
    basePrice: number;
    isPremiere: boolean;

    constructor(id: number,
                playTitle: string,
                playGenre: string,
                ageCategory: string,
                startTime: string,
                endTime: string,
                authorFirstName: string,
                authorSecondName: string,
                hallTitle: string,
                basePrice: number,
                centuryOfPlayWriting: number,
                isPremiere: boolean) {
        this.id = id;
        this.playTitle = playTitle;
        this.playGenre = playGenre;
        this.ageCategory = ageCategory;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hallTitle = hallTitle;
        this.basePrice = basePrice;
        this.centuryOfPlayWriting = centuryOfPlayWriting;
        this.isPremiere = isPremiere
        this.authorFirstName = authorFirstName
        this.authorSecondName = authorSecondName
    }
}