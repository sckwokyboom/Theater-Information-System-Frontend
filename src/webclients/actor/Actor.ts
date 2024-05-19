export class Actor {
    id: number;
    firstName: string;
    secondName: string | undefined;
    patronymic: string | undefined;
    artistId: number;
    voiceType: string | undefined;
    weight: number | undefined;
    height: number | undefined;
    hairColor: string | undefined;
    eyeColor: string;
    skinColor: string;
    nationalityId: number;
    nationalityName: string;


    constructor(id: number,
                firstName: string,
                secondName: string | undefined,
                patronymic: string | undefined,
                artistId: number,
                voiceType: string,
                weight: number | undefined,
                height: number | undefined,
                hairColor: string | undefined,
                eyeColor: string,
                skinColor: string,
                nationalityId: number,
                nationalityName: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.patronymic = patronymic;
        this.voiceType = voiceType;
        this.hairColor = hairColor;
        this.eyeColor = eyeColor
        this.artistId = artistId
        this.weight = weight
        this.height = height
        this.skinColor = skinColor
        this.nationalityId = nationalityId
        this.nationalityName = nationalityName
    }
}