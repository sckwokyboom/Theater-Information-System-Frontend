import '../../App.css'
import {useState} from "react";
import FilteredTable from "../FilteredTable.tsx";
import {CastingClient} from "../../webclients/casting/CastingClient.ts";
import {FilterCastingCriteria} from "../../webclients/casting/FilterCastingCriteria.ts";
import {Casting} from "../../webclients/casting/Casting.ts";
import FilterCastingsForm from "./FilterCastingsForm.tsx";

function CastingsPage() {
    const castingClient = new CastingClient()
    const fetchData = async (filters: FilterCastingCriteria): Promise<Casting[]> => {
        try {
            const data = await castingClient.fetchData("castings/filter", filters)
            if (data) {
                setCastings(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }
    const [castings, setCastings] = useState<Casting[]>([]);
    const [editingCastingIndex, setEditingCastingIndex] = useState<number | null>(null);
    const [, setEditedCasting] = useState<Casting | null>(null);

    const toggleEditMode = (index: number) => {
        setEditingCastingIndex(index);
        setEditedCasting(castings[index]);
    };
    //
    // const handleUpdateCasting = async () => {
    //     try {
    //         if (editedCasting) {
    //             const updatedEmployee = await castingClient.updateData("castings", editedCasting.id, editedCasting)
    //             if (updatedEmployee) {
    //                 const updatedCastings = [...castings];
    //                 updatedCastings[editingCastingIndex!] = editedCasting;
    //                 setCastings(updatedCastings);
    //                 setEditingCastingIndex(null);
    //                 setEditedCasting(null);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error updating employee:', error);
    //     }
    // };
    //
    // const handleDeleteCasting = async (castingId: number) => {
    //     try {
    //         const deleted = await castingClient.deleteData("castings", castingId)
    //         if (deleted) {
    //             setCastings(castings.filter(casting => casting.id !== castingId));
    //             setEditingCastingIndex(null);
    //             setEditedCasting(null);
    //         }
    //     } catch (error) {
    //         console.error('Error deleting employee:', error);
    //     }
    // };

    const renderRow = (casting: Casting, index: number) => (
        <tr key={casting.actorId}
            onClick={() => {
                if (index !== editingCastingIndex) {
                    toggleEditMode(index);
                }
            }}>
            <td>{casting.actorId}</td>
            <td>{casting.actorFirstName}</td>
            <td>{casting.actorSecondName}</td>
            <td>{casting.playTitle}</td>
            <td>{casting.performanceDate}</td>
            <td>{casting.performanceId}</td>
            <td>{casting.doubleId}</td>
            <td>{casting.roleId}</td>
            <td>{casting.roleName}</td>
            <td>{casting.roleDescription}</td>
        </tr>
    );


    return (
        <div>
            <h1>Кастинги</h1>
            <FilteredTable<Casting, FilterCastingCriteria>
                fetchData={fetchData}
                renderRow={renderRow}
                FilterComponent={FilterCastingsForm}
                tableHeaders={["ID актёра", "Имя актёра", "Фамилия актёра", "Название пьесы", "Дата спектакля", "ID спектакля", "ID дублёра", "ID роли", "Название роли", "Описание роли"]}
                tableData={castings}
                filterInitialState={{
                    actorId: undefined,
                    dateOfStart: undefined,
                    dateOfEnd: undefined,
                    playGenreId: undefined,
                    productionDirectorId: undefined,
                    ageCategory: undefined
                }}
            />
            <hr/>
            <label>
                <b>Количество:</b> {castings.length}.
            </label>
        </div>
    )
}

export default CastingsPage
