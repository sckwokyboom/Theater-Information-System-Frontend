import React, {useEffect, useState} from 'react';
import '../../Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterEmployeeCriteria} from "../../webclients/employee/FilterEmployeeCriteria.ts";
import {DatePicker} from "antd";
import {Play} from "../../webclients/play/Play.ts";
import {PlayClient} from "../../webclients/play/PlayClient.ts";

const FilterEmployeesForm: React.FC<FilterProps<FilterEmployeeCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterEmployeeCriteria>({
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
    });

    const employeeTypeOptions = ['Все работники', 'Артисты', 'Музыканты', 'Актёры', 'Постановщики', 'Режиссёры-постановщики', 'Дирижёры', 'Художники-постановщики', 'Менеджеры'];

    const [selectedEmployeeTypeOption, setSelectedEmployeeTypeOption] = useState('Все работники');

    const [startDate, setStartDate] = useState<string | undefined | null>();
    const [endDate, setEndDate] = useState<string | undefined | null>();
    // const [error, setError] = useState<string>('');
    const [plays, setPlays] = useState<Play[]>([])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
        console.log("SUBMIT")
        console.log(filters)
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleStartDateChange = (date: string | null) => {
        setStartDate(date);
        setFilters({
            ...filters,
            tourStartDate: date ? formatDate(new Date(date)) : undefined
        });
    };

    const handleEndDateChange = (date: string | null) => {
        setEndDate(date);
        setFilters({
            ...filters,
            tourEndDate: date ? formatDate(new Date(date)) : undefined
        });
    };

    const handleSelectEmployeeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target;
        setSelectedEmployeeTypeOption(value)
        switch (value) {
            case 'Все работники':
                setFilters({...filters, [name]: "Any"});
                break
            case 'Артисты':
                setFilters({...filters, [name]: "Artist"});
                break
            case 'Музыканты':
                setFilters({...filters, [name]: "Musician"});
                break
            case 'Актёры':
                setFilters({...filters, [name]: "Actor"});
                break
            case 'Постановщики':
                setFilters({...filters, [name]: "Director"});
                break
            case 'Режиссёры-постановщики':
                setFilters({...filters, [name]: "ProductionDirector"});
                break
            case 'Дирижёры':
                setFilters({...filters, [name]: "StageConductor"});
                break
            case 'Художники-постановщики':
                setFilters({...filters, [name]: "ProductionDesigner"});
                break
            case 'Менеджеры':
                setFilters({...filters, [name]: "Manager"});
                break
            default:
                setFilters({...filters, [name]: "Any"});
                break
        }
    };

    useEffect(() => {
        const fetchPlaysOptions = async () => {
            try {
                const plays = await PlayClient.getInstance().getAllPlays()
                if (plays) {
                    setPlays(plays);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchPlaysOptions().then()
    }, []);

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <label className="form-label">
                Минимальная зарплата:
                <input type="number"
                       name="minSalary"
                       value={filters.minSalary}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Максимальная зарплата:
                <input type="number"
                       name="maxSalary"
                       value={filters.maxSalary}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Пол:
                <select name="gender"
                        value={filters.gender}
                        onChange={handleInputChange}
                        className="form-select">
                    <option value="">Любой</option>
                    <option value="Male">Мужской</option>
                    <option value="Female">Женский</option>
                    <option value="Other">Другое</option>
                </select>
            </label>

            <label className="form-label">
                Есть ли дети:
                <select name="haveChildren"
                        value={filters.haveChildren}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"true"}>Да</option>
                    <option value={"false"}>Нет</option>
                </select>
            </label>

            {filters.haveChildren != "false" &&
                <label className="form-label">
                    Количество детей:
                    <input type="number"
                           name="amountOfChildren"
                           value={filters.amountOfChildren}
                           onChange={handleInputChange}
                           className="form-input"/>
                </label>}

            <label className="form-label">
                Количество лет службы:
                <input type="number"
                       name="yearsOfService"
                       value={filters.yearsOfService}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Год рождения:
                <input type="number"
                       name="yearOfBirth"
                       value={filters.yearOfBirth}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Возраст:
                <input type="number"
                       name="age"
                       value={filters.age}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Тип сотрудника:
                <select name="employeeTypeName" value={selectedEmployeeTypeOption}
                        onChange={handleSelectEmployeeTypeChange}
                        className="form-select">
                    {employeeTypeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </label>

            {!(['Все работники', 'Менеджеры'].includes(selectedEmployeeTypeOption)) && <div>
                <label className="form-label">
                    Приезжал на гастроли:
                    <select name="cameOnTour"
                            value={filters.cameOnTour}
                            onChange={handleInputChange}
                            className="form-select">
                        <option></option>
                        <option value={"true"}>Да</option>
                        <option value={"false"}>Нет</option>
                    </select>
                </label>

                <label className="form-label">
                    Уезжал на гастроли:
                    <select name="goneOnTour"
                            value={filters.goneOnTour}
                            onChange={handleInputChange}
                            className="form-select">
                        <option></option>
                        <option value={"true"}>Да</option>
                        <option value={"false"}>Нет</option>
                    </select>
                </label>

                <label className="form-label">
                    Гастрольный тур начался:
                    <DatePicker
                        allowClear={true}
                        name="tourStartDate"
                        onChange={handleStartDateChange}
                        value={startDate}
                        className="form-input"
                    />
                </label>

                <label className="form-label">
                    Гастрольный тур закончился:
                    <DatePicker
                        allowClear={true}
                        name="tourEndDate"
                        onChange={handleEndDateChange}
                        value={endDate}
                        className="form-input"
                    />
                </label>

                <label className="form-label">
                    Гастрольный тур с пьесой:
                    <select
                        name="tourPlayId"
                        value={filters.tourPlayId}
                        onChange={handleInputChange}
                        className="form-input">
                        <option></option>
                        {plays.map(title => (
                            <option key={title.id} value={title.id}>
                                {title.title}
                            </option>
                        ))}
                    </select>
                </label>
            </div>}


            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterEmployeesForm;
