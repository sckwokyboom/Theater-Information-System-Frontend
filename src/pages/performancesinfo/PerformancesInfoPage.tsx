import '../../styles/App.css'
import {useEffect, useState} from "react";
import {Employee} from "../../webclients/employee/Employee.ts";
import {EmployeeClient} from "../../webclients/employee/EmployeeClient.ts";
import {Author} from "../../webclients/author/Author.ts";
import {AuthorClient} from "../../webclients/author/AuthorClient.ts";
import FilterPerformancesInfoForm from "./FilterPerformancesInfoForm.tsx";
import {FilterPerformanceInfoCriteria} from "../../webclients/performanceinfo/FilterPerformanceInfoCriteria.ts";


function PerformancesInfoPage() {
    const employeeClient = EmployeeClient.getInstance()
    const employeeHeaders = ["ID", "Имя", "Фамилия", "Отчество", "Пол", "Дата рождения", "Дата найма", "Зарплата", "Количество детей"]
    const authorHeaders = ["ID", "Имя", "Фамилия", "Отчество", "Дата рождения", "Дата смерти", "Страна происхождения"]
    const fetchData = async (filters: FilterPerformanceInfoCriteria) => {
        fetchEmployeesData("Musician", filters.performanceId).then()
        fetchEmployeesData("Actor", filters.performanceId).then()
        fetchEmployeesData("ProductionDirector", filters.performanceId).then()
        fetchEmployeesData('ProductionDesigner', filters.performanceId).then()
        fetchEmployeesData('StageConductor', filters.performanceId).then()
        fetchAuthorsData(filters.performanceId).then()
    }
    const fetchEmployeesData = async (employeeTypeName: string, performanceId: number | undefined): Promise<Employee[]> => {

        const filters = {
            minSalary: undefined,
            maxSalary: undefined,
            gender: '',
            amountOfChildren: undefined,
            employeeTypeName: employeeTypeName,
            goneOnTour: undefined,
            cameOnTour: undefined,
            tourStartDate: undefined,
            tourEndDate: undefined,
            tourPlayId: undefined,
            performanceId: performanceId,
            yearsOfService: undefined,
            yearOfBirth: undefined,
            age: undefined,
            haveChildren: undefined
        }
        try {
            const data = await employeeClient.fetchData("employees/filter", filters)
            if (data) {
                switch (employeeTypeName) {
                    case "Musician":
                        setMusicians(data);
                        break
                    case "Actor":
                        setActors(data);
                        break
                    case "ProductionDirector":
                        setProductionDirectors(data);
                        break
                    case 'ProductionDesigner':
                        setStageConductors(data);
                        break
                    case 'StageConductor':
                        setProductionDesigners(data);
                        break
                    default:
                        break
                }
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    const fetchAuthorsData = async (performanceId: number | undefined): Promise<Author[]> => {
        const filters = {
            wasPerformed: undefined,
            centuryOfLiving: undefined,
            countryOfOriginId: undefined,
            genreId: undefined,
            dateOfStartPerformanceAuthorsPlays: undefined,
            dateOfEndPerformanceAuthorsPlays: undefined,
            performanceId: performanceId
        }
        try {
            const data = await AuthorClient.getInstance().fetchData("authors/filter", filters)
            if (data) {
                setAuthors(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }
    const [musicians, setMusicians] = useState<Employee[]>([]);
    const [actors, setActors] = useState<Employee[]>([]);
    const [stageConductors, setStageConductors] = useState<Employee[]>([]);
    const [productionDirectors, setProductionDirectors] = useState<Employee[]>([]);
    const [productionDesigners, setProductionDesigners] = useState<Employee[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);

    const [filters, setFilters] = useState<FilterPerformanceInfoCriteria>({
        performanceId: undefined
    });

    const handleFilterChange = (newFilters: FilterPerformanceInfoCriteria) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        const fetchDataAndUpdate = async () => {
            try {
                fetchData(filters).then();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataAndUpdate().then();
    }, [filters]);

    const renderEmployeeRow = (employee: Employee) => (
        <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.firstName}</td>
            <td>{employee.secondName}</td>
            <td>{employee.patronymic}</td>
            <td>{employee.gender}</td>
            <td>{employee.dateOfBirth}</td>
            <td>{employee.dateOfEmployment}</td>
            <td>{employee.salary}</td>
            <td>{employee.amountOfChildren}</td>
        </tr>
    );

    const renderAuthorRow = (author: Author) => (
        <tr key={author.id}>
            <td>{author.id}</td>
            <td>{author.firstName}</td>
            <td>{author.secondName}</td>
            <td>{author.patronymic}</td>
            <td>{author.dateOfBirth}</td>
            <td>{author.dateOfDeath}</td>
            <td>{author.countryOfOriginName}</td>
        </tr>
    );


    return (
        <div>
            <FilterPerformancesInfoForm
                onFilterChange={handleFilterChange}
            />
            <h1>Музыканты</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {employeeHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {musicians.map((item) => (
                            renderEmployeeRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h1>Актёры</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {employeeHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {actors.map((item) => (
                            renderEmployeeRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h1>Режиссёры-постановщики</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {employeeHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {productionDirectors.map((item) => (
                            renderEmployeeRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h1>Художники-постановщики</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {employeeHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {productionDesigners.map((item) => (
                            renderEmployeeRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h1>Дирижёры</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {employeeHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {stageConductors.map((item) => (
                            renderEmployeeRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h1>Авторы</h1>
            <div className="filtered-table-container">
                <div className="table-container">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            {authorHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {authors.map((item) => (
                            renderAuthorRow(item)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <h1>Дата премьеры</h1>
            <label>
                2024-06-26
            </label>
        </div>
    )
}


export default PerformancesInfoPage
