export class Role {
    id: number;
    name: string;
    weight: number | undefined;
    height: number | undefined;
    eyeColor: string | undefined;
    skinColor: string | undefined;
    hairColor: string | undefined;
    voiceType: string | undefined;
    gender: string | undefined;
    age: number | undefined;
    playId: number;
    description: string | undefined;
    nationalityId: number | undefined;
    nationalityName: string | undefined;


    constructor(id: number,
                name: string,
                weight: number | undefined,
                height: number | undefined,
                eyeColor: string | undefined,
                skinColor: string | undefined,
                hairColor: string | undefined,
                voiceType: string | undefined,
                gender: string | undefined,
                age: number | undefined,
                playId: number,
                description: string | undefined,
                nationalityId: number | undefined,
                nationalityName: string | undefined
    ) {
        this
            .id = id;
        this
            .name = name;
        this
            .voiceType = voiceType;
        this
            .hairColor = hairColor;
        this
            .eyeColor = eyeColor
        this
            .playId = playId
        this
            .weight = weight
        this
            .height = height
        this
            .skinColor = skinColor
        this
            .nationalityId = nationalityId
        this
            .nationalityName = nationalityName
        this
            .gender = gender
        this
            .description = description
        this.age = age
    }
}