import React, {useEffect, useState} from 'react';
import '../../styles/Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterPlaceCriteria} from "../../webclients/place/FilterPlaceCriteria.ts";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";

const FilterFreePlacesForm: React.FC<FilterProps<FilterPlaceCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterPlaceCriteria>({
        performanceId: undefined,
        isPremiere: undefined,
        isUpcomingPerformances: undefined
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value.toString()});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
        console.log(filters)
    };

    const [performances, setPerformances] = useState<Performance[]>([]);


    useEffect(() => {
        const fetchPerformancesOptions = async () => {
            const performanceClient = PerformanceClient.getInstance()
            try {
                const performances = await performanceClient.getAllPerformances()
                if (performances) {
                    setPerformances(performances);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchPerformancesOptions().then()
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
                    {performances.map(performance => (
                        <option key={performance.id} value={performance.id}>
                            {performance.playTitle} ({performance.startTime} - {performance.endTime})
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
                <select name="isUpcomingPerformances"
                        value={filters.isUpcomingPerformances}
                        onChange={handleInputChange}
                        className="form-select">
                    <option></option>
                    <option value={"false"}>Да</option>
                    <option value={"true"}>Нет</option>
                </select>
            </label>

            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterFreePlacesForm;
