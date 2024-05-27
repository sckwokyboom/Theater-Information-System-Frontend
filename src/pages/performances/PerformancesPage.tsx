import '../../App.css'
import {Performance} from '../../webclients/performance/Performance.ts'
import {useState} from "react";
import {PerformanceClient} from "../../webclients/performance/PerformanceClient.ts";
import {FilterPerformanceCriteria} from "../../webclients/performance/FilterPerformanceCriteria.ts";
import FilteredTable from "../FilteredTable.tsx";
import FilterPerformancesForm from "./FilterPerformancesForm.tsx";
import {DatePicker} from "antd";
import {formatDate} from "../../utils/Date.ts";

function PerformancesPage() {
    const performanceClient = PerformanceClient.getInstance()
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [editingPerformanceIndex, setEditingPerformanceIndex] = useState<number | null>(null);
    const [editedPerformance, setEditedPerformance] = useState<Performance | null>(null);

    const fetchData = async (filters: FilterPerformanceCriteria): Promise<Performance[]> => {
        try {
            const data = await performanceClient.fetchData("performances/filter", filters)
            if (data) {
                setPerformances(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    const toggleEditMode = (index: number) => {
        setEditingPerformanceIndex(index);
        // setEditedPerformance({...performances[index]});
    };


    const handleUpdatePerformance = async () => {
        try {
            if (editedPerformance) {
                performanceClient.createData("performances", editedPerformance).then()
                const updatedEmployees = [...performances];
                updatedEmployees[editingPerformanceIndex!] = editedPerformance;
                setPerformances(updatedEmployees);
                setEditingPerformanceIndex(null);
                setEditedPerformance(null);
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeletePerformance = async (performanceId: number) => {
        try {
            performanceClient.deleteData("performances", performanceId).then()
            setPerformances(performances.filter(employee => employee.id !== performanceId));
            setEditingPerformanceIndex(null);
            setEditedPerformance(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const renderRow = (performance: Performance, index: number) => (
        <tr key={performance.id}
            onClick={() => {
                if (index != editingPerformanceIndex) {
                    toggleEditMode(index)
                }
            }}>
            <td>{performance.id}</td>
            <td>{performance.playTitle}</td>
            <td>{performance.playGenre}</td>
            <td>{performance.centuryOfPlayWriting}</td>
            <td>{performance.authorFirstName}</td>
            <td>{performance.authorSecondName}</td>
            <td>{editingPerformanceIndex === index ? (
                <DatePicker
                    allowClear={true}
                    name={"startTime"}
                    value={editedPerformance?.startTime}
                    onChange={(date: string) => setEditedPerformance({
                        ...editedPerformance!,
                        endTime: formatDate(new Date(date))
                    })}/>
            ) : performance.startTime}</td>
            <td>{performance.hallTitle}</td>
            <td>{editingPerformanceIndex === index ? (
                <select value={editedPerformance?.ageCategory || ""}
                        onChange={(e) => setEditedPerformance({
                            ...editedPerformance!,
                            ageCategory: e.target.value
                        })}>
                    <option value="0+">Male</option>
                    <option value="6+">Male</option>
                    <option value="12+">Male</option>
                    <option value="16+">Male</option>
                    <option value="18+">Male</option>
                </select>
            ) : performance.ageCategory}</td>

            <td>{editingPerformanceIndex === index ? (
                <input type="number" value={editedPerformance?.basePrice || 0}
                       onChange={(e) => setEditedPerformance({
                           ...editedPerformance!,
                           basePrice: parseInt(e.target.value)
                       })}/>
            ) : performance.basePrice}</td>

            <td>{editingPerformanceIndex === index ? (
                <input type="string" value={editedPerformance?.isPremiere == true ? "Да" : ""}
                       onChange={(e) => setEditedPerformance({
                           ...editedPerformance!,
                           isPremiere: e.target.value == "true"
                       })}/>
            ) : performance.isPremiere}</td>

            {editingPerformanceIndex === index && (
                <td>
                    <button onClick={handleUpdatePerformance}>Save Changes</button>
                </td>
            )}
            {editingPerformanceIndex === index && (
                <td>
                    <button onClick={() => handleDeletePerformance(performance.id)}>Delete employee
                    </button>
                </td>
            )}
        </tr>
    );

    return (
        <div>
            <h1>Спектакли</h1>
            <FilteredTable<Performance, FilterPerformanceCriteria>
                fetchData={fetchData}
                filterInitialState={{
                    repertoireId: undefined,
                    isPremiere: undefined,
                    genreId: undefined,
                    dateOfStart: undefined,
                    dateOfEnd: undefined,
                    authorId: undefined,
                    authorCountryId: undefined,
                    centuryOfPlayWriting: undefined,
                    isUpcoming: undefined
                }}
                renderRow={renderRow}
                FilterComponent={FilterPerformancesForm}
                tableHeaders={["ID", "Название пьесы", "Жанр", "Век написания пьесы", "Имя автора", "Фамилия автора", "Дата показа", "Зал", "Возрастная категория", "Базовая стоимость билета", "Премьера"]}
                tableData={performances}
            />
            <hr/>
            <label>
                <b>Количество:</b> {performances.length}.
            </label>
        </div>
    )
}

export default PerformancesPage
