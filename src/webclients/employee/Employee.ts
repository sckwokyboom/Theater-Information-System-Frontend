export class Employee {
    id: number;
    firstName: string;
    secondName: string;
    patronymic: string;
    dateOfBirth: string;
    dateOfEmployment: string;
    gender: string;
    amountOfChildren: number | undefined;
    salary: number | undefined;

    constructor(id: number, firstName: string, secondName: string, patronymic: string, gender: string, dateOfBirth: string, dateOfEmployment: string, salary: number, amountOfChildren: number) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.patronymic = patronymic;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.dateOfEmployment = dateOfEmployment;
        this.salary = salary;
        this.amountOfChildren = amountOfChildren;
    }
}