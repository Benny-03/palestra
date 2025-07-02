import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { deleteEsPiano, getClient, getPianoSettimanale, hasPiano, modifyEsPiano } from "../../../../Firebase";
import arrowLeft from "../../../../svg/arrow_left.svg";
import trash from "../../../../svg/trash.svg";
import pencil from '../../../../svg/pencil.svg';
import DeleteSingleClient from "./DeleteSingleClient";
import ModifyClient from "./ModifyClient";
import AddPiano from "./AddPiano";
import { useAuth } from "../../../../state";
import DeletePiano from "./DeletePiano";
import AddEsercizi from "./AddEsercizi";

function SingleClient() {
    const { id } = useParams();
    const { pianoEsiste, setPianoEsiste } = useAuth();

    if (!id) {
        return <div>Caricamento...</div>;
    }
    
    const decodedId = decodeURIComponent(id);
    const [cliente, setCliente] = useState<any>(null);
    const [piano, setPiano] = useState<{ 
        giorno: string; 
        esercizi: { 
            id: string;
            ripetizioni: string;
            pausa: string;
            n_volte: string;
        }[] }[]>([]);
    const [newEs, setNewEs] = useState({
        nome: '',
        ripetizioni: '',
        n_volte: '',
        pausa: ''
    })
    const [selectedForDelete, setSelectedForDelete] = useState<string | null>(null);
    const [selectedForModify, setSelectedForModify] = useState<string | null>(null);

    useEffect(() => {
        const fetchCliente = async () => {
            if (decodedId) {
                const data = await getClient(decodedId);
                setCliente(data);
            }
        };
        fetchCliente();

        const checkPiano = async () => {
            const exists = await hasPiano(decodedId);
            setPianoEsiste(exists);
        };
        checkPiano();

        const fetchData = async () => {
            const data = await getPianoSettimanale(decodedId);
            setPiano(data);
        };
        fetchData();
    }, [decodedId]);

    if (!cliente) {
        return <div>Caricamento...</div>;
    }

    const deleteEs = async (id: string, giorno: string) => {
        await deleteEsPiano(decodedId, giorno, id.toLowerCase());
        setPiano((prev) => 
            prev.map((g) =>
                g.giorno === giorno ? {...g, esercizi: g.esercizi.filter((es) => es.id !== id)} : g
            )
        );
    }

    const modifyEs = async (id: string, giorno: string, ripetizioni: string, pausa: string, n_volte: string) => {
        const es = {
            ripetizioni: newEs.ripetizioni || ripetizioni,
            n_volte: newEs.n_volte || n_volte,
            pausa: newEs.pausa || pausa
        }
        await modifyEsPiano(decodedId, giorno, id.toLowerCase(), { ripetizioni: es.ripetizioni, n_volte: es.n_volte, pausa: es.pausa});
        setPiano((prevPiano) =>
            prevPiano.map((g) =>
                g.giorno === giorno
                    ? {
                        ...g,
                        esercizi: g.esercizi.map((e) => e.id === id ? { ...e, ...es } : e )
                    } : g
            )
        );
        setNewEs({ nome: '', ripetizioni: '', n_volte: '', pausa: ''});
    }

    return (
        <>
            <div className="single-client">
                <div className="back-button">
                    <a href="/fitness/home" className="back-link">
                        <img src={arrowLeft} className="indietro" alt="Indietro" />
                    </a>
                </div>
                <div className="cliente-dettagli">
                    <h1>{cliente.nome} {cliente.cognome}</h1>
                    <div className="cliente-info">
                        <p><strong>Username:</strong> {cliente.username}</p>
                        <p><strong>Email:</strong> {cliente.id}</p>
                        <p><strong>Data di nascita:</strong> {cliente.data_nascita}</p>
                        <p><strong>Difficoltà:</strong> {cliente.difficoltà}</p>
                    </div>
                    { pianoEsiste && (
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
                                                    <li key={es.id}><strong>{es.id}:</strong><br></br>{es.ripetizioni}x{es.n_volte} con {es.pausa} di pausa
                                                        <div style={{display: 'flex', gap: '10px', paddingTop: '10px'}}>
                                                            <button className='btn-delete' onClick={() => setSelectedForDelete(es.id)}>
                                                                <img src={trash} />
                                                            </button>
                                                            {selectedForDelete === es.id && (
                                                                <div className="box-popup">
                                                                    <div className="popup">
                                                                        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                                                                            <button className="btn-close" onClick={() => setSelectedForDelete(null)}>
                                                                                <span className="close">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <h1 style={{ textAlign: "center" }}>Confermi eliminazione esercizio {es.id}?</h1>
                                                                        <button onClick={() => {
                                                                            deleteEs(es.id, giorno.giorno);
                                                                            setSelectedForDelete(null);
                                                                        }}>Conferma</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <button className="btn-modify" onClick={() => setSelectedForModify(es.id)}>
                                                                <img src={pencil} />
                                                            </button>
                                                            {selectedForModify === es.id && (
                                                                <div className="box-popup">
                                                                    <div className="popup">
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                                            <button className="btn-close" onClick={() => setSelectedForModify(null)}><span className="close">&times;</span></button>
                                                                        </div>
                                                                        <h1 style={{ textAlign: "center" }}>Modifica esercizio {es.id}</h1>
                                                                        <form onSubmit={(e) => {
                                                                            e.preventDefault(); 
                                                                            modifyEs(es.id, giorno.giorno, es.ripetizioni, es.pausa, es.n_volte); 
                                                                            setSelectedForModify(null);
                                                                        }}>
                                                                            <label htmlFor="serie">Serie:
                                                                                <input type="text" id="serie" placeholder={es.ripetizioni} onChange={(e) => setNewEs({...newEs, ripetizioni: e.target.value}) }/>
                                                                            </label>
                                                                            <label htmlFor="ripetizioni">Ripetizioni:
                                                                                <input type="text" id="ripetizioni" placeholder={es.n_volte} onChange={(e) => setNewEs({...newEs, n_volte: e.target.value}) }/>
                                                                            </label>
                                                                            <label htmlFor="pausa">Pausa:
                                                                                <input type="text" id="pausa" placeholder={es.pausa} onChange={(e) => setNewEs({...newEs, pausa: e.target.value}) }/>
                                                                            </label>
                                                                            <button type="submit">Salva</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>    
                        </table>
                    </div>
                    )}
                    <div className="box-btn">
                        <ModifyClient   id={decodedId} 
                                        nome={cliente.nome} 
                                        cognome={cliente.cognome} 
                                        difficoltà={cliente.difficoltà} 
                                        username={cliente.username} 
                                        data={cliente.data_nascita}
                        />
                        <DeleteSingleClient id={decodedId} />
                        <AddPiano id={decodedId} />
                        <DeletePiano id={decodedId} />
                        <AddEsercizi 
                            difficoltà={cliente.difficoltà} 
                            id={decodedId} 
                            piano={piano.map(giorno => ({
                                ...giorno,
                                esercizi: giorno.esercizi.map(es => ({
                                    ...es,
                                    n_volte: es.n_volte
                                }))
                            }))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SingleClient;