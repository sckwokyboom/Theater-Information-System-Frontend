export class Place {
    id: number;
    hallTitle: string;
    priceCoefficient: number;
    performanceId: number;

    constructor(id: number, hallTitle: string, priceCoefficient: number, performanceId: number) {
        this.id = id;
        this.hallTitle = hallTitle;
        this.priceCoefficient = priceCoefficient;
        this.performanceId = performanceId;
    }
}