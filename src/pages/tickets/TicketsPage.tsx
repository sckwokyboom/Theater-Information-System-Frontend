import '../../styles/App.css'
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

function TicketsPage() {
    const ticketClient = TicketClient.getInstance()
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

    const fetchTickets = async (filters: FilterTicketCriteria): Promise<Ticket[]> => {
        try {
            const data = await ticketClient.fetchData("tickets/filter", filters)
            if (data) {
                setTickets(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    const fetchSum = async (filters: FilterSumCriteria): Promise<Sum[]> => {
        try {
            const data = await SumClient.getInstance().fetchData("tickets/sum", filters)
            if (data) {
                setSum(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    const toggleEditMode = (index: number) => {
        setEditingTicketIndex(index);
    };

    const fetchFreePlacesOptions = async (performanceId: number) => {
        const placeClient = PlaceClient.getInstance()
        try {
            const freePlacesForThisPerformance = await placeClient.getFreePlaces(performanceId)
            if (freePlacesForThisPerformance) {
                setPlaces(freePlacesForThisPerformance);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };


    const handleBuyTicket = async () => {
        try {
            if (selectedPlace && selectedPerformance) {
                newTicket.performanceId = selectedPerformance.id
                newTicket.placeId = selectedPlace.id
                newTicket.price = selectedPlace.priceCoefficient * selectedPerformance.basePrice
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
            }
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };


    useEffect(() => {
        const fetchUpcomingPerformancesOptions = async () => {
            const performanceClient = PerformanceClient.getInstance()
            try {
                const upcomingPerformances = await performanceClient.getUpcomingPerformances()
                if (upcomingPerformances) {
                    setPerformances(upcomingPerformances);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchUpcomingPerformancesOptions().then()
    }, []);

    // const handleUpdatePerformance = async () => {
    //     try {
    //         if (editedPerformance) {
    //             ticketClient.createData("tickets", editedPerformance).then()
    //             const updatedEmployees = [...tickets];
    //             updatedEmployees[editingPerformanceIndex!] = editedPerformance;
    //             setTickets(updatedEmployees);
    //             setEditingPerformanceIndex(null);
    //             setEditedPerformance(null);
    //         }
    //     } catch (error) {
    //         console.error('Error updating employee:', error);
    //     }
    // };

    const handleDeleteTicket = async (ticketId: number) => {
        try {
            ticketClient.deleteData("tickets", ticketId).then()
            setTickets(tickets.filter(employee => employee.id !== ticketId));
            setEditingTicketIndex(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handlePerformanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const performance = performances.find(p => p.id === selectedId);
        setSelectedPerformance(performance);
        if (performance) {
            fetchFreePlacesOptions(performance.id).then()
        }
    };

    const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const place = places.find(p => p.id === selectedId);
        setSelectedPlace(place)
    };

    const renderRow = (ticket: Ticket, index: number) => (
        <tr key={ticket.id}
            onClick={() => {
                if (index != editingTicketIndex) {
                    toggleEditMode(index)
                }
            }}>
            <td>{ticket.id}</td>
            <td>{ticket.playTitle}</td>
            <td>{ticket.price}</td>
            <td>{ticket.placeId}</td>
            <td>{ticket.hallTitle}</td>
            <td>{ticket.saleDate}</td>
            <td>{ticket.subscriptionId}</td>
            {/*{editingPerformanceIndex === index && (*/}
            {/*    <td>*/}
            {/*        <button onClick={handleUpdatePerformance}>Save Changes</button>*/}
            {/*    </td>*/}
            {/*)}*/}
            {editingTicketIndex === index && tickets[editingTicketIndex].subscriptionId == 0 && (
                <td>
                    <button onClick={() => handleDeleteTicket(ticket.id)}>Delete employee
                    </button>
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
            <h1>Билеты</h1>
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
            <button onClick={() => setShowAddForm(true)}>Выбрать билет</button>
            {showAddForm && (
                <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label>
                            Спектакль:
                            <select id="performance-select" onChange={handlePerformanceChange}>
                                <option value="">--Выберите спектакль--</option>
                                {performances.map(performance => (
                                    <option key={performance.id} value={performance.id}>
                                        {performance.playTitle} (с {performance.startTime} по {performance.endTime})
                                    </option>
                                ))}
                            </select>
                        </label>

                        {selectedPerformance &&
                            <label>
                                Место:
                                <select id="place-select" onChange={handlePlaceChange}>
                                    <option value="">--Выберите место в зале--</option>
                                    {places.map(place => (
                                        <option key={place.id} value={place.id}>
                                            Место {place.id}.
                                            Цена: {place.priceCoefficient * selectedPerformance.basePrice} руб.
                                        </option>
                                    ))}
                                </select>
                            </label>
                        }
                    </div>
                    {selectedPlace &&
                        <button onClick={handleBuyTicket}>Купить билет</button>
                    }
                    <button onClick={() => setShowAddForm(false)}>Отмена</button>
                </div>
            )}
            <hr/>
            <label>
                <b>Количество:</b> {tickets.length}.
            </label>
            <hr/>
            <h1>Выручка</h1>
            <FilteredTable<Sum, FilterSumCriteria>
                fetchData={fetchSum}
                filterInitialState={{
                    performanceId: undefined,
                }}
                renderRow={renderSumRow}
                FilterComponent={FilterSumForm}
                tableHeaders={["Общая выручка"]}
                tableData={sum}
            />

        </div>
    )
}

export default TicketsPage
