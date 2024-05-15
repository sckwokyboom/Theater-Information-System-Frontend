import '../../App.css'
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Employee} from "../../webclients/employee/Employee.ts";
import FilteredTable from "../FilteredTable.tsx";
import FilterEmployeesForm from "./FilterEmployeesForm.tsx";
import {EmployeeClient} from "../../webclients/employee/EmployeeClient.ts";
import {FilterEmployeeCriteria} from "../../webclients/employee/FilterEmployeeCriteria.ts";

function EmployeesPage() {
    const employeeClient = new EmployeeClient()
    const fetchData = async (filters: FilterEmployeeCriteria): Promise<Employee[]> => {
        try {
            const data = await employeeClient.fetchData("employees/filter", filters)
            if (data) {
                setEmployees(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editingEmployeeIndex, setEditingEmployeeIndex] = useState<number | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);

    const toggleEditMode = (index: number) => {
        setEditingEmployeeIndex(index);
        setEditedEmployee(employees[index]);
    };

    const handleUpdateEmployee = async () => {
        try {
            if (editedEmployee) {
                const updatedEmployee = await employeeClient.updateData("employees", editedEmployee.id, editedEmployee)
                if (updatedEmployee) {
                    const updatedEmployees = [...employees];
                    updatedEmployees[editingEmployeeIndex!] = editedEmployee;
                    console.log(`Person ${editingEmployeeIndex!} was updated`)
                    setEmployees(updatedEmployees);
                    setEditingEmployeeIndex(null);
                    setEditedEmployee(null);
                }
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        try {
            const deleted = await employeeClient.deleteData("employees", employeeId)
            if (deleted) {
                setEmployees(employees.filter(employee => employee.id !== employeeId));
                setEditingEmployeeIndex(null);
                setEditedEmployee(null);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const renderRow = (employee: Employee, index: number) => (
        <tr key={employee.id}
            onClick={() => {
                if (index !== editingEmployeeIndex) {
                    toggleEditMode(index);
                }
            }}>
            <td>{employee.id}</td>
            <td>{editingEmployeeIndex === index ? (
                <input type="text"
                       value={editedEmployee?.firstName || ""}
                       onChange={(e) => setEditedEmployee({
                           ...editedEmployee!,
                           firstName: e.target.value
                       })}/>
            ) : employee.firstName}</td>
            <td>{editingEmployeeIndex === index ? (
                <input type="text" value={editedEmployee?.secondName || ""}
                       onChange={(e) => setEditedEmployee({
                           ...editedEmployee!,
                           secondName: e.target.value
                       })}/>
            ) : employee.secondName}</td>
            <td>{editingEmployeeIndex === index ? (
                <select value={editedEmployee?.gender || ""} onChange={(e) => setEditedEmployee({
                    ...editedEmployee!,
                    gender: e.target.value
                })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            ) : employee.gender}</td>
            <td>{editingEmployeeIndex === index ? (
                <DatePicker selected={editedEmployee?.dateOfBirth}
                            onChange={(date: Date) => setEditedEmployee({
                                ...editedEmployee!,
                                dateOfBirth: date.toISOString()
                            })}/>
            ) : employee.dateOfBirth}</td>
            <td>{editingEmployeeIndex === index ? (
                <DatePicker selected={editedEmployee?.dateOfEmployment}
                            onChange={(date: Date) => setEditedEmployee({
                                ...editedEmployee!,
                                dateOfEmployment: date.toISOString()
                            })}/>
            ) : employee.dateOfEmployment}</td>
            <td>{editingEmployeeIndex === index ? (
                <input type="number" value={editedEmployee?.salary || 0}
                       onChange={(e) => setEditedEmployee({
                           ...editedEmployee!,
                           salary: parseInt(e.target.value)
                       })}/>
            ) : employee.salary}</td>
            <td>{editingEmployeeIndex === index ? (
                <input type="number" value={editedEmployee?.amountOfChildren || 0}
                       onChange={(e) => setEditedEmployee({
                           ...editedEmployee!,
                           amountOfChildren: parseInt(e.target.value)
                       })}/>
            ) : employee.amountOfChildren}</td>
            {editingEmployeeIndex === index && (
                <td>
                    <button onClick={handleUpdateEmployee}>Save Changes</button>
                </td>
            )}
            {editingEmployeeIndex === index && (
                <td>
                    <button onClick={() => handleDeleteEmployee(employee.id)}>Delete employee
                    </button>
                </td>
            )}
        </tr>
    );


    return (
        <FilteredTable<Employee, FilterEmployeeCriteria>
            fetchData={fetchData}
            filterInitialState={{
                minSalary: undefined,
                maxSalary: undefined,
                gender: '',
                amountOfChildren: undefined,
                employeeTypeName: '',
            }}
            renderRow={renderRow}
            FilterComponent={FilterEmployeesForm}
            tableHeaders={["ID", "Имя", "Фамилия", "Пол", "Дата рождения", "Дата найма", "Зарплата", "Количество детей"]}
            tableData={employees}
        />
    )
}

export default EmployeesPage
