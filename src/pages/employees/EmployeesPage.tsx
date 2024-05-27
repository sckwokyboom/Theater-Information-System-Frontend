import '../../App.css'
import {useState} from "react";
import {Employee} from "../../webclients/employee/Employee.ts";
import FilteredTable from "../FilteredTable.tsx";
import FilterEmployeesForm from "./FilterEmployeesForm.tsx";
import {EmployeeClient} from "../../webclients/employee/EmployeeClient.ts";
import {FilterEmployeeCriteria} from "../../webclients/employee/FilterEmployeeCriteria.ts";
import {DatePicker} from "antd";
import {formatDate} from "../../utils/Date.ts";

function EmployeesPage() {
    const employeeClient = EmployeeClient.getInstance()
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
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [newEmployee, setNewEmployee] = useState<Employee>({
        id: 0,
        firstName: '',
        secondName: '',
        patronymic: '',
        gender: '',
        dateOfBirth: '',
        dateOfEmployment: '',
        salary: 0,
        amountOfChildren: 0
    });

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

    const handleAddEmployee = async () => {
        try {
            const addedEmployee = await employeeClient.createData("employees", newEmployee);
            if (addedEmployee) {
                setEmployees([...employees, addedEmployee]);
                setShowAddForm(false);
                setNewEmployee({
                    id: 0,
                    firstName: '',
                    secondName: '',
                    patronymic: '',
                    gender: '',
                    dateOfBirth: '',
                    dateOfEmployment: '',
                    salary: 0,
                    amountOfChildren: 0
                });
            }
        } catch (error) {
            console.error('Error adding employee:', error);
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
                <input type="text" value={editedEmployee?.patronymic || ""}
                       onChange={(e) => setEditedEmployee({
                           ...editedEmployee!,
                           patronymic: e.target.value
                       })}/>
            ) : employee.patronymic}</td>
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
                <DatePicker
                    name={"dateOfBirth"}
                    value={editedEmployee?.dateOfBirth}
                    onChange={(date: string) => setEditedEmployee({
                        ...editedEmployee!,
                        dateOfBirth: formatDate(new Date(date))
                    })}/>
            ) : employee.dateOfBirth}</td>
            <td>{editingEmployeeIndex === index ? (
                <DatePicker
                    name={"dateOfEmployment"}
                    value={editedEmployee?.dateOfEmployment}
                    onChange={(date: string) => setEditedEmployee({
                        ...editedEmployee!,
                        dateOfEmployment: formatDate(new Date(date))
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
        <div>
            <h1>Работники театра</h1>
            <FilteredTable<Employee, FilterEmployeeCriteria>
                fetchData={fetchData}
                renderRow={renderRow}
                FilterComponent={FilterEmployeesForm}
                tableHeaders={["ID", "Имя", "Фамилия", "Отчество", "Пол", "Дата рождения", "Дата найма", "Зарплата", "Количество детей"]}
                tableData={employees}
                filterInitialState={{
                    minSalary: undefined,
                    maxSalary: undefined,
                    gender: '',
                    amountOfChildren: undefined,
                    employeeTypeName: '',
                    goneOnTour: undefined,
                    cameOnTour: undefined,
                    tourStartDate: undefined,
                    tourEndDate: undefined,
                    tourPlayId: undefined,
                    performanceId: undefined,
                    yearsOfService: undefined,
                    yearOfBirth: undefined,
                    age: undefined,
                    haveChildren: undefined
                }}
            />
            <button onClick={() => setShowAddForm(true)}>Add New Employee</button>
            {showAddForm && (
                <div>
                    <label>
                        Имя:
                        <input type="text" placeholder="Имя" value={newEmployee.firstName}
                               onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}/>
                    </label>
                    <label>
                        Фамилия:
                        <input type="text" placeholder="Фамилия" value={newEmployee.secondName}
                               onChange={(e) => setNewEmployee({...newEmployee, secondName: e.target.value})}/>
                    </label>
                    <label>
                        Отчество:
                        <input type="text" placeholder="Отчество" value={newEmployee.patronymic}
                               onChange={(e) => setNewEmployee({...newEmployee, patronymic: e.target.value})}/>
                    </label>
                    <label>
                        Гендер:
                        <select value={newEmployee.gender}
                                onChange={(e) => setNewEmployee({...newEmployee, gender: e.target.value})}>
                            <option value="Male">Мужчина</option>
                            <option value="Female">Женщина</option>
                            <option value="Other">Другое</option>
                        </select>
                    </label>
                    <label>
                        Дата рождения:
                        <DatePicker
                            allowClear={true}
                            name={"dateOfBirth"}
                            value={newEmployee.dateOfBirth}
                            onChange={(date: string) => setNewEmployee({
                                ...newEmployee,
                                dateOfBirth: formatDate(new Date(date))
                            })}/>
                    </label>
                    <label>
                        Дата приёма на работу:
                        <DatePicker
                            allowClear={true}
                            name={"dateOfEmployment"}
                            value={newEmployee.dateOfEmployment}
                            onChange={(date: string) => setNewEmployee({
                                ...newEmployee,
                                dateOfEmployment: formatDate(new Date(date))
                            })}/>
                    </label>
                    <label>
                        Зарплата:
                        <input type="number" placeholder="Зарплата" value={newEmployee.salary}
                               onChange={(e) => setNewEmployee({...newEmployee, salary: parseInt(e.target.value)})}/>
                    </label>
                    <label>
                        Количество детей:
                        <input type="number" placeholder="Amount of Children" value={newEmployee.amountOfChildren}
                               onChange={(e) => setNewEmployee({
                                   ...newEmployee,
                                   amountOfChildren: parseInt(e.target.value)
                               })}/>
                    </label>
                    <button onClick={handleAddEmployee}>Add Employee</button>
                    <button onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
            )}
            <hr/>
            <label>
                <b>Количество:</b> {employees.length}.
            </label>

        </div>
    )
}

export default EmployeesPage
