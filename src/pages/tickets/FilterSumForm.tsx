import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {FilterProps} from "../../FilterProps.ts";
import {FilterSumCriteria} from "../../webclients/ticket/FilterTicketCriteria.ts";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";

const FilterSumForm: React.FC<FilterProps<FilterSumCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterSumCriteria>({
        performanceId: undefined,
    });


    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
    };

    const [performancesOptions, setPerformancesOptions] = useState<Performance[]>([]);

    useEffect(() => {
        const fetchPerformancesOptions = async () => {
            const repertoiresClient = PerformanceClient.getInstance();
            try {
                const performances = await repertoiresClient.getAllPerformances();
                if (performances) {
                    setPerformancesOptions(performances);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchPerformancesOptions().then();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <Box mb={2}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Спектакль</InputLabel>
                    <Select
                        name="performanceId"
                        value={filters.performanceId?.toString() == undefined ? '' : filters.performanceId?.toString()}
                        onChange={handleSelectChange}
                        label="Спектакль"
                    >
                        <MenuItem value="">
                            <em>За все спектакли</em>
                        </MenuItem>
                        {performancesOptions.map(performance => (
                            <MenuItem key={performance.id} value={performance.id}>
                                {performance.playTitle} ({performance.startTime} - {performance.endTime}).
                                Зал: {performance.hallTitle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button type="submit" variant="contained" color="primary">Применить фильтр</Button>
        </form>
    );
};

export default FilterSumForm;
