import React, {useEffect, useState} from 'react';
import '../../Filter.css';
import {FilterProps} from "../../FilterProps.ts";
import {FilterPerformanceInfoCriteria} from "../../webclients/performanceinfo/FilterPerformanceInfoCriteria.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import {Performance} from "../../webclients/performance/Performance.ts";

const FilterPerformancesInfoForm: React.FC<FilterProps<FilterPerformanceInfoCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterPerformanceInfoCriteria>({
        performanceId: undefined
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
            <label>
                Спектакль:
                <select id="performance-select" onChange={handleInputChange} name={"performanceId"}>
                    <option value="">--Выберите спектакль--</option>
                    {performances.map(performance => (
                        <option key={performance.id} value={performance.id}>
                            {performance.playTitle} (с {performance.startTime} по {performance.endTime})
                        </option>
                    ))}
                </select>
            </label>
            <hr/>
            <button type="submit" className="form-button">Применить фильтр</button>
        </form>
    );
};

export default FilterPerformancesInfoForm;
