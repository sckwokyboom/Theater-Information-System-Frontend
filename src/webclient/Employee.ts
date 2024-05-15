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

export interface FilterEmployeeCriteria {
    minSalary: number | undefined;
    maxSalary: number | undefined;
    gender: string;
    childrenCount: number | undefined;
    employeeType: string;
}

export interface FilterEmployeeProps {
    onFilterChange: (filters: FilterEmployeeCriteria) => void;
}

export function constructEmployeeQuery(employeeTypeName: string | undefined, gender: string | undefined, amountOfChildren: number | undefined, minSalary: number | undefined, maxSalary: number | undefined): string {
    let queryString = 'http://localhost:8080/employees/filter?';
    const queryParams: string[] = [];
    if (employeeTypeName) {
        queryParams.push(`employeeTypeName=${employeeTypeName}`);
    }
    if (gender) {
        queryParams.push(`gender=${gender}`);
    }
    if (amountOfChildren) {
        queryParams.push(`amountOfChildren=${amountOfChildren}`);
    }
    if (minSalary) {
        queryParams.push(`minSalary=${minSalary}`);
    }
    if (maxSalary) {
        queryParams.push(`maxSalary=${maxSalary}`);
    }
    queryString += queryParams.join('&');
    console.log(queryString)
    return queryString;
}