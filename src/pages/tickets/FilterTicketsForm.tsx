import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {FilterProps} from "../../FilterProps.ts";
import {FilterTicketCriteria} from "../../webclients/ticket/FilterTicketCriteria.ts";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import MuiAlert, {AlertProps} from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
    const [open, setOpen] = useState(false);

    function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date ? date.toISOString() : null);
        setFilters({
            ...filters,
            dateOfStart: date ? formatDate(date) : undefined
        });
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date ? date.toISOString() : null);
        setFilters({
            ...filters,
            dateOfEnd: date ? formatDate(date) : undefined
        });
    };


    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (startDate != undefined && endDate != undefined && endDate < startDate) {
            setError('Выберите корректные даты начала и конца периода.');
            setOpen(true);
            return;
        }
        setError('');
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                                <em>None</em>
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
                <Box mb={2}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Премьера</InputLabel>
                        <Select
                            name="isPremiere"
                            value={filters.isPremiere == undefined ? '' : filters.isPremiere}
                            onChange={handleSelectChange}
                            label="Премьера"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="true">Да</MenuItem>
                            <MenuItem value="false">Нет</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Предстоящий спектакль</InputLabel>
                        <Select
                            name="isUpcomingPerformances"
                            value={filters.isUpcomingPerformances == undefined ? '' : filters.isUpcomingPerformances}
                            onChange={handleSelectChange}
                            label="Предстоящий спектакль"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="true">Да</MenuItem>
                            <MenuItem value="false">Нет</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <DatePicker
                        label="Начиная с даты"
                        value={startDate ? new Date(startDate) : null}
                        onChange={handleStartDateChange}
                        // renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </Box>
                <Box mb={2}>
                    <DatePicker
                        label="Заканчивая датой"
                        value={endDate ? new Date(endDate) : null}
                        onChange={handleEndDateChange}
                        // renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </Box>
                <Box mb={2}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Продан предварительно</InputLabel>
                        <Select
                            name="isPreSold"
                            value={filters.isPreSold == undefined ? '' : filters.isPreSold}
                            onChange={handleSelectChange}
                            label="Продан предварительно"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="true">Да</MenuItem>
                            <MenuItem value="false">Нет</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button type="submit" variant="contained" color="primary">Применить фильтр</Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                    <Alert onClose={() => setOpen(false)} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </form>
        </LocalizationProvider>
    );
};

export default FilterTicketsForm;
