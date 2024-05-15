export class Employee {
    id: number;
    firstName: string;
    secondName: string;
    dateOfBirth: string;
    dateOfEmployment: string;
    gender: string;
    amountOfChildren: number;
    salary: number;

    constructor(id: number, firstName: string, secondName: string, gender: string, dateOfBirth: string, dateOfEmployment: string, salary: number, amountOfChildren: number) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.dateOfEmployment = dateOfEmployment;
        this.salary = salary;
        this.amountOfChildren = amountOfChildren;
    }
}