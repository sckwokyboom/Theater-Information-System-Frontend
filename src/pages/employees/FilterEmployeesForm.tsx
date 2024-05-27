import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {FilterProps} from "../../FilterProps.ts";
import {FilterEmployeeCriteria} from "../../webclients/employee/FilterEmployeeCriteria.ts";
import {Play} from "../../webclients/play/Play.ts";
import {PlayClient} from "../../webclients/play/PlayClient.ts";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
// import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const FilterEmployeesForm: React.FC<FilterProps<FilterEmployeeCriteria>> = ({onFilterChange}) => {
    const [filters, setFilters] = useState<FilterEmployeeCriteria>({
        minSalary: undefined,
        maxSalary: undefined,
        gender: '',
        amountOfChildren: undefined,
        employeeTypeName: '',
        goneOnTour: undefined,
        cameOnTour: undefined,
        tourStartDate: undefined,
        tourEndDate: undefined,
        tourPlayId: undefined,
        performanceId: undefined,
        yearsOfService: undefined,
        yearOfBirth: undefined,
        age: undefined,
        haveChildren: undefined
    });

    const employeeTypeOptions = ['Все работники', 'Артисты', 'Музыканты', 'Актёры', 'Постановщики', 'Режиссёры-постановщики', 'Дирижёры', 'Художники-постановщики', 'Менеджеры'];

    const [selectedEmployeeTypeOption, setSelectedEmployeeTypeOption] = useState('Все работники');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [plays, setPlays] = useState<Play[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilterChange(filters);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setFilters({...filters, [name]: value});
    };

    const handleSelectEmployeeTypeChange = (event: SelectChangeEvent<string>) => {
        const {value} = event.target;
        setSelectedEmployeeTypeOption(value);
        let translatedValue: string;

        switch (value) {
            case 'Все работники':
                translatedValue = "Any";
                break;
            case 'Артисты':
                translatedValue = "Artist";
                break;
            case 'Музыканты':
                translatedValue = "Musician";
                break;
            case 'Актёры':
                translatedValue = "Actor";
                break;
            case 'Постановщики':
                translatedValue = "Director";
                break;
            case 'Режиссёры-постановщики':
                translatedValue = "ProductionDirector";
                break;
            case 'Дирижёры':
                translatedValue = "StageConductor";
                break;
            case 'Художники-постановщики':
                translatedValue = "ProductionDesigner";
                break;
            case 'Менеджеры':
                translatedValue = "Manager";
                break;
            default:
                translatedValue = "Any";
                break;
        }

        setFilters({...filters, employeeTypeName: translatedValue});
    };

    const formatDate = (date: Date | null): string | undefined => {
        if (!date) return undefined;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        setFilters({
            ...filters,
            tourStartDate: formatDate(date)
        });
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        setFilters({
            ...filters,
            tourEndDate: formatDate(date)
        });
    };

    // const handleSelectEmployeeTypeChange = (event: SelectChangeEvent<string>) => {
    //     const {value} = event.target;
    //     setSelectedEmployeeTypeOption(value);
    //     setFilters({
    //         ...filters,
    //         employeeTypeName: value === 'Все работники' ? 'Any' : value
    //     });
    // };

    useEffect(() => {
        const fetchPlaysOptions = async () => {
            try {
                const plays = await PlayClient.getInstance().getAllPlays();
                if (plays) {
                    setPlays(plays);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchPlaysOptions().then();
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h6">Фильтры сотрудников</Typography>

                <TextField
                    label="Минимальная зарплата"
                    type="number"
                    name="minSalary"
                    value={filters.minSalary == undefined ? '' : filters.minSalary}
                    onChange={handleInputChange}
                    fullWidth
                />

                <TextField
                    label="Максимальная зарплата"
                    type="number"
                    name="maxSalary"
                    value={filters.maxSalary == undefined ? '' : filters.maxSalary}
                    onChange={handleInputChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Пол</InputLabel>
                    <Select
                        name="gender"
                        value={filters.gender}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="">Любой</MenuItem>
                        <MenuItem value="Male">Мужской</MenuItem>
                        <MenuItem value="Female">Женский</MenuItem>
                        <MenuItem value="Other">Другое</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Есть ли дети</InputLabel>
                    <Select
                        name="haveChildren"
                        value={filters.haveChildren?.toString() == undefined ? '' : filters.haveChildren?.toString()}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="true">Да</MenuItem>
                        <MenuItem value="false">Нет</MenuItem>
                    </Select>
                </FormControl>

                {filters.haveChildren !== false && (
                    <TextField
                        label="Количество детей"
                        type="number"
                        name="amountOfChildren"
                        value={filters.amountOfChildren == undefined ? '' : filters.amountOfChildren}
                        onChange={handleInputChange}
                        fullWidth
                    />
                )}

                <TextField
                    label="Количество лет службы"
                    type="number"
                    name="yearsOfService"
                    value={filters.yearsOfService == undefined ? '' : filters.yearsOfService}
                    onChange={handleInputChange}
                    fullWidth
                />

                <TextField
                    label="Год рождения"
                    type="number"
                    name="yearOfBirth"
                    value={filters.yearOfBirth == undefined ? '' : filters.yearOfBirth}
                    onChange={handleInputChange}
                    fullWidth
                />

                <TextField
                    label="Возраст"
                    type="number"
                    name="age"
                    value={filters.age == undefined ? '' : filters.age}
                    onChange={handleInputChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Тип сотрудника</InputLabel>
                    <Select
                        name="employeeTypeName"
                        value={selectedEmployeeTypeOption}
                        onChange={handleSelectEmployeeTypeChange}
                    >
                        {employeeTypeOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedEmployeeTypeOption !== 'Все работники' && selectedEmployeeTypeOption !== 'Менеджеры' && (
                    <>
                        <FormControl fullWidth>
                            <InputLabel>Приезжал на гастроли</InputLabel>
                            <Select
                                name="cameOnTour"
                                value={filters.cameOnTour?.toString() == undefined ? '' : filters.cameOnTour?.toString()}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="true">Да</MenuItem>
                                <MenuItem value="false">Нет</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Уезжал на гастроли</InputLabel>
                            <Select
                                name="goneOnTour"
                                value={filters.goneOnTour?.toString() == undefined ? '' : filters.goneOnTour?.toString()}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="true">Да</MenuItem>
                                <MenuItem value="false">Нет</MenuItem>
                            </Select>
                        </FormControl>

                        <DatePicker
                            label="Гастрольный тур начался"
                            value={startDate}
                            onChange={(newValue) => handleStartDateChange(newValue)}
                            // renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} fullWidth/>}
                        />

                        <DatePicker
                            label="Гастрольный тур закончился"
                            value={endDate}
                            onChange={handleEndDateChange}
                            // renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Гастрольный тур с пьесой</InputLabel>
                            <Select
                                name="tourPlayId"
                                value={filters.tourPlayId?.toString() == undefined ? '' : filters.tourPlayId?.toString()}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value=""></MenuItem>
                                {plays.map((play) => (
                                    <MenuItem key={play.id} value={play.id}>
                                        {play.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}

                <Button type="submit" variant="contained">
                    Применить фильтр
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default FilterEmployeesForm;