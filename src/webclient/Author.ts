export class Author {
    id: number;
    firstName: string;
    secondName: string | undefined;
    patronymic: string | undefined;
    dateOfBirth: string | undefined;
    dateOfDeath: string | undefined;
    countryOfOriginName: string;


    constructor(id: number,
                firstName: string,
                secondName: string | undefined,
                patronymic: string | undefined,
                dateOfBirth: string,
                dateOfDeath: string | undefined,
                countryOfOrigin: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.patronymic = patronymic;
        this.dateOfBirth = dateOfBirth;
        this.dateOfDeath = dateOfDeath;
        this.countryOfOriginName = countryOfOrigin
    }
}


export function constructAuthorQuery(wasPerformed: string | undefined,
                                     centuryOfLiving: number | undefined,
                                     countryOfOriginId: number | undefined,
                                     genreId: number | undefined,
                                     dateOfStartPerformanceAuthorsPlays: string | undefined,
                                     dateOfEndPerformanceAuthorsPlays: string | undefined): string {
    let queryString = 'http://localhost:8080/employees/filter?';
    const queryParams: string[] = [];
    if (wasPerformed) {
        queryParams.push(`wasPerformed=${wasPerformed}`);
    }
    if (centuryOfLiving) {
        queryParams.push(`centuryOfLiving=${centuryOfLiving}`);
    }
    if (countryOfOriginId) {
        queryParams.push(`countryOfOriginId=${countryOfOriginId}`);
    }
    if (genreId) {
        queryParams.push(`genreId=${genreId}`);
    }
    if (dateOfStartPerformanceAuthorsPlays) {
        queryParams.push(`dateOfStartPerformanceAuthorsPlays=${dateOfStartPerformanceAuthorsPlays}`);
    }
    if (dateOfEndPerformanceAuthorsPlays) {
        queryParams.push(`dateOfEndPerformanceAuthorsPlays=${dateOfEndPerformanceAuthorsPlays}`);
    }
    queryString += queryParams.join('&');
    console.log(queryString)
    return queryString;
}