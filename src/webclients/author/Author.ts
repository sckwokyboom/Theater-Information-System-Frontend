export class Author {
    id: number;
    firstName: string;
    secondName: string | undefined;
    patronymic: string | undefined;
    dateOfBirth: string | undefined | null;
    dateOfDeath: string | undefined | null;
    countryOfOriginName: string;


    constructor(id: number,
                firstName: string,
                secondName: string | undefined,
                patronymic: string | undefined,
                dateOfBirth: string | undefined | null,
                dateOfDeath: string | undefined | null,
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