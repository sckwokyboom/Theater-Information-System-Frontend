import '../../styles/App.css'
import {useEffect, useState} from "react";

class Play {
    id: number;
    title: string;
    genreTitle: string;
    century: number;

    constructor(id: number, title: string, genreTitle: string, century: number) {
        this.id = id;
        this.title = title;
        this.genreTitle = genreTitle;
        this.century = century;
    }
}

function PlaysPage() {
    const [plays, setPlays] = useState<Play[]>([]);
    useEffect(() => {
        const fetchPlays = async () => {
            try {
                const response = await fetch('http://localhost:8080/plays');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlays(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchPlays();
    }, []);
    return (
        <>
            <h1>Пьесы</h1>
            <table className="table">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Жанр</th>
                    <th>Век</th>
                </tr>
                </thead>
                <tbody>
                {plays.map(play => (
                    <tr key={play.id}>
                        <td>{play.id}</td>
                        <td>{play.title}</td>
                        <td>{play.genreTitle}</td>
                        <td>{play.century}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default PlaysPage
