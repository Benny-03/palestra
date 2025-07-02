import { useState } from "react";
import { useAuth } from "../../state";
import Header from "./Header";
import { addClient, getClient, updateCampoArray } from "../../Firebase";
import { useNavigate } from "react-router";
import PianoSettimanale from "./cliente/PianoSettimanale";

function HomePage() {
    const { user, personal, isClient, clienti, setClienti} = useAuth();
    const navigate = useNavigate();
    const [flagNewClient, setFlagNewClient] = useState(false);
    const [isPresent, setIsPresent] = useState(false);
    const [newClient, setNewClient] = useState({
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: '',
        difficoltà: ''
    });

    const flagClient = () => {
        setFlagNewClient(!flagNewClient);
    }

    const togglePresent = () => {
        setIsPresent(!isPresent);
    }

    const registration = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(clienti)

        try {
            const data = await getClient(newClient.id);
            if(data) {
                togglePresent();
                return;
            }
            await addClient(newClient.id, newClient.nome, newClient.cognome, newClient.data_nascita, newClient.username, newClient.difficoltà, personal?.id);
            await updateCampoArray(personal?.id, "personal-trainer", "clienti", newClient.id);

            const update = clienti;
            update.push(newClient);
            setClienti(update);
            
            setFlagNewClient(false);
            console.log("Cliente registrato con successo");
        }catch (error) {
            togglePresent();
        }
    }

    return (
        <div className="homepage">
            { !isClient && (
                <Header page="clienti"/>
            )}
            { isClient && (
                <Header page="piano"/>
            )}
            { isClient && (
                <PianoSettimanale id={user.id}/>
            )}
            { !isClient && clienti.length > 0 &&(
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '3%'}}>
                        <button className="add-client" onClick={flagClient}>Aggiungi Cliente</button>
                    </div>
                    <div className="box-clienti">
                        {clienti.map(cliente => (
                            <button className='btn-cliente' key={cliente.id} onClick={() => navigate(`/fitness/cliente/${encodeURIComponent(cliente.id)}`)}>
                                <div key={cliente.id} className="card-clienti">
                                    <h2>{cliente.nome} {cliente.cognome}</h2>
                                    <p><strong>Username:</strong> {cliente.username}</p>
                                    <p><strong>Data di nascita:</strong> {cliente.data_nascita}</p>
                                    <p><strong>Email:</strong> {cliente.id}</p>
                                    <p><strong>Difficoltà:</strong> {cliente.difficoltà}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            { !isClient && clienti.length == 0 &&(
                <div className="box-clienti">
                    <p>Non hai ancora clienti assegnati.</p>
                </div>
            )}
            { flagNewClient && (
                <div className='box-popup'>
                    <div className='popup'>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button className="btn-close" onClick={flagClient}><span className="close">&times;</span></button>
                        </div>
                        <h1 style={{textAlign: "center"}}>Aggiungi un nuovo Cliente</h1>
                        <form onSubmit={registration}>
                            <div className="form-popup">
                                <label htmlFor="Nome">
                                    <input placeholder="Nome" type="text" id="Nome" required onChange={(e) => setNewClient(prev => ({ ...prev, nome: e.target.value }))} />
                                </label>
                                <label htmlFor="Cognome">
                                    <input placeholder="Cognome" type="text" id="Cognome" required onChange={(e) => setNewClient(prev => ({ ...prev, cognome: e.target.value }))} />
                                </label>
                                <label htmlFor="data">
                                    <input placeholder="Data di nascita" type="date" id="data" required onChange={(e) => setNewClient(prev => ({ ...prev, data: e.target.value }))} />
                                </label>
                                <label htmlFor="username">
                                    <input placeholder="Username" type="text" id="username" required onChange={(e) => setNewClient(prev => ({ ...prev, username: e.target.value }))} />
                                </label>
                                <label htmlFor="email">
                                    <input placeholder="Email" type="email" id="email" required onChange={(e) => setNewClient(prev => ({ ...prev, id: e.target.value }))} />
                                </label>
                                <label htmlFor="difficoltà">
                                    <select id="difficoltà" required onChange={(e) => setNewClient(prev => ({ ...prev, difficoltà: e.target.value }))}>
                                        <option value="" disabled selected>Seleziona la difficoltà</option>
                                        <option value="Facile">Facile</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Avanzato">Avanzato</option>
                                    </select>
                                </label>
                            </div>
                            <button type="submit">Registra</button>
                        </form>
                    </div>
                </div>
            )}
            {isPresent && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{textAlign: "center"}}>Email già presente</h1>
                        <button onClick={togglePresent}>Chiudi</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage;