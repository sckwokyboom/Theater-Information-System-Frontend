import '../../styles/App.css'
import {useState} from "react";
import {Place} from "../../webclients/place/Place.ts";
import {PlaceClient} from "../../webclients/place/PlaceClient.ts";
import FilteredTable from "../FilteredTable.tsx";
import {FilterPlaceCriteria} from "../../webclients/place/FilterPlaceCriteria.ts";
import FilterFreePlacesForm from "./FilterFreePlacesForm.tsx";

function FreePlacesPage() {

    const [places, setPlaces] = useState<Place[]>([]);


    const fetchData = async (filters: FilterPlaceCriteria): Promise<Place[]> => {
        try {
            const data = await PlaceClient.getInstance().fetchData("places/filter", filters)
            if (data) {
                setPlaces(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    function hashPair(a: number, b: number): number {
        const prime = 31;
        let hash = a;
        hash = hash * prime + b;
        return hash;
    }

    const renderRow = (place: Place) => (
        <tr key={hashPair(place.id, place.performanceId)}>
            <td>{place.id}</td>
            <td>{place.hallTitle}</td>
            <td>{place.priceCoefficient}</td>
            <td>{place.performanceId}</td>
        </tr>
    );

    return (
        <div>
            <label>
                <h1>Свободные места</h1>
                <FilteredTable<Place, FilterPlaceCriteria>
                    fetchData={fetchData}
                    renderRow={renderRow}
                    FilterComponent={FilterFreePlacesForm}
                    tableHeaders={["ID", "Название зала", "Коэффициент", "ID спектакля"]}
                    tableData={places}
                    filterInitialState={{
                        performanceId: undefined,
                        isPremiere: undefined,
                        isUpcomingPerformances: undefined
                    }}
                />
            </label>
        </div>
    )
}

export default FreePlacesPage
