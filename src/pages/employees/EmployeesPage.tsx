import {useState} from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3';
import {Employee} from '../../webclients/employee/Employee.ts';
import {EmployeeClient} from '../../webclients/employee/EmployeeClient.ts';
import {FilterEmployeeCriteria} from '../../webclients/employee/FilterEmployeeCriteria.ts';
import FilteredTable from '../FilteredTable.tsx';
import FilterEmployeesForm from './FilterEmployeesForm.tsx';
import {formatDate} from '../../utils/Date.ts';

const EmployeesPage = () => {
    const employeeClient = EmployeeClient.getInstance();
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
        salary: undefined,
        amountOfChildren: undefined
    });

    const notifyError = (message: string) => {
        alert('Ошибка: ' + message); // Simplified error notification
    };

    const fetchData = async (filters: FilterEmployeeCriteria): Promise<Employee[]> => {
        try {
            const data = await employeeClient.fetchData("employees/filter", filters);
            if (data) {
                setEmployees(data);
                return data;
            }
            return [];
        } catch (error) {
            notifyError('Error fetching data: ' + (error as Error).message);
            return [];
        }
    };

    const toggleEditMode = (index: number) => {
        setEditingEmployeeIndex(index);
        setEditedEmployee(employees[index]);
    };

    const handleUpdateEmployee = async () => {
        try {
            if (editedEmployee) {
                const updatedEmployee = await employeeClient.updateData("employees", editedEmployee.id, editedEmployee);
                if (updatedEmployee) {
                    const updatedEmployees = [...employees];
                    updatedEmployees[editingEmployeeIndex!] = updatedEmployee;
                    setEmployees(updatedEmployees);
                    setEditingEmployeeIndex(null);
                    setEditedEmployee(null);
                }
            }
        } catch (error) {
            notifyError('Error updating employee: ' + (error as Error).message);
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        try {
            const deleted = await employeeClient.deleteData("employees", employeeId);
            if (deleted) {
                setEmployees(employees.filter(employee => employee.id !== employeeId));
                setEditingEmployeeIndex(null);
                setEditedEmployee(null);
            }
        } catch (error) {
            notifyError('Error deleting employee: ' + (error as Error).message);
        }
    };

    const handleAddEmployee = async () => {
        try {
            console.log(newEmployee)
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
            notifyError('Error adding employee: ' + (error as Error).message);
        }
    };

    const renderRow = (employee: Employee, index: number) => (
        <TableRow key={employee.id} onClick={() => {
            if (index !== editingEmployeeIndex) toggleEditMode(index);
        }}>
            <TableCell>{employee.id}</TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <TextField
                        value={editedEmployee?.firstName || ""}
                        onChange={(e) => setEditedEmployee({
                            ...editedEmployee!,
                            firstName: e.target.value
                        })}
                    />
                ) : employee.firstName}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <TextField
                        value={editedEmployee?.secondName || ""}
                        onChange={(e) => setEditedEmployee({
                            ...editedEmployee!,
                            secondName: e.target.value
                        })}
                    />
                ) : employee.secondName}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <TextField
                        value={editedEmployee?.patronymic || ""}
                        onChange={(e) => setEditedEmployee({
                            ...editedEmployee!,
                            patronymic: e.target.value
                        })}
                    />
                ) : employee.patronymic}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <FormControl fullWidth>
                        <InputLabel>Гендер</InputLabel>
                        <Select
                            value={editedEmployee?.gender || ""}
                            onChange={(e) => setEditedEmployee({
                                ...editedEmployee!,
                                gender: e.target.value
                            })}
                        >
                            <MenuItem value="Male">Мужской</MenuItem>
                            <MenuItem value="Female">Женский</MenuItem>
                            <MenuItem value="Other">Другой</MenuItem>
                        </Select>
                    </FormControl>
                ) : employee.gender}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={editedEmployee?.dateOfBirth || null}
                            onChange={(date: string | null) => setEditedEmployee({
                                ...editedEmployee!,
                                dateOfBirth: formatDate(new Date(date == null ? '' : date))
                            })}
                            // renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                ) : employee.dateOfBirth}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={editedEmployee?.dateOfEmployment || null}
                            onChange={(date: string | null) => setEditedEmployee({
                                ...editedEmployee!,
                                dateOfEmployment: formatDate(new Date(date == null ? '' : date))
                            })}
                            // renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                ) : employee.dateOfEmployment}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <TextField
                        type="number"
                        value={editedEmployee?.salary || 0}
                        onChange={(e) => setEditedEmployee({
                            ...editedEmployee!,
                            salary: parseInt(e.target.value)
                        })}
                    />
                ) : employee.salary}
            </TableCell>
            <TableCell>
                {editingEmployeeIndex === index ? (
                    <TextField
                        type="number"
                        value={editedEmployee?.amountOfChildren || 0}
                        onChange={(e) => setEditedEmployee({
                            ...editedEmployee!,
                            amountOfChildren: parseInt(e.target.value)
                        })}
                    />
                ) : employee.amountOfChildren}
            </TableCell>
            {editingEmployeeIndex === index && (
                <>
                    <TableCell>
                        <Button onClick={handleUpdateEmployee}>Сохранить</Button>
                    </TableCell>
                    <TableCell>
                        <Button onClick={() => handleDeleteEmployee(employee.id)}>Удалить</Button>
                    </TableCell>
                </>
            )}
        </TableRow>
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Работники театра</Typography>
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
            {!showAddForm && (
                <Button variant="contained" color="primary" onClick={() => setShowAddForm(true)}>
                    Добавить работника
                </Button>
            )}
            {showAddForm && (
                <Box component="form" sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 4}}>
                    <TextField
                        label="Имя"
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                        fullWidth
                    />
                    <TextField
                        label="Фамилия"
                        value={newEmployee.secondName}
                        onChange={(e) => setNewEmployee({...newEmployee, secondName: e.target.value})}
                        fullWidth
                    />
                    <TextField
                        label="Отчество"
                        value={newEmployee.patronymic}
                        onChange={(e) => setNewEmployee({...newEmployee, patronymic: e.target.value})}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Гендер</InputLabel>
                        <Select
                            value={newEmployee.gender}
                            onChange={(e) => setNewEmployee({...newEmployee, gender: e.target.value})}
                        >
                            <MenuItem value="Male">Мужчина</MenuItem>
                            <MenuItem value="Female">Женщина</MenuItem>
                            <MenuItem value="Other">Другое</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Дата рождения"
                            value={newEmployee.dateOfBirth || null}
                            onChange={(date) => setNewEmployee({
                                ...newEmployee,
                                dateOfBirth: formatDate(new Date(date == null ? '' : date))
                            })}
                            // renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Дата приёма на работу"
                            value={newEmployee.dateOfEmployment || null}
                            onChange={(date) => setNewEmployee({
                                ...newEmployee,
                                dateOfEmployment: formatDate(new Date(date == null ? '' : date))
                            })}
                            // renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Зарплата"
                        type="number"
                        value={newEmployee.salary || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, salary: parseInt(e.target.value)})}
                        fullWidth
                    />
                    <TextField
                        label="Количество детей"
                        type="number"
                        value={newEmployee.amountOfChildren || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, amountOfChildren: parseInt(e.target.value)})}
                        fullWidth
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button variant="contained" color="secondary" onClick={() => setShowAddForm(false)}>
                            Закрыть форму
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleAddEmployee}>
                            Добавить работника
                        </Button>
                    </Box>
                </Box>
            )}
            <Typography variant="body1"><b>Количество:</b> {employees.length}</Typography>
        </Container>
    );
};

export default EmployeesPage;
