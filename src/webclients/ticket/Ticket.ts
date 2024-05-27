export class Ticket {
    id: number;
    performanceId: number | undefined;
    price: number | undefined;
    playTitle: string | undefined;
    hallTitle: string | undefined;
    placeId: number | undefined;
    subscriptionId: number | undefined;
    saleDate: string | undefined;


    constructor(id: number,
                playTitle: string,
                performanceId: number | undefined,
                price: number | undefined,
                hallTitle: string | undefined,
                placeId: number | undefined,
                subscriptionId: number,
                saleDate: string | undefined,
    ) {
        this.id = id;
        this.playTitle = playTitle;
        this.hallTitle = hallTitle
        this.subscriptionId = subscriptionId
        this.performanceId = performanceId
        this.price = price
        this.saleDate = saleDate
        this.placeId = placeId
    }
}