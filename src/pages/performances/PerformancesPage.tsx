import '../../App.css'
import {constructPerformanceQuery, FilterPerformanceCriteria, Performance} from '../../webclient/Performance.ts'
import {useEffect, useState} from "react";
import Filter from "./FilterPerformancesForm.tsx";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {DatePicker} from "antd";

function PerformancesPage() {
    const handleFilterChange = (filters: FilterPerformanceCriteria) => {
        setCurrentRequest(constructPerformanceQuery(
            filters.repertoireId,
            filters.isPremiere,
            filters.genreId,
            filters.dateOfStart,
            filters.dateOfEnd,
            filters.authorId,
            filters.authorCountryId,
            filters.centuryOfPlayWriting))
    };
    const [currentRequest, setCurrentRequest] = useState('http://localhost:8080/performances/filter');
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [editingPerformanceIndex, setEditingPerformanceIndex] = useState<number | null>(null);
    const [editedPerformance, setEditedPerformance] = useState<Performance | null>(null);


    const toggleEditMode = (index: number) => {
        setEditingPerformanceIndex(index);
        setEditedPerformance({...performances[index]});
    };


    const handleUpdatePerformance = async () => {
        try {
            if (editedPerformance) {
                await axios.put(`http://localhost:8080/performances/${editedPerformance.id}`, editedPerformance);
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

    const handleDeletePerformance = async (employeeId: number) => {
        try {
            await axios.delete(`http://localhost:8080/employees/${employeeId}`);
            setPerformances(performances.filter(employee => employee.id !== employeeId));
            setEditingPerformanceIndex(null);
            setEditedPerformance(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };


    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await fetch(currentRequest);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPerformances(data);
                console.log(performances)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchPerformances();
    }, [currentRequest]);

    return (
        <div className="table-and-filter-container">
            <Filter onFilterChange={handleFilterChange}/>
            <div className="table-container">
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Название пьесы</th>
                        <th>Жанр</th>
                        <th>Век написания пьесы</th>
                        <th>Имя автора</th>
                        <th>Фамилия автора</th>
                        <th>Дата показа</th>
                        <th>Зал</th>
                        <th>Возрастная категория</th>
                        <th>Базовая стоимость билета</th>
                        <th>Премьера</th>
                    </tr>
                    </thead>
                    <tbody>
                    {performances.map((performance, index) => (
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
                                <DatePicker selected={editedPerformance?.date}
                                            onChange={(date: Date) => setEditedPerformance({
                                                ...editedPerformance!,
                                                date: date.toISOString()
                                            })}/>
                            ) : performance.date}</td>
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PerformancesPage
