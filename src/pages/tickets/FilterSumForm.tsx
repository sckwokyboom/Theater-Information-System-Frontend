import React, {useEffect, useState} from 'react';
import '../../Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterSumCriteria} from "../../webclients/ticket/FilterTicketCriteria.ts";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";

const FilterSumForm: React.FC<FilterProps<FilterSumCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterSumCriteria>({
        performanceId: undefined,
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
                    <option value={""}>За все спектакли</option>
                    {performancesOptions.map(performance => (
                        <option key={performance.id} value={performance.id}>
                            {performance.playTitle} ({performance.startTime} - {performance.endTime}).
                            Зал: {performance.hallTitle}
                        </option>
                    ))}
                </select>
            </label>

            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterSumForm;
