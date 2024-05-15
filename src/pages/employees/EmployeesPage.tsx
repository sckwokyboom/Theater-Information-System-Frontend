import '../../App.css'
import {useEffect, useState} from "react";
import Filter from "./FilterEmployeesForm.tsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {constructEmployeeQuery, Employee, FilterEmployeeCriteria} from "../../webclient/Employee.ts";

function EmployeesPage() {
    const handleFilterChange = (filters: FilterEmployeeCriteria) => {
        setCurrentRequest(constructEmployeeQuery(filters.employeeType, filters.gender, filters.childrenCount, filters.minSalary, filters.maxSalary))
    };
    const [currentRequest, setCurrentRequest] = useState('http://localhost:8080/employees/filter');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editingEmployeeIndex, setEditingEmployeeIndex] = useState<number | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);


    const toggleEditMode = (index: number) => {
        setEditingEmployeeIndex(index);
        setEditedEmployee({...employees[index]});
    };


    const handleUpdateEmployee = async () => {
        try {
            if (editedEmployee) {
                await axios.put(`http://localhost:8080/employees/${editedEmployee.id}`, editedEmployee);
                const updatedEmployees = [...employees];
                updatedEmployees[editingEmployeeIndex!] = editedEmployee;
                setEmployees(updatedEmployees);
                setEditingEmployeeIndex(null);
                setEditedEmployee(null);
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        try {
            await axios.delete(`http://localhost:8080/employees/${employeeId}`);
            setEmployees(employees.filter(employee => employee.id !== employeeId));
            setEditingEmployeeIndex(null);
            setEditedEmployee(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(currentRequest);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchEmployees();
    }, [currentRequest]);

    return (
        <div className="table-and-filter-container">
            <Filter onFilterChange={handleFilterChange}/>
            <div className="table-container">
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Пол</th>
                        <th>Дата рождения</th>
                        <th>Дата найма</th>
                        <th>Зарплата</th>
                        <th>Количество детей</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee, index) => (
                        <tr key={employee.id}
                            onClick={() => {
                                if (index != editingEmployeeIndex) {
                                    toggleEditMode(index)
                                }
                            }}>
                            <td>{employee.id}</td>
                            <td>{editingEmployeeIndex === index ? (
                                <input type="text" value={editedEmployee?.firstName || ""}
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EmployeesPage
