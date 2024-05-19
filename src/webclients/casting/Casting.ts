export class Casting {
    actorId: number;
    actorFirstName: string;
    actorSecondName: string;
    playTitle: string;
    performanceDate: string;
    performanceId: number;
    doubleId: number;
    roleId: number;
    roleName: string;
    roleDescription: string;

    constructor(actorId: number, actorFirstName: string, actorSecondName: string, roleName: string, playTitle: string, performanceDate: string, performanceId: number, doubleId: number, roleId: number, roleDescription: string) {
        this.actorId = actorId;
        this.actorFirstName = actorFirstName;
        this.actorSecondName = actorSecondName;
        this.roleName = roleName;
        this.playTitle = playTitle;
        this.performanceDate = performanceDate;
        this.performanceId = performanceId;
        this.doubleId = doubleId;
        this.roleId = roleId
        this.roleDescription = roleDescription
    }
}