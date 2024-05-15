import React, {useState} from 'react';
import '../../Filter.css';

const Filter: React.FC<FilterEmployeeProps> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterEmployeeCriteria>({
        minSalary: undefined,
        maxSalary: undefined,
        gender: '',
        childrenCount: undefined,
        employeeType: '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
        console.log(filters)
    };

    const employeeTypeOptions = ['Все работники', 'Артисты', 'Музыканты', 'Актёры', 'Постановщики', 'Режиссёры-постановщики', 'Дирижёры', 'Художники-постановщики', 'Менеджеры'];
    // const genderTypes = ['Мужчины', 'Женщины', 'Другое']

    const [selectedEmployeeTypeOption, setSelectedEmployeeTypeOption] = useState('');
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
                Количество детей:
                <input type="number"
                       name="childrenCount"
                       value={filters.childrenCount}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Тип сотрудника:
                <select name="employeeType" value={selectedEmployeeTypeOption}
                        onChange={handleSelectEmployeeTypeChange}
                        className="form-select">
                    {employeeTypeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </label>
            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default Filter;
