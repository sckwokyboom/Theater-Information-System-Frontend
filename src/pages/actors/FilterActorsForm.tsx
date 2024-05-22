import React, {useEffect, useState} from 'react';
import '../../Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterActorCriteria} from "../../webclients/actor/FilterActorCriteria.ts";
import {Nationality} from "../../webclients/nationality/Nationality.ts";
import {NationalityClient} from "../../webclients/nationality/NationalityClient.ts";
import {Title} from "../../webclients/title/Title.ts";
import {TitleClient} from "../../webclients/title/TitleClient.ts";
import {DatePicker} from "antd";

const FilterActorsForm: React.FC<FilterProps<FilterActorCriteria>> = ({onFilterChange}) => {
        const [filters, setFilters] = useState<FilterActorCriteria>({
            roleWeight: undefined,
            roleHeight: undefined,
            roleSkinColor: undefined,
            roleHairColor: undefined,
            roleVoiceType: undefined,
            roleNationalityId: undefined,
            titleId: undefined,
            age: undefined,
            gender: undefined,
            dateOfStartForTitle: undefined,
            dateOfEndForTitle: undefined
        });

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const {name, value} = event.target;
            if (name == "roleVoiceType") {
                setSelectedVoiceTypeOption(value)
            }
            if (name == "roleSkinColor") {
                setSelectedSkinColorOption(value)
            }
            if (name == "roleHairColor") {
                setSelectedHairColorOption(value)
            }
            setFilters({...filters, [name]: value});
        };

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onFilterChange(filters);
            console.log(filters)
        };

        const voiceTypeOptions = ['', 'Тенор', 'Баритон', 'Бас', 'Контральто', 'Сопрано', 'Альт', 'Меццо-сопрано', 'Контртенор', 'Драматический тенор', 'Лирический тенор', 'Драматический баритон', 'Лирический баритон', 'Драматический бас', 'Легкий баритон', 'Лирический бас', 'Фальцет', 'Драматический контртенор', 'Лирический контртенор'];
        const hairColorOptions = ['', 'ЧЕРНЫЙ', 'КОРИЧНЕВЫЙ', 'СВЕТЛО-КОРИЧНЕВЫЙ', 'РУСЫЙ', 'РЫЖИЙ', 'БЛОНДИН', 'СЕДОЙ', 'БЕЛЫЙ', 'СЕРЫЙ', 'ПЕПЕЛЬНЫЙ', 'ПЕСОЧНЫЙ', 'МЕДНЫЙ', 'ШАТЕН', 'КАШТАНОВЫЙ', 'МЕЛИРОВАННЫЙ', 'ОКРАШЕННЫЙ В ЧЁРНЫЙ', 'ОКРАШЕННЫЙ В КРАСНЫЙ', 'ОКРАШЕННЫЙ В СИНИЙ', 'ОКРАШЕННЫЙ В ЗЕЛЁНЫЙ', 'ОКРАШЕННЫЙ В ФИОЛЕТОВЫЙ', 'ОКРАШЕННЫЙ В РОЗОВЫЙ'];
        const skinColorOptions = ['', 'ОЧЕНЬ СВЕТЛЫЙ', 'СВЕТЛЫЙ', 'СРЕДНИЙ', 'ТЕМНЫЙ', 'ОЧЕНЬ ТЕМНЫЙ', 'ЧЕРНЫЙ'];
        const [nationalityOptions, setNationalityOptions] = useState<Nationality[]>([])
        const [selectedNationalityOption, setSelectedNationalityOption] = useState<Nationality>();
        const [titleOptions, setTitleOptions] = useState<Title[]>([])
        const [selectedTitleOption, setSelectedTitleOption] = useState<Title>();
        const [selectedVoiceTypeOption, setSelectedVoiceTypeOption] = useState('');
        const [selectedHairColorOption, setSelectedHairColorOption] = useState('');
        const [selectedSkinColorOption, setSelectedSkinColorOption] = useState('');

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
                dateOfStartForTitle: date ? formatDate(new Date(date)) : undefined
            });
        };

        const handleEndDateChange = (date: string | null) => {
            setEndDate(date);
            setFilters({
                ...filters,
                dateOfEndForTitle: date ? formatDate(new Date(date)) : undefined
            });
        };

        const handleSelectedHairColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const {value} = event.target;
            setSelectedHairColorOption(value)
            handleInputChange(event)
        };

        const handleSelectedSkinColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const {value} = event.target;
            setSelectedSkinColorOption(value)
            handleInputChange(event)
        };

        const handleSelectedVoiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const {value} = event.target;
            setSelectedVoiceTypeOption(value)
            handleInputChange(event)
        };


        useEffect(() => {
            const fetchNationalitiesOptions = async () => {
                const nationalitiesClient = NationalityClient.getInstance()
                try {
                    const nationalities = await nationalitiesClient.getAllNationalities()
                    if (nationalities) {
                        setNationalityOptions(nationalities);
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            };

            const fetchTitlesOptions = async () => {
                const titlesClient = TitleClient.getInstance()
                try {
                    const titles = await titlesClient.getAllTitles()
                    if (titles) {
                        setTitleOptions(titles);
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            };

            fetchNationalitiesOptions().then()
            fetchTitlesOptions().then()
        }, []);

        return (
            <form onSubmit={handleSubmit} className="filter-form">
                <label className="form-label">
                    Вес, предпочтительный для роли:
                    <input type="number"
                           name="roleWeight"
                           value={filters.roleWeight}
                           onChange={handleInputChange}
                           className="form-input"/>
                </label>

                <label className="form-label">
                    Рост, предпочтительный для роли:
                    <input type="number"
                           name="roleHeight"
                           value={filters.roleHeight}
                           onChange={handleInputChange}
                           className="form-input"/>
                </label>

                <label className="form-label">
                    Тип голоса:
                    <select name="roleVoiceType" value={selectedVoiceTypeOption}
                            onChange={handleInputChange}
                            className="form-select">
                        {voiceTypeOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </label>

                <label className="form-label">
                    Цвет волос:
                    <select name="roleHairColor" value={selectedHairColorOption}
                            onChange={handleInputChange}
                            className="form-select">
                        {hairColorOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </label>

                <label className="form-label">
                    Цвет кожи:
                    <select name="roleSkinColor" value={selectedSkinColorOption}
                            onChange={handleInputChange}
                            className="form-select">
                        {skinColorOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
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
                    Возраст:
                    <input type="number"
                           name="age"
                           value={filters.age}
                           onChange={handleInputChange}
                           className="form-input"/>
                </label>

                <label className="form-label">
                    Национальность, предпочтительная для роли:
                    <select
                        name="roleNationalityId"
                        value={filters.roleNationalityId}
                        onChange={handleInputChange}
                        className="form-input">
                        <option></option>
                        {nationalityOptions.map(nationality => (
                            <option key={nationality.id} value={nationality.id}>
                                {nationality.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="form-label">
                    Звание за конкурс, полученное актёром:
                    <select
                        name="titleId"
                        value={filters.titleId}
                        onChange={handleInputChange}
                        className="form-input">
                        <option></option>
                        {titleOptions.map(title => (
                            <option key={title.id} value={title.id}>
                                {title.name} в соревновании {title.competitionName}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="form-label">
                    Получил звание, начиная с даты:
                    <DatePicker
                        allowClear={true}
                        name="dateOfStartForTitle"
                        onChange={handleEndDateChange}
                        value={startDate}
                        className="form-input"
                    />
                </label>

                <label className="form-label">
                    Спектакли по его пьесам были поставлены, заканчивая датой:
                    <DatePicker
                        allowClear={true}
                        name="dateOfEndForTitle"
                        onChange={handleStartDateChange}
                        value={endDate}
                        className="form-input"
                    />
                </label>

                <button type="submit" className="form-button">Применить фильтр</button>
            </form>
        );
    }
;

export default FilterActorsForm;
