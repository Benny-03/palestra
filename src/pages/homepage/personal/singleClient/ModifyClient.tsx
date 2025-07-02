import { useState } from "react";
import { useAuth } from "../../../../state";
import { updateClient } from "../../../../Firebase";

interface ModifyProps {
    id: string;
    nome: string,
    cognome: string,
    username: string,
    data: string,
    difficoltà: string
}

function ModifyClient (props: ModifyProps) {
    const { clienti, setClienti} = useAuth();
    const [popup, setPopup] = useState(false);
    const [ flagModify, setFlagModify] = useState(false);
    const [newInfo, setNewInfo] = useState({
        username: '',
        data_nascita: '',
        difficoltà: '',
        nome: '',
        cognome: ''
    })

    const Modify = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedClient = {
            nome: newInfo.nome || props.nome,
            cognome: newInfo.cognome || props.cognome,
            username: newInfo.username || props.username,
            data_nascita: newInfo.data_nascita || props.data,
            difficoltà: newInfo.difficoltà || props.difficoltà
        };
        await updateClient(props.id.toLowerCase(), updatedClient.nome, updatedClient.cognome, updatedClient.data_nascita, updatedClient.difficoltà, updatedClient.username);
        const up = clienti;
        up.map(c => {
            if(c.id == props.id){
                c.nome = updatedClient.nome;
                c.cognome = updatedClient.cognome;
                c.username = updatedClient.username;
                c.data_nascita = updatedClient.data_nascita;
                c.difficoltà = updatedClient.difficoltà;
            }
        })

        setClienti(up);
        setPopup(!popup);
        setFlagModify(true);
    }

    const toggle = () => {
        setFlagModify(false);
        window.location.reload();
    }
    
    return (
        <>
            <button onClick={() => setPopup(!popup)}>Modifica Informazioni</button>
            {popup && (
                <div className="box-popup">
                    <div className="popup">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button className="btn-close" onClick={() => setPopup(!popup)}><span className="close">&times;</span></button>
                        </div>
                        <h1 style={{ textAlign: "center" }}>Modifica Informazioni</h1>
                        <form onSubmit={Modify}>
                            <label htmlFor="nome">
                                <input type="text" id="nome" defaultValue={props.nome} onChange={(e) => setNewInfo({...newInfo, nome:e.target.value}) }/>
                            </label>
                            <label htmlFor="cognome">
                                <input type="text" id="cognome" defaultValue={props.cognome} onChange={(e) => setNewInfo({...newInfo, cognome:e.target.value}) }/>
                            </label>
                            <label htmlFor="data">
                                <input type="text" id="data" defaultValue={props.data} onChange={(e) => setNewInfo({...newInfo, data_nascita:e.target.value}) }/>
                            </label>
                            <label htmlFor="username">
                                <input type="text" id="username" defaultValue={props.username} onChange={(e) => setNewInfo({...newInfo, username:e.target.value}) }/>
                            </label>
                            <label htmlFor="difficoltà">
                                <select id="difficoltà" defaultValue={props.difficoltà} onChange={(e) => setNewInfo({...newInfo, difficoltà:e.target.value})}>
                                    <option value="" disabled>Seleziona la difficoltà</option>
                                    <option value="Facile">Facile</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzato">Avanzato</option>
                                </select>
                            </label>
                            <button type="submit">Salva</button>
                        </form>
                    </div>
                </div>
            )}
            {flagModify && (
                <div className="box-popup">
                    <div className="popup">
                        <h1 style={{ textAlign: "center" }}>Il cliente è stato modificato correttamente !</h1>
                        <button onClick={toggle}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModifyClient;