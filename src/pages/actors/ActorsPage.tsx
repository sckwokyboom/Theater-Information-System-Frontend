import '../../styles/App.css'
import {useState} from "react";
import FilteredTable from "../FilteredTable.tsx";
import FilterActorsForm from "./FilterActorsForm.tsx";
import {ActorClient} from "../../webclients/actor/ActorClient.ts";
import {FilterActorCriteria} from "../../webclients/actor/FilterActorCriteria.ts";
import {Actor} from "../../webclients/actor/Actor.ts";

function ActorsPage() {
    const actorsClient = ActorClient.getInstance()
    const fetchData = async (filters: FilterActorCriteria): Promise<Actor[]> => {
        try {
            const data = await actorsClient.fetchData("actors/filter", filters)
            if (data) {
                setActors(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }
    const [actors, setActors] = useState<Actor[]>([]);

    const renderRow = (actor: Actor) => (
        <tr key={actor.id}>
            <td>{actor.id}</td>
            <td>{actor.firstName}</td>
            <td>{actor.secondName}</td>
            <td>{actor.patronymic}</td>
            <td>{actor.voiceType}</td>
            <td>{actor.weight}</td>
            <td>{actor.height}</td>
            <td>{actor.skinColor}</td>
            <td>{actor.hairColor}</td>
            <td>{actor.eyeColor}</td>
            <td>{actor.nationalityName}</td>

        </tr>
    );


    return (
        <div>
            <h1>Актёры</h1>
            <FilteredTable<Actor, FilterActorCriteria>
                fetchData={fetchData}
                renderRow={renderRow}
                FilterComponent={FilterActorsForm}
                tableHeaders={["ID", "Имя", "Фамилия", "Отчество", "Тип голоса", "Вес", "Рост", "Цвет кожи", "Цвет волос", "Цвет глаз", "Национальность"]}
                tableData={actors}
                filterInitialState={{
                    roleWeight: undefined,
                    roleHeight: undefined,
                    roleSkinColor: undefined,
                    roleHairColor: undefined,
                    roleVoiceType: undefined,
                    roleNationalityId: undefined,
                    titleId: undefined,
                    age: undefined,
                    gender: undefined,
                    dateOfStartForTitle: undefined,
                    dateOfEndForTitle: undefined
                }}
            />
            <hr/>
            <label>
                <b>Количество:</b> {actors.length}.
            </label>
        </div>
    )
}

export default ActorsPage
