import { useEffect, useState } from "react";
import { useAuth } from "../../../state";
import { getPianoSettimanale, hasPiano } from "../../../Firebase";

interface props {
    id: string;
}

function PianoSettimanale (props: props) {
    const { pianoEsiste, setPianoEsiste } = useAuth();
    const [piano, setPiano] = useState<{ 
        giorno: string; 
        esercizi: { 
            id: string;
            ripetizioni: string;
            pausa: string;
            n_volte: string;
        }[]
    }[]>([]);

    useEffect(() => {
        const checkPiano = async () => {
            const exists = await hasPiano(props.id);
            setPianoEsiste(exists);
        };
        checkPiano();

        const fetchData = async () => {
            const data = await getPianoSettimanale(props.id);
            setPiano(data);
        };
        fetchData();
    }, [props.id]);
    

    return (
        <div className="client">
            {pianoEsiste && (
            <div className="table">
                <table>
                    <thead>
                        <tr>
                        { piano.map((giorno) => (
                            <th key={giorno.giorno + 'title'} >{giorno.giorno}</th>
                        ))}
                        </tr>
                    </thead>        
                    <tbody>
                        <tr>
                            { piano.map((giorno) => (
                                <td key={giorno.giorno}>
                                    <ul>
                                        {giorno.esercizi.map((es) => (
                                            <li key={es.id}><strong>{es.id}:</strong><br></br>{es.ripetizioni}x{es.n_volte} con {es.pausa} di pausa</li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    </tbody>    
                </table>
            </div>
            )}
        </div>
    )
}

export default PianoSettimanale;