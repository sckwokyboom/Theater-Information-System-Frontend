import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Popover} from 'antd';
import '../../Filter.css';
import {Repertoire} from "../../webclients/repertoire/Repertoire.ts";
import {Genre} from "../../webclients/genre/Genre.ts";
import {Author} from "../../webclients/author/Author.ts";
import {Country} from "../../webclients/country/Country.ts";
import {FilterPerformanceCriteria} from "../../webclients/performance/FilterPerformanceCriteria.ts";
import {FilterProps} from "../../FilterProps.ts";
import {GenreClient} from "../../webclients/genre/GenreClient.ts";
import {CountryClient} from "../../webclients/country/CountryClient.ts";
import {RepertoireClient} from "../../webclients/repertoire/RepertoireClient.ts";
import {AuthorClient} from "../../webclients/author/AuthorClient.ts";

const FilterPerformancesForm: React.FC<FilterProps<FilterPerformanceCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterPerformanceCriteria>({
        repertoireId: undefined,
        isPremiere: undefined,
        genreId: undefined,
        dateOfStart: undefined,
        dateOfEnd: undefined,
        authorId: undefined,
        authorCountryId: undefined,
        centuryOfPlayWriting: undefined,
        isUpcoming: undefined
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

        const fetchRepertoiresOptions = async () => {
            const repertoiresClient = RepertoireClient.getInstance()
            try {
                const repertoires = await repertoiresClient.getAllRepertoires()
                if (repertoires) {
                    setRepertoiresOptions(repertoires)
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
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
        const fetchAuthorsOptions = async () => {
            const authorsClient = AuthorClient.getInstance()
            try {
                const authors = await authorsClient.getAllAuthors()
                if (authors) {
                    setAuthorsOptions(authors);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchRepertoiresOptions().then();
        fetchAuthorsOptions().then();
        fetchGenresOptions().then()
        fetchCountriesOptions().then();
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
                Уже сыгран:
                <select name="isUpcoming"
                        value={filters.isUpcoming}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"false"}>Да</option>
                    <option value={"true"}>Нет</option>
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

export default FilterPerformancesForm;
