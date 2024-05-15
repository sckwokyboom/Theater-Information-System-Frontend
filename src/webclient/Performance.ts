export class Performance {
    id: number;
    playTitle: string;
    playGenre: string;
    centuryOfPlayWriting: number;
    authorFirstName: string;
    authorSecondName: string;
    date: string;
    hallTitle: string;
    ageCategory: string;
    basePrice: number;
    isPremiere: boolean;

    constructor(id: number,
                playTitle: string,
                playGenre: string,
                ageCategory: string,
                date: string,
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
        this.date = date;
        this.hallTitle = hallTitle;
        this.basePrice = basePrice;
        this.centuryOfPlayWriting = centuryOfPlayWriting;
        this.isPremiere = isPremiere
        this.authorFirstName = authorFirstName
        this.authorSecondName = authorSecondName
    }
}

export interface FilterPerformanceCriteria {
    repertoireId: number | undefined;
    isPremiere: string | undefined;
    genreId: number | undefined;
    dateOfStart: string | undefined;
    dateOfEnd: string | undefined;
    authorId: number | undefined;
    authorCountryId: number | undefined;
    centuryOfPlayWriting: number | undefined;
}

export interface FilterPerformanceProps {
    onFilterChange: (filters: FilterPerformanceCriteria) => void;
}

export function constructPerformanceQuery(
    repertoireId: number | undefined,
    isPremiere: string | undefined,
    genreId: number | undefined,
    dateOfStart: string | undefined,
    dateOfEnd: string | undefined,
    authorId: number | undefined,
    authorCountryId: number | undefined,
    centuryOfPlayWriting: number | undefined): string {

    let queryString = 'http://localhost:8080/performances/filter?';
    const queryParams: string[] = [];
    if (repertoireId) {
        queryParams.push(`repertoireId=${repertoireId}`);
    }
    if (isPremiere) {
        queryParams.push(`isPremiere=${isPremiere}`);
    }
    if (genreId) {
        queryParams.push(`genreId=${genreId}`);
    }
    if (dateOfStart) {
        queryParams.push(`dateOfStart=${dateOfStart}`);
    }
    if (dateOfEnd) {
        queryParams.push(`dateOfEnd=${dateOfEnd}`);
    }
    if (authorId) {
        queryParams.push(`authorId=${authorId}`);
    }
    if (authorCountryId) {
        queryParams.push(`authorCountryId=${authorCountryId}`);
    }
    if (centuryOfPlayWriting) {
        queryParams.push(`centuryOfPlayWriting=${centuryOfPlayWriting}`);
    }
    queryString += queryParams.join('&');
    console.log(queryString)
    return queryString;
}
