import {BaseClient} from "../BaseCllient.ts";
import {Employee} from "./Employee.ts";
import {FilterEmployeeCriteria} from "./FilterEmployeeCriteria.ts";

export class EmployeeClient extends BaseClient<Employee, FilterEmployeeCriteria> {
    private static instance: EmployeeClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): EmployeeClient {
        if (!EmployeeClient.instance) {
            EmployeeClient.instance = new EmployeeClient();
        }
        return EmployeeClient.instance;
    }

    override constructFilterQueryPart(filterParams: FilterEmployeeCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.employeeTypeName) {
            queryParams.push(`employeeTypeName=${filterParams.employeeTypeName}`);
        }
        if (filterParams.gender) {
            queryParams.push(`gender=${filterParams.gender}`);
        }
        if (filterParams.amountOfChildren) {
            queryParams.push(`amountOfChildren=${filterParams.amountOfChildren}`);
        }
        if (filterParams.minSalary) {
            queryParams.push(`minSalary=${filterParams.minSalary}`);
        }
        if (filterParams.maxSalary) {
            queryParams.push(`maxSalary=${filterParams.maxSalary}`);
        }
        if (filterParams.cameOnTour) {
            queryParams.push(`cameOnTour=${filterParams.cameOnTour}`);
        }
        if (filterParams.goneOnTour) {
            queryParams.push(`goneOnTour=${filterParams.goneOnTour}`);
        }
        if (filterParams.tourStartDate) {
            queryParams.push(`tourStartDate=${filterParams.tourStartDate}`);
        }
        if (filterParams.tourEndDate) {
            queryParams.push(`tourEndDate=${filterParams.tourEndDate}`);
        }
        if (filterParams.tourPlayId) {
            queryParams.push(`tourPlayId=${filterParams.tourPlayId}`);
        }
        if (filterParams.performanceId) {
            queryParams.push(`performanceId=${filterParams.performanceId}`);
        }
        if (filterParams.yearsOfService) {
            queryParams.push(`yearsOfService=${filterParams.yearsOfService}`);
        }
        if (filterParams.yearOfBirth) {
            queryParams.push(`yearOfBirth=${filterParams.yearOfBirth}`);
        }
        if (filterParams.age) {
            queryParams.push(`age=${filterParams.age}`);
        }
        if (filterParams.haveChildren) {
            queryParams.push(`haveChildren=${filterParams.haveChildren}`);
        }
        return queryParams.join('&');
    }
}