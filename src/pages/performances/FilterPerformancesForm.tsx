import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Popover} from 'antd';
import '../../Filter.css';
import {FilterPerformanceCriteria, FilterPerformanceProps} from "../../webclient/Performance.ts";
import {Repertoire} from "../../webclient/Repertoire.ts";
import {Genre} from "../../webclient/Genre.ts";
import {Author} from "../../webclient/Author.ts";
import {Country} from "../../webclient/Country.ts";

const Filter: React.FC<FilterPerformanceProps> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterPerformanceCriteria>({
        repertoireId: undefined,
        isPremiere: undefined,
        genreId: undefined,
        dateOfStart: undefined,
        dateOfEnd: undefined,
        authorId: undefined,
        authorCountryId: undefined,
        centuryOfPlayWriting: undefined
    });

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value.toString()});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (startDate != undefined && endDate != undefined && endDate < startDate) {
            setError('Выберите корректные даты начала и конца периода.');
            return;
        }
        setError('');
        onFilterChange(filters);
        console.log(filters)
    };

    const [repertoiresOptions, setRepertoiresOptions] = useState<Repertoire[]>([])
    const [genresOptions, setGenresOptions] = useState<Genre[]>([])
    const [authorsOptions, setAuthorsOptions] = useState<Author[]>([])
    const [countriesOptions, setCountriesOptions] = useState<Country[]>([])

    useEffect(() => {
        const fetchRepertoiresOptions = async () => {
            try {
                const response = await fetch("http://localhost:8080/repertoires/all");
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRepertoiresOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        const fetchGenresOptions = async () => {
            try {
                const response = await fetch("http://localhost:8080/genres/all");
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGenresOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        const fetchAuthorsOptions = async () => {
            try {
                const response = await fetch("http://localhost:8080/authors/all");
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAuthorsOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        const fetchCountriesOptions = async () => {
            try {
                const response = await fetch("http://localhost:8080/countries/all");
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountriesOptions(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchRepertoiresOptions();
        fetchGenresOptions();
        fetchAuthorsOptions();
        fetchCountriesOptions()
    }, []);

    const mapRepertoireToDateString = (repertoire: Repertoire) => {
        return `${repertoire.startOfSeason} — ${repertoire.endOfSeason}`;
    };

    const formatAuthorInfo = (author: Author): string => {
        let fullName = author.firstName;
        if (author.secondName) {
            fullName += ` ${author.secondName}`;
        }
        if (author.patronymic) {
            fullName += ` ${author.patronymic}`;
        }

        let lifespan = '';
        if (author.dateOfBirth) {
            lifespan += ` (${author.dateOfBirth}`;
            if (author.dateOfDeath) {
                lifespan += ` — ${author.dateOfDeath})`;
            } else {
                lifespan += ')';
            }
        }

        const country = `, ${author.countryOfOriginName}`;

        return `${fullName}${lifespan}${country}`;
    };

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <label className="form-label">
                Сезон:
                <select
                    name="repertoireId"
                    value={filters.repertoireId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {repertoiresOptions.map(repertoire => (
                        <option key={repertoire.id} value={repertoire.id}>
                            {mapRepertoireToDateString(repertoire)}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Премьера:
                <select name="isPremiere"
                        value={filters.isPremiere}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"true"}>Да</option>
                    <option value={"false"}>Нет</option>
                </select>
            </label>

            <label className="form-label">
                Жанр:
                <select
                    name="genreId"
                    value={filters.genreId}
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
                Начиная с даты:
                <DatePicker
                    allowClear={true}
                    name="dateOfStart"
                    onChange={handleStartDateChange}
                    value={startDate}
                    className="form-input"
                />
            </label>

            <label className="form-label">
                Заканчивая датой:
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
                Автор:
                <select
                    name="authorId"
                    value={filters.authorId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {authorsOptions.map(author => (
                        <option key={author.id} value={author.id}>
                            {formatAuthorInfo(author)}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-label">
                Страна происхождения автора:
                <select
                    name="authorCountryId"
                    value={filters.authorCountryId}
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
                Век написания пьесы:
                <input type="number"
                       name="centuryOfPlayWriting"
                       value={filters.centuryOfPlayWriting}
                       onChange={handleInputChange}
                       className="form-input"/>
            </label>
            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default Filter;
