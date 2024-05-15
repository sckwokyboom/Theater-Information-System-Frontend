export interface FilterEmployeeCriteria {
    minSalary: number | undefined;
    maxSalary: number | undefined;
    gender: string;
    amountOfChildren: number | undefined;
    employeeTypeName: string;
}