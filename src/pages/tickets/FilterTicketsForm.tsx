import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Popover} from 'antd';
import '../../styles/Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterTicketCriteria} from "../../webclients/ticket/FilterTicketCriteria.ts";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";

const FilterTicketsForm: React.FC<FilterProps<FilterTicketCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterTicketCriteria>({
        performanceId: undefined,
        isPremiere: undefined,
        isUpcomingPerformances: undefined,
        dateOfStart: undefined,
        dateOfEnd: undefined,
        isPreSold: undefined
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

    const [performancesOptions, setPerformancesOptions] = useState<Performance[]>([])

    useEffect(() => {

        const fetchPerformancesOptions = async () => {
            const repertoiresClient = PerformanceClient.getInstance()
            try {
                const performances = await repertoiresClient.getAllPerformances()
                if (performances) {
                    setPerformancesOptions(performances)
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchPerformancesOptions().then();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <label className="form-label">
                Спектакль:
                <select
                    name="performanceId"
                    value={filters.performanceId}
                    onChange={handleInputChange}
                    className="form-input">
                    <option></option>
                    {performancesOptions.map(performance => (
                        <option key={performance.id} value={performance.id}>
                            {performance.playTitle} ({performance.startTime} - {performance.endTime}).
                            Зал: {performance.hallTitle}
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
                Предстоящий спектакль:
                <select name="isUpcomingPerformances"
                        value={filters.isUpcomingPerformances}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"true"}>Да</option>
                    <option value={"false"}>Нет</option>
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
                Продан предварительно:
                <select name="isPreSold"
                        value={filters.isPreSold}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"true"}>Да</option>
                    <option value={"false"}>Нет</option>
                </select>
            </label>

            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterTicketsForm;
