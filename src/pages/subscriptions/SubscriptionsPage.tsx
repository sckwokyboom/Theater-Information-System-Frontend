import '../../App.css'
import React, {useEffect, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {BuySubscriptionRequestClient} from "../../webclients/subscription/BuySubscriptionRequestClient.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import {Performance} from '../../webclients/performance/Performance.ts'
import {Place} from "../../webclients/place/Place.ts";
import {PlaceClient} from "../../webclients/place/PlaceClient.ts";
import {BuySubscriptionRequest} from "../../webclients/subscription/BuySubscriptionRequest.ts";

function SubscriptionsPage() {
    const buySubscriptionRequestClient = BuySubscriptionRequestClient.getInstance()

    const [performances, setPerformances] = useState<Performance[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPerformance, setSelectedPerformance] = useState<Performance | undefined>(undefined);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
    // const [purchasedPerformancesIds, setPurchasedPerformancesIds] = useState<Performance[]>([])
    // const [purchasedPlaceIds, setPurchasedPlaceIds] = useState<Place[]>([])
    const [purchasedTickets, setPurchasedTickets] = useState<{ performance: Performance, place: Place }[]>([]);


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


    const handleUpdateEmployee = async () => {
        try {
            if (editedEmployee) {
                const updatedEmployee = await buySubscriptionRequestClient.updateData("performances", editedEmployee.id, editedEmployee)
                if (updatedEmployee) {
                    const updatedEmployees = [...performances];
                    updatedEmployees[editingEmployeeIndex!] = editedEmployee;
                    console.log(`Person ${editingEmployeeIndex!} was updated`)
                    setPerformances(updatedEmployees);
                    setEditingEmployeeIndex(null);
                    setEditedEmployee(null);
                }
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        try {
            const deleted = await buySubscriptionRequestClient.deleteData("performances", employeeId)
            if (deleted) {
                setPerformances(performances.filter(employee => employee.id !== employeeId));
                setEditingEmployeeIndex(null);
                setEditedEmployee(null);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleAddTicket = () => {
        if (selectedPerformance && selectedPlace) {
            setPerformances(performances.filter(performance => performance.id !== selectedPerformance.id));
            setPurchasedTickets([...purchasedTickets, {performance: selectedPerformance, place: selectedPlace}])
        }
        setSelectedPerformance(undefined)
        setSelectedPlace(undefined)
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

    const handleBuySubscription = () => {
        const request: BuySubscriptionRequest = {
            performanceIds: purchasedTickets.map(item => item.performance.id),
            placeIds: purchasedTickets.map(item => item.place.id),
        };
        console.log(request)
        BuySubscriptionRequestClient.getInstance().buySubscription(request).then()
    };

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                {purchasedTickets.map((item, index) => (
                    <div key={index} style={{marginBottom: '10px'}}>
                        Билет на спектакль: {item.performance.playTitle}. Дата: {item.performance.date}.
                        Место: {item.place.id} ({item.place.priceCoefficient * item.performance.basePrice} руб.)
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <label>
                    Спектакль:
                    <select id="performance-select" onChange={handlePerformanceChange}>
                        <option value="">--Выберите спектакль--</option>
                        {performances.map(performance => (
                            <option key={performance.id} value={performance.id}>
                                {performance.playTitle} ({performance.date})
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
                <button onClick={handleAddTicket}>Добавить билет в абонемент</button>
            }
            {purchasedTickets.length != 0 &&
                <button onClick={handleBuySubscription}>Купить абонемент</button>}
        </div>
    )
}

export default SubscriptionsPage
