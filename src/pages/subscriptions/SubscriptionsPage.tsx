import '../../App.css'
import React, {useEffect, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {BuySubscriptionRequestClient} from "../../webclients/subscription/BuySubscriptionRequestClient.ts";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import {Performance} from '../../webclients/performance/Performance.ts'
import {Place} from "../../webclients/place/Place.ts";
import {PlaceClient} from "../../webclients/place/PlaceClient.ts";
import {BuySubscriptionRequest} from "../../webclients/subscription/BuySubscriptionRequest.ts";
import FilteredTable from "../FilteredTable.tsx";
import {Subscription} from "../../webclients/subscription/Subscription.ts";
import {FilterSubscriptionCriteria} from "../../webclients/subscription/FilterSubscriptionCriteria.ts";

import {SubscriptionClient} from "../../webclients/subscription/SubscriptionClient.ts";

function SubscriptionsPage() {
    const buySubscriptionRequestClient = BuySubscriptionRequestClient.getInstance()

    const [performances, setPerformances] = useState<Performance[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPerformance, setSelectedPerformance] = useState<Performance | undefined>(undefined);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
    const [purchasedTickets, setPurchasedTickets] = useState<{ performance: Performance, place: Place }[]>([]);
    const [editingSubscriptionIndex, setEditingSubscriptionIndex] = useState<number | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    const fetchData = async (_: FilterSubscriptionCriteria): Promise<Subscription[]> => {
        try {
            const data = await SubscriptionClient.getInstance().getAllSubscriptions()
            if (data) {
                setSubscriptions(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }


    const toggleEditMode = (index: number) => {
        setEditingSubscriptionIndex(index);
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


    const handleDeleteSubscription = async (subscriptionId: number) => {
        try {
            const deleted = await buySubscriptionRequestClient.deleteData("subscriptions", subscriptionId)
            if (deleted) {
                setSubscriptions(subscriptions.filter(subscription => subscription.id !== subscriptionId));
                setEditingSubscriptionIndex(null);
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

    const handleBuySubscription = async () => {
        const request: BuySubscriptionRequest = {
            performanceIds: purchasedTickets.map(item => item.performance.id),
            placeIds: purchasedTickets.map(item => item.place.id),
        };
        console.log(request)
        BuySubscriptionRequestClient.getInstance()
            .buySubscription(request)
            .then(_ => fetchData({}))
        setPurchasedTickets([])
    };

    const renderRow = (subscription: Subscription, index: number) => (
        <tr key={subscription.id}
            onClick={() => {
                if (index !== editingSubscriptionIndex) {
                    toggleEditMode(index);
                }
            }}>
            <td>{subscription.id}</td>
            <td>{subscription.price}</td>
            <td style={{textAlign: "center"}}>
                <button onClick={() => handleDeleteSubscription(subscription.id)}>Удалить абонемент</button>
            </td>
        </tr>
    );

    return (
        <div>
            <label>
                Уже купленные абонементы
                <FilteredTable<Subscription, FilterSubscriptionCriteria>
                    fetchData={fetchData}
                    renderRow={renderRow}
                    FilterComponent={undefined}
                    tableHeaders={["ID", "Цена", "Удаление"]}
                    tableData={subscriptions}
                    filterInitialState={{}}
                />
            </label>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                {purchasedTickets.map((item, index) => (
                    <div key={index} style={{marginBottom: '10px'}}>
                        Билет на спектакль: {item.performance.playTitle}. Дата:
                        с {item.performance.startTime} по {item.performance.endTime}.
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
                <button onClick={handleAddTicket}>Добавить билет в абонемент</button>
            }
            {purchasedTickets.length != 0 &&
                <button onClick={handleBuySubscription}>Купить абонемент</button>}
        </div>
    )
}

export default SubscriptionsPage
