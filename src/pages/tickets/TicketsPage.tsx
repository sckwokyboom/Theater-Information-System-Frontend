import '../../styles/App.css';
import React, {useEffect, useState} from "react";
import FilteredTable from "../FilteredTable.tsx";
import {TicketClient} from "../../webclients/ticket/TicketClient.ts";
import {Ticket} from "../../webclients/ticket/Ticket.ts";
import {FilterSumCriteria, FilterTicketCriteria} from "../../webclients/ticket/FilterTicketCriteria.ts";
import FilterTicketsForm from "./FilterTicketsForm.tsx";
import {Sum} from "../../webclients/ticket/Sum.ts";
import {SumClient} from "../../webclients/ticket/SumClient.ts";
import FilterSumForm from "./FilterSumForm.tsx";
import {Performance} from "../../webclients/performance/Performance.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import {PlaceClient} from "../../webclients/place/PlaceClient.ts";
import {Place} from "../../webclients/place/Place.ts";

import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Typography
} from '@mui/material';
import MuiAlert, {AlertProps} from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TicketsPage() {
    const ticketClient = TicketClient.getInstance();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sum, setSum] = useState<Sum[]>([]);
    const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPerformance, setSelectedPerformance] = useState<Performance | undefined>(undefined);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
    const [newTicket, setNewTicket] = useState<Ticket>({
        id: 0,
        performanceId: undefined,
        price: undefined,
        playTitle: undefined,
        hallTitle: undefined,
        placeId: 0,
        subscriptionId: 0,
        saleDate: undefined,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTickets = async (filters: FilterTicketCriteria): Promise<Ticket[]> => {
        try {
            const data = await ticketClient.fetchData("tickets/filter", filters);
            if (data) {
                setTickets(data);
                return data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Ошибка при загрузке данных.');
            return [];
        }
    };

    const fetchSum = async (filters: FilterSumCriteria): Promise<Sum[]> => {
        try {
            const data = await SumClient.getInstance().fetchData("tickets/sum", filters);
            if (data) {
                setSum(data);
                return data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Ошибка при загрузке данных.');
            return [];
        }
    };

    const toggleEditMode = (index: number) => {
        setEditingTicketIndex(index);
    };

    const fetchFreePlacesOptions = async (performanceId: number) => {
        const placeClient = PlaceClient.getInstance();
        try {
            const freePlacesForThisPerformance = await placeClient.getFreePlaces(performanceId);
            if (freePlacesForThisPerformance) {
                setPlaces(freePlacesForThisPerformance);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setErrorMessage('Ошибка при загрузке свободных мест.');
        }
    };

    const handleBuyTicket = async () => {
        try {
            if (selectedPlace && selectedPerformance) {
                newTicket.performanceId = selectedPerformance.id;
                newTicket.placeId = selectedPlace.id;
                newTicket.price = selectedPlace.priceCoefficient * selectedPerformance.basePrice;
            }
            const addedTicket = await ticketClient.createData("tickets", newTicket)
                .then(() => fetchTickets({
                    performanceId: undefined,
                    isPremiere: undefined,
                    isUpcomingPerformances: undefined,
                    dateOfStart: undefined,
                    dateOfEnd: undefined,
                    isPreSold: undefined
                }));
            if (addedTicket) {
                setShowAddForm(false);
                setNewTicket({
                    id: 0,
                    performanceId: undefined,
                    price: undefined,
                    playTitle: undefined,
                    hallTitle: undefined,
                    placeId: 0,
                    subscriptionId: 0,
                    saleDate: undefined,
                });
                setSelectedPerformance(undefined);
                setSelectedPlace(undefined);
            }
        } catch (error) {
            console.error('Error adding ticket:', error);
            setErrorMessage('Ошибка при добавлении билета.');
        }
    };

    useEffect(() => {
        const fetchUpcomingPerformancesOptions = async () => {
            const performanceClient = PerformanceClient.getInstance();
            try {
                const upcomingPerformances = await performanceClient.getUpcomingPerformances();
                if (upcomingPerformances) {
                    setPerformances(upcomingPerformances);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setErrorMessage('Ошибка при загрузке предстоящих спектаклей.');
            }
        };
        fetchUpcomingPerformancesOptions();
    }, []);

    const handleDeleteTicket = async (ticketId: number) => {
        try {
            await ticketClient.deleteData("tickets", ticketId);
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
            setEditingTicketIndex(null);
        } catch (error) {
            console.error('Error deleting ticket:', error);
            setErrorMessage('Ошибка при удалении билета.');
        }
    };

    const handlePerformanceChange = async (event: SelectChangeEvent<number>) => {
        const selectedId = Number(event.target.value);
        const performance = performances.find(p => p.id === selectedId);
        setSelectedPerformance(performance);
        setSelectedPlace(undefined); // Reset selected place
        if (performance) {
            await fetchFreePlacesOptions(performance.id);
        }
    };

    const handlePlaceChange = (event: SelectChangeEvent<number>) => {
        const selectedId = Number(event.target.value);
        const place = places.find(p => p.id === selectedId);
        setSelectedPlace(place);
    };

    const handleCancelSelection = () => {
        setShowAddForm(false);
        setSelectedPerformance(undefined);
        setSelectedPlace(undefined);
        setNewTicket({
            id: 0,
            performanceId: undefined,
            price: undefined,
            playTitle: undefined,
            hallTitle: undefined,
            placeId: 0,
            subscriptionId: 0,
            saleDate: undefined,
        });
    };

    const renderRow = (ticket: Ticket, index: number) => (
        <tr key={ticket.id}
            onClick={() => {
                if (index !== editingTicketIndex) {
                    toggleEditMode(index);
                }
            }}>
            <td>{ticket.id}</td>
            <td>{ticket.playTitle}</td>
            <td>{ticket.price}</td>
            <td>{ticket.placeId}</td>
            <td>{ticket.hallTitle}</td>
            <td>{ticket.saleDate}</td>
            <td>{ticket.subscriptionId}</td>
            {editingTicketIndex === index && tickets[editingTicketIndex].subscriptionId === 0 && (
                <td>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteTicket(ticket.id)}>
                        Удалить билет
                    </Button>
                </td>
            )}
        </tr>
    );

    const renderSumRow = (ticket: Sum) => (
        <tr key={ticket.sum}>
            <td>{ticket.sum} руб.</td>
        </tr>
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>Билеты</Typography>
            <Divider/>
            <Box mt={2}>
                <Typography variant="h5" gutterBottom>Список билетов</Typography>
                <FilteredTable<Ticket, FilterTicketCriteria>
                    fetchData={fetchTickets}
                    filterInitialState={{
                        performanceId: undefined,
                        isPremiere: undefined,
                        isUpcomingPerformances: undefined,
                        dateOfStart: undefined,
                        dateOfEnd: undefined,
                        isPreSold: undefined
                    }}
                    renderRow={renderRow}
                    FilterComponent={FilterTicketsForm}
                    tableHeaders={["ID", "Название пьесы", "Цена", "ID места", "Название зала", "Дата продажи билета", "ID абонемента"]}
                    tableData={tickets}
                />
            </Box>
            <Divider/>
            <Box mt={2}>
                <Typography variant="h5" gutterBottom>Покупка билета</Typography>
                {!showAddForm && (
                    <Button variant="contained" color="primary" onClick={() => setShowAddForm(true)}>Выбрать
                        билет</Button>
                )}
                {showAddForm && (
                    <Box mt={2}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <FormControl variant="outlined" margin="normal" fullWidth>
                                <InputLabel>Спектакль</InputLabel>
                                <Select
                                    value={selectedPerformance ? selectedPerformance.id : ""}
                                    onChange={handlePerformanceChange}
                                    label="Спектакль"
                                >
                                    <MenuItem value="">
                                        <em>--Выберите спектакль--</em>
                                    </MenuItem>
                                    {performances.map(performance => (
                                        <MenuItem key={performance.id} value={performance.id}>
                                            {performance.playTitle} ({performance.startTime} - {performance.endTime}).
                                            Зал: {performance.hallTitle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {selectedPerformance && (
                                <FormControl variant="outlined" margin="normal" fullWidth>
                                    <InputLabel>Место</InputLabel>
                                    <Select
                                        value={selectedPlace ? selectedPlace.id : ""}
                                        onChange={handlePlaceChange}
                                        label="Место"
                                    >
                                        <MenuItem value="">
                                            <em>--Выберите место--</em>
                                        </MenuItem>
                                        {places.map(place => (
                                            <MenuItem key={place.id} value={place.id}>
                                                {place.id} ({place.hallTitle} зал).
                                                Цена: {place.priceCoefficient * selectedPerformance.basePrice} руб.
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                        <Box display="flex" justifyContent="flex-start" mb={2}>
                            <Button variant="contained" color="primary" onClick={handleBuyTicket}>
                                Купить билет
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleCancelSelection}
                                    style={{marginLeft: '10px'}}>
                                Отменить
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
            <Divider/>
            <Box mt={2}>
                <Typography variant="h5" gutterBottom>Сумма прибыли</Typography>
                <FilteredTable<Sum, FilterSumCriteria>
                    fetchData={fetchSum}
                    filterInitialState={{
                        performanceId: undefined,
                    }}
                    renderRow={renderSumRow}
                    FilterComponent={FilterSumForm}
                    tableHeaders={["Сумма"]}
                    tableData={sum}
                />
            </Box>
            {errorMessage && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
                    <Alert onClose={() => setErrorMessage(null)} severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
}

export default TicketsPage;
