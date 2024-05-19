export class Place {
    id: number;
    hallTitle: string;
    priceCoefficient: number;

    constructor(id: number, hallTitle: string, priceCoefficient: number) {
        this.id = id;
        this.hallTitle = hallTitle;
        this.priceCoefficient = priceCoefficient;
    }
}