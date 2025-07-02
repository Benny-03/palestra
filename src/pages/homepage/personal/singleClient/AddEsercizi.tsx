import { useState } from "react";
import { useAuth } from "../../../../state";
import { addEsPiano } from "../../../../Firebase";

interface props {
    difficoltà: string;
    id: string;
    piano: { 
        giorno: string; 
        esercizi: { 
            id: string;
            ripetizioni: string;
            pausa: string;
            n_volte: string;
        }[] 
    }[]
}

function AddEsercizi (props: props) {
    const { esercizi, pianoEsiste } = useAuth();
    const [popup, setPopup] = useState(false);
    const [ flagAdd, setFlagAdd] = useState(false);
    const [newEs, setNewEs] = useState({
        id: '',
        ripetizioni: '',
        pausa: '',
        n_volte: ''
    })
    const [category, setCategory] = useState('');
    const [giorno, setGiorno] = useState('');

    const AddEs = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEsPiano(props.id, giorno, newEs.id.toLowerCase(), newEs.ripetizioni, newEs.n_volte, newEs.pausa);
        setPopup(false);
        setFlagAdd(true);
    }

    const toggle = () => {
        setFlagAdd(!flagAdd);
        window.location.reload();
    }
    
    return (
        <>
            <button className={!pianoEsiste ? 'disabled' : ''} onClick={() => setPopup(!popup)}>Aggiungi esercizio</button>
            {popup && (
                <div className="box-popup">
                    <div className="popup">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button className="btn-close" onClick={() => setPopup(!popup)}><span className="close">&times;</span></button>
                        </div>
                        <h1 style={{ textAlign: "center" }}>Aggiungi esercizio livello: {props.difficoltà}</h1>
                        <form onSubmit={AddEs}>
                            <label htmlFor="giorni">
                                <select id="giorni" required onChange={(e) => setGiorno(e.target.value)}>
                                    <option value="" disabled selected>Seleziona giorno</option>
                                    {props.piano.map((giorno) => (
                                        <option key={giorno.giorno} value={giorno.giorno}>{giorno.giorno}</option>
                                    ))}
                                </select>
                            </label>
                            <label htmlFor="catageoria">
                                <select id="categoria" required onChange={(e) => setCategory(e.target.value)}>
                                    <option value="" disabled selected>Seleziona categoria</option>
                                    <option value="gambe">Gambe</option>
                                    <option value="addome">Addome</option>
                                    <option value="braccia">Braccia</option>
                                    <option value="glutei">Glutei</option>
                                    <option value="schiena">Schiena</option>
                                </select>
                            </label>
                            { category && (
                                <>
                                    <label htmlFor="esercizi">
                                        <select id="esercizi" required onChange={(e) => setNewEs({...newEs, id: e.target.value})}>
                                            <option value="" disabled selected>Seleziona esercizio</option>
                                            {esercizi[category][props.difficoltà].map((es) => (
                                                <option key={es.nome} value={es.nome}>{es.nome}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label htmlFor="serie">Serie:
                                        <input type="text" id="serie" required onChange={(e) => setNewEs({...newEs, ripetizioni: e.target.value}) }/>
                                    </label>
                                    <label htmlFor="n_volte">Ripetizioni:
                                        <input type="text" id="n_volte" required onChange={(e) => setNewEs({...newEs, n_volte: e.target.value}) }/>
                                    </label>
                                    <label htmlFor="pausa">Pausa:
                                        <input type="text" id="pausa" required onChange={(e) => setNewEs({...newEs, pausa: e.target.value}) }/>
                                    </label>
                                </>
                            )}
                            <button type="submit">Aggiungi</button>
                        </form>
                    </div>
                </div>
            )}
            {flagAdd && (
                <div className="box-popup">
                    <div className="popup">
                        <h1 style={{ textAlign: "center" }}>Il piano è stato modificato correttamente!</h1>
                        <button onClick={toggle}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddEsercizi;