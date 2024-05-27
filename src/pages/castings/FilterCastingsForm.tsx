import React, {useEffect, useState} from 'react';
import '../../styles/Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterCastingCriteria} from "../../webclients/casting/FilterCastingCriteria.ts";
import {GenreClient} from "../../webclients/genre/GenreClient.ts";
import {Genre} from "../../webclients/genre/Genre.ts";
import {ActorClient} from "../../webclients/actor/ActorClient.ts";
import {Button, DatePicker, Popover} from "antd";
import {Actor} from "../../webclients/actor/Actor.ts";
import {Employee} from "../../webclients/employee/Employee.ts";
import {EmployeeClient} from "../../webclients/employee/EmployeeClient.ts";

const FilterCastingsForm: React.FC<FilterProps<FilterCastingCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterCastingCriteria>({
        actorId: undefined,
        dateOfStart: undefined,
        dateOfEnd: undefined,
        playGenreId: undefined,
        productionDirectorId: undefined,
        ageCategory: undefined
    });

    const [productionDirectors, setProductionDirectors] = useState<Employee[]>([]);
    const [actorsOptions, setActorsOptions] = useState<Actor[]>([])
    const [genresOptions, setGenresOptions] = useState<Genre[]>([])
    const [startDate, setStartDate] = useState<string | undefined | null>();
    const [endDate, setEndDate] = useState<string | undefined | null>();
    const [error, setError] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleStartDateChange = (date: string | null) => {
        setStartDate(date);
        setFilters({
            ...filters,
            dateOfStart: date ? formatDate(new Date(date)) : undefined
        });
    };

    const handleEndDateChange = (date: string | null) => {
        setEndDate(date);
        setFilters({
            ...filters,
            dateOfEnd: date ? formatDate(new Date(date)) : undefined
        });
    };

    function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (startDate != undefined && endDate != undefined && endDate < startDate) {
            setError('Выберите корректные даты начала и конца периода.');
            return;
        }
        onFilterChange(filters);
        console.log(filters)
    };

    useEffect(() => {
        const fetchActorsOptions = async () => {
            const countriesClient = ActorClient.getInstance()
            try {
                const actors = await countriesClient.fetchAllActors()
                if (actors) {
                    setActorsOptions(actors);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        const fetchGenresOptions = async () => {
            const genresClient = GenreClient.getInstance()
            try {
                const genres = await genresClient.fetchAllGenres()
                if (genres) {
                    setGenresOptions(genres);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        const fetchProductionDirectors = async (): Promise<Employee[]> => {
            const filters = {
                minSalary: undefined,
                maxSalary: undefined,
                gender: '',
                amountOfChildren: undefined,
                employeeTypeName: "ProductionDirector",
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
            }
            try {
                const data = await EmployeeClient.getInstance().fetchData("employees/filter", filters)
                if (data) {
                    setProductionDirectors(data);
                    return data
                }
                return []
            } catch (error) {
                console.error('Error fetching data:', error);
                return []
            }
        }

        fetchGenresOptions().then()
        fetchActorsOptions().then()
        fetchProductionDirectors().then()

    }, []);

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <label className="form-label">
                Актёр:
                <select
                    name="actorId"
                    value={filters.actorId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {actorsOptions.map(actor => (
                        <option key={actor.id} value={actor.id}>
                            {actor.firstName} {actor.secondName} {actor.patronymic}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Рассматривать спектакли, начиная с даты:
                <DatePicker
                    allowClear={true}
                    name="dateOfStart"
                    onChange={handleStartDateChange}
                    value={startDate}
                    className="form-input"
                />
            </label>

            <label className="form-label">
                Рассматривать спектакли, заканчивая датой:
                <DatePicker
                    allowClear={true}
                    name="dateOfEnd"
                    onChange={handleEndDateChange}
                    value={endDate}
                    className="form-input"
                />
            </label>
            {error && <Popover content={error}><Button type="primary" danger>Ошибка</Button></Popover>}

            <label className="form-label">
                Жанр:
                <select
                    name="playGenreId"
                    value={filters.playGenreId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {genresOptions.map(genre => (
                        <option key={genre.id} value={genre.id}>
                            {genre.title}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Режиссёр-постановщик:
                <select
                    name="productionDirectorId"
                    value={filters.productionDirectorId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {productionDirectors.map(productionDirector => (
                        <option key={productionDirector.id} value={productionDirector.id}>
                            {productionDirector.firstName} {productionDirector.secondName} {productionDirector.patronymic} ({productionDirector.dateOfBirth})
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Возрастная категория спектакля:
                <select name="ageCategory"
                        value={filters.ageCategory}
                        onChange={handleInputChange}
                        className="form-select">
                    <option value="">Любая</option>
                    <option value="0">0+</option>
                    <option value="6">6+</option>
                    <option value="12">12+</option>
                    <option value="16">16+</option>
                    <option value="18">18+</option>
                </select>
            </label>
            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterCastingsForm;
