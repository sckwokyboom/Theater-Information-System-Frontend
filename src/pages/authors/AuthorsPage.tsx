import '../../App.css'
import React, {useEffect, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Author} from "../../webclients/author/Author.ts";
import {AuthorClient} from "../../webclients/author/AuthorClient.ts";
import {FilterAuthorCriteria} from "../../webclients/author/FilterAuthorCriteria.ts";
import FilteredTable from "../FilteredTable.tsx";
import FilterAuthorsForm from "./FilterAuthorsForm.tsx";
import {Country} from "../../webclients/country/Country.ts";
import {CountryClient} from "../../webclients/country/CountryClient.ts";
import {Genre} from "../../webclients/genre/Genre.ts";


function AuthorsPage() {
    const authorClient = new AuthorClient()
    const fetchData = async (filters: FilterAuthorCriteria): Promise<Author[]> => {
        try {
            const data = await authorClient.fetchData("authors/filter", filters)
            if (data) {
                setAuthors(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }
    const [authors, setAuthors] = useState<Author[]>([]);
    const [editingAuthorIndex, setEditingAuthorIndex] = useState<number | null>(null);
    const [editedAuthor, setEditedAuthor] = useState<Author | null>(null);
    const [countriesOptions, setCountriesOptions] = useState<Country[]>([])

    const toggleEditMode = (index: number) => {
        setEditingAuthorIndex(index);
        setEditedAuthor({...authors[index]});
    };

    const handleUpdateEmployee = async () => {
        try {
            if (editedAuthor) {
                const updatedAuthor = await authorClient.updateData("authors", editedAuthor.id, editedAuthor)
                if (updatedAuthor) {
                    const updatedAuthors = [...authors];
                    updatedAuthors[editingAuthorIndex!] = editedAuthor;
                    setAuthors(updatedAuthors);
                    setEditingAuthorIndex(null);
                    setEditedAuthor(null);
                }
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteAuthor = async (authorId: number) => {
        try {
            const deleted = await authorClient.deleteData("authors", authorId)
            if (deleted) {
                setAuthors(authors.filter(author => author.id !== authorId));
                setEditingAuthorIndex(null);
                setEditedAuthor(null);
            }
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    };

    useEffect(() => {
        const fetchCountriesOptions = async () => {
            const countriesClient = CountryClient.getInstance()
            try {
                const countries = await countriesClient.fetchAllCountries()
                if (countries) {
                    setCountriesOptions(countries);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchCountriesOptions().then()
    }, []);

    const renderRow = (author: Author, index: number) => (
        <tr key={author.id}
            onClick={() => {
                if (index !== editingAuthorIndex) {
                    toggleEditMode(index);
                }
            }}>
            <td>{author.id}</td>
            <td>{editingAuthorIndex === index ? (
                <input type="text"
                       value={editedAuthor?.firstName || ""}
                       onChange={(e) => setEditedAuthor({
                           ...editedAuthor!,
                           firstName: e.target.value
                       })}/>
            ) : author.firstName}</td>

            <td>{editingAuthorIndex === index ? (
                <input type="text" value={editedAuthor?.secondName || ""}
                       onChange={(e) => setEditedAuthor({
                           ...editedAuthor!,
                           secondName: e.target.value
                       })}/>
            ) : author.secondName}</td>

            <td>{editingAuthorIndex === index ? (
                <input type="text" value={editedAuthor?.patronymic || ""}
                       onChange={(e) => setEditedAuthor({
                           ...editedAuthor!,
                           patronymic: e.target.value
                       })}/>
            ) : author.patronymic}</td>


            <td>{editingAuthorIndex === index ? (
                <DatePicker selected={editedAuthor?.dateOfBirth}
                            onChange={(date: Date) => setEditedAuthor({
                                ...editedAuthor!,
                                dateOfBirth: date.toISOString()
                            })}/>
            ) : author.dateOfBirth}</td>

            <td>{editingAuthorIndex === index ? (
                <DatePicker selected={editedAuthor?.dateOfDeath}
                            onChange={(date: Date) => setEditedAuthor({
                                ...editedAuthor!,
                                dateOfDeath: date.toISOString()
                            })}/>
            ) : author.dateOfDeath}</td>

            <td>{editingAuthorIndex === index ? (
                <select
                    name="countryOfOriginName"
                    value={author.countryOfOriginName}
                    onChange={(event) => {
                        setEditedAuthor({
                            ...editedAuthor!,
                            countryOfOriginName: event.target.value
                        })
                    }}
                    className="form-input">
                    {countriesOptions.map(country => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            ) : author.countryOfOriginName}</td>

            {editingAuthorIndex === index && (
                <td>
                    <button onClick={handleUpdateEmployee}>Save Changes</button>
                </td>
            )}
            {editingAuthorIndex === index && (
                <td>
                    <button onClick={() => handleDeleteAuthor(author.id)}>Delete employee
                    </button>
                </td>
            )}
        </tr>
    );

    return (
        <FilteredTable<Author, FilterAuthorCriteria>
            fetchData={fetchData}
            filterInitialState={{
                wasPerformed: undefined,
                centuryOfLiving: undefined,
                countryOfOriginId: undefined,
                genreId: undefined,
                dateOfStartPerformanceAuthorsPlays: undefined,
                dateOfEndPerformanceAuthorsPlays: undefined
            }}
            renderRow={renderRow}
            FilterComponent={FilterAuthorsForm}
            tableHeaders={["ID", "Имя", "Фамилия", "Отчество", "Дата рождения", "Дата смерти", "Страна происхождения"]}
            tableData={authors}
        />
    )
}

export default AuthorsPage
