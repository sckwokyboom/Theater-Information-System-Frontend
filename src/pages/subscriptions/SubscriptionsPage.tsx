import '../../styles/App.css';
import React, { useEffect, useState } from "react";
import { BuySubscriptionRequestClient } from "../../webclients/subscription/BuySubscriptionRequestClient.ts";
import { PerformanceClient } from "../../webclients/performance/PerformanceClient.ts";
import { PlaceClient } from "../../webclients/place/PlaceClient.ts";
import { BuySubscriptionRequest } from "../../webclients/subscription/BuySubscriptionRequest.ts";
import FilteredTable from "../FilteredTable.tsx";
import { SubscriptionClient } from "../../webclients/subscription/SubscriptionClient.ts";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Typography
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Performance } from '../../webclients/performance/Performance.ts';
import { Place } from '../../webclients/place/Place.ts';
import { Subscription } from '../../webclients/subscription/Subscription.ts';
import { FilterSubscriptionCriteria } from '../../webclients/subscription/FilterSubscriptionCriteria.ts';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SubscriptionsPage() {
    const buySubscriptionRequestClient = BuySubscriptionRequestClient.getInstance();

    const [performances, setPerformances] = useState<Performance[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPerformance, setSelectedPerformance] = useState<Performance | undefined>(undefined);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
    const [purchasedTickets, setPurchasedTickets] = useState<{ performance: Performance, place: Place }[]>([]);
    const [editingSubscriptionIndex, setEditingSubscriptionIndex] = useState<number | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchData = async (): Promise<Subscription[]> => {
        try {
            const data = await SubscriptionClient.getInstance().getAllSubscriptions();
            if (data) {
                setSubscriptions(data);
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
        setEditingSubscriptionIndex(index);
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

    const handleDeleteSubscription = async (subscriptionId: number) => {
        try {
            const deleted = await buySubscriptionRequestClient.deleteData("subscriptions", subscriptionId);
            if (deleted) {
                setSubscriptions(subscriptions.filter(subscription => subscription.id !== subscriptionId));
                setEditingSubscriptionIndex(null);
            }
        } catch (error) {
            console.error('Error deleting subscription:', error);
            setErrorMessage('Ошибка при удалении абонемента.');
        }
    };

    const handleAddTicket = () => {
        if (selectedPerformance && selectedPlace) {
            setPurchasedTickets([...purchasedTickets, { performance: selectedPerformance, place: selectedPlace }]);
            setPerformances(performances.filter(performance => performance.id !== selectedPerformance.id));
            setSelectedPerformance(undefined);
            setSelectedPlace(undefined);
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

    const handleBuySubscription = async () => {
        const request: BuySubscriptionRequest = {
            performanceIds: purchasedTickets.map(item => item.performance.id),
            placeIds: purchasedTickets.map(item => item.place.id),
        };
        try {
            await BuySubscriptionRequestClient.getInstance().buySubscription(request);
            await fetchData();
            setPurchasedTickets([]);
        } catch (error) {
            console.error('Error buying subscription:', error);
            setErrorMessage('Ошибка при покупке абонемента.');
        }
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
            <td style={{ textAlign: "center" }}>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteSubscription(subscription.id)}>
                    Удалить абонемент
                </Button>
            </td>
        </tr>
    );

    return (
        <div>
            <Typography variant="h4">Уже купленные абонементы</Typography>
            <FilteredTable<Subscription, FilterSubscriptionCriteria>
                fetchData={fetchData}
                renderRow={renderRow}
                FilterComponent={undefined}
                tableHeaders={["ID", "Цена", "Удаление"]}
                tableData={subscriptions}
                filterInitialState={{}}
            />
            <hr />
            <Typography variant="h4">Покупка абонемента</Typography>
            <Box display="flex" flexDirection="column" mt={2}>
                {purchasedTickets.map((item, index) => (
                    <Typography key={index} mb={1}>
                        Билет на спектакль: {item.performance.playTitle}. Дата: с {item.performance.startTime} по {item.performance.endTime}. Место: {item.place.id} ({item.place.priceCoefficient * item.performance.basePrice} руб.)
                    </Typography>
                ))}
            </Box>
            <Box display="flex" alignItems="center">
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
                                {performance.playTitle} (с {performance.startTime} по {performance.endTime})
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
                                <em>--Выберите место в зале--</em>
                            </MenuItem>
                            {places.map(place => (
                                <MenuItem key={place.id} value={place.id}>
                                    Место {place.id}. Цена: {place.priceCoefficient * selectedPerformance.basePrice} руб.
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
            {selectedPlace && (
                <Button variant="contained" color="primary" onClick={handleAddTicket}>
                    Добавить билет в абонемент
                </Button>
            )}
            {purchasedTickets.length > 0 && (
                <Button variant="contained" color="primary" onClick={handleBuySubscription}>
                    Купить абонемент
                </Button>
            )}
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
                <Alert onClose={() => setErrorMessage(null)} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SubscriptionsPage;
