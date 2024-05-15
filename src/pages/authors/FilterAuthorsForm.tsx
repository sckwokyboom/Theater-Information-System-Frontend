import React, {useEffect, useState} from 'react';
import '../../Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterAuthorCriteria} from "../../webclients/author/FilterAuthorCriteria.ts";
import {CountryClient} from "../../webclients/country/CountryClient.ts";
import {Country} from "../../webclients/country/Country.ts";
import {GenreClient} from "../../webclients/genre/GenreClient.ts";
import {Genre} from "../../webclients/genre/Genre.ts";
import {Button, DatePicker, Popover} from "antd";

const FilterAuthorsForm: React.FC<FilterProps<FilterAuthorCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterAuthorCriteria>({
        wasPerformed: undefined,
        centuryOfLiving: undefined,
        countryOfOriginId: undefined,
        genreId: undefined,
        dateOfStartPerformanceAuthorsPlays: undefined,
        dateOfEndPerformanceAuthorsPlays: undefined
    });
    const [countriesOptions, setCountriesOptions] = useState<Country[]>([])
    const [genresOptions, setGenresOptions] = useState<Genre[]>([])
    const [startDate, setStartDate] = useState<string | undefined | null>();
    const [endDate, setEndDate] = useState<string | undefined | null>();
    const [error, setError] = useState<string>('');

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
            dateOfStartPerformanceAuthorsPlays: date ? formatDate(new Date(date)) : undefined
        });
    };

    const handleEndDateChange = (date: string | null) => {
        setEndDate(date);
        setFilters({
            ...filters,
            dateOfEndPerformanceAuthorsPlays: date ? formatDate(new Date(date)) : undefined
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
        console.log(filters)
    };

    useEffect(() => {
        const fetchCountriesOptions = async () => {
            const countriesClient = CountryClient.getInstance()
            try {
                const countries = await countriesClient.fetchAllCountries()
                if (countries) {
                    setCountriesOptions(countries);
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

        fetchGenresOptions().then()
        fetchCountriesOptions().then()
    }, []);

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <label className="form-label">
                Страна происхождения автора:
                <select
                    name="countryOfOriginId"
                    value={filters.countryOfOriginId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {countriesOptions.map(country => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </label>


            <label className="form-label">
                Век, в котором жил автор:
                <input type="number"
                       name="centuryOfLiving"
                       value={filters.centuryOfLiving}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>

            <label className="form-label">
                Ставился ли спектакль по пьесам автора:
                <select name="wasPerformed"
                        value={filters.wasPerformed}
                        onChange={handleInputChange}
                        className="form-select">
                    <option value=""></option>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </label>

            <label className="form-label">
                Жанр, в котором автор писал пьесы:
                <select
                    name="genreId"
                    value={filters.genreId}
                    onChange={handleInputChange}
                    className="form-input">
                    {genresOptions.map(genre => (
                        <option key={genre.id} value={genre.id}>
                            {genre.title}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Спектакли по его пьесам были поставлены, начиная с даты:
                <DatePicker
                    allowClear={true}
                    name="dateOfStartPerformanceAuthorsPlays"
                    onChange={handleStartDateChange}
                    value={startDate}
                    className="form-input"
                />
            </label>

            <label className="form-label">
                Спектакли по его пьесам были поставлены, заканчивая датой:
                <DatePicker
                    allowClear={true}
                    name="dateOfEndPerformanceAuthorsPlays"
                    onChange={handleEndDateChange}
                    value={endDate}
                    className="form-input"
                />
            </label>

            {error && <Popover content={error}><Button type="primary" danger>Ошибка</Button></Popover>}

            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterAuthorsForm;
