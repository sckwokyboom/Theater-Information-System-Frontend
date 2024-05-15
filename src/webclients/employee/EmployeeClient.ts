import {BaseClient} from "../BaseCllient.ts";
import {Employee} from "./Employee.ts";
import {FilterEmployeeCriteria} from "./FilterEmployeeCriteria.ts";

export class EmployeeClient extends BaseClient<Employee, FilterEmployeeCriteria> {
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
        return queryParams.join('&');
    }
}