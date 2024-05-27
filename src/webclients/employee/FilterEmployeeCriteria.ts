export interface FilterEmployeeCriteria {
    minSalary: number | undefined;
    maxSalary: number | undefined;
    gender: string;
    amountOfChildren: number | undefined;
    employeeTypeName: string;
    goneOnTour: string | undefined;
    cameOnTour: string | undefined;
    tourStartDate: string | undefined;
    tourEndDate: string | undefined;
    tourPlayId: number | undefined;
    performanceId: number | undefined;
    yearsOfService: number | undefined;
    yearOfBirth: number | undefined;
    age: number | undefined;
    haveChildren: boolean | undefined;
}