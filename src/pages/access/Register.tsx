import { useNavigate } from "react-router";
import { addPersonal, createUser, isFirebaseError, signInUser} from "../../Firebase";
import { useAuth } from "../../state";
import { useState } from "react";
import image from '../../images/sfondo.jpeg';
import logo from '../../images/logo.png';

function Register() {
    const navigate = useNavigate();
    const { message, setMessage} = useAuth();
    const [password, setPassword] = useState('');
    const [isPresent, setIsPresent] = useState(false);
    const [flagPassword, setFlagPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [utente, setUtente] = useState({
        nome: '',
        cognome: '',
        data: '',
        username: '',
        id: '',
        personal: ''
    })

    const togglePresent = () => {
        setIsPresent(!isPresent);
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if( !isClient) {
                await createUser(utente.id, password);
                console.log('sono un personal trainer');
                await addPersonal(utente.id, utente.nome, utente.cognome, utente.data, utente.username, '');
                await signInUser(utente.id, password);
            }
            if (isClient) {
                console.log('sono un cliente');
                await signInUser(utente.id, password);
            } 
            navigate('/fitness/home');
        } catch (error) {
            if (isFirebaseError(error)) {
                if (error.code === 'auth/email-already-in-use') {
                    setIsPresent(true);
                    const u = {
                        nome: '',
                        cognome: '',
                        data: '',
                        username: '',
                        id: '',
                        isClient: false,
                        personal: ''
                    }
                    setUtente(u);
                    setFlagPassword(false);
                } 
                if (error.code === 'auth/weak-password') {
                    setFlagPassword(true);
                    setPassword('');
                }
                if(error.code == 'auth/invalid-credential'){
                    await createUser(utente.id, password);
                    await signInUser(utente.id, password);
                    navigate('/fitness/home');
                }
            } else {
                setMessage("Errore sconosciuto");
            }
        }
    };

    return (
        <div className="root-register-page">
            <div className='register-page'>
            <div className='background'>
                <img src={image} className='img' />
            </div>
            <div className='overlay'>
                <img src={logo}/>
                <h1>TRASFORMA IL TUO CORPO.<br></br>INIZIA OGGI.</h1>
            </div>
            <div className='container'>
                <h3>Registrati!</h3>
                <div className='form-container'>
                    <form style={{ width: "80%" }} onSubmit={handleSubmit}>
                        <div className='form'>
                            <div className="box-radio">
                                <p>Sei un : </p>
                                <div className="radio-container">
                                    <div className="radio">
                                        <input type="radio" required name="userType" value="client" onChange={() => setIsClient(true)}/>
                                        Cliente
                                    </div>
                                    <div className="radio">
                                        <input type="radio" name="userType" value="trainer" onChange={() => setIsClient(false) }/>
                                        Personal Trainer
                                    </div>
                                </div>
                            </div>
                            { !isClient && (
                                <>
                                    <label htmlFor="Nome">
                                        <input placeholder="Nome" type="text" id="Nome" required onChange={(e) => setUtente(prev => ({ ...prev, nome: e.target.value }))} />
                                    </label>
                                    <label htmlFor="Cognome">
                                        <input placeholder="Cognome" type="text" id="Cognome" required onChange={(e) => setUtente(prev => ({ ...prev, cognome: e.target.value }))} />
                                    </label>
                                    <label htmlFor="data">
                                        <input placeholder="Data di nascita" type="date" id="data" required onChange={(e) => setUtente(prev => ({ ...prev, data: e.target.value }))} />
                                    </label>
                                    <label htmlFor="username">
                                        <input placeholder="Username" type="text" id="username" required onChange={(e) => setUtente(prev => ({ ...prev, username: e.target.value }))} />
                                    </label>
                                </>
                            )}
                            <label htmlFor="email">
                                <input placeholder="Email" type="email" id="email" required onChange={(e) => setUtente(prev => ({ ...prev, id: e.target.value }))} />
                            </label>
                            <label htmlFor="password">
                                <input placeholder="Password" type="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
                            </label>
                            { flagPassword && (<p className='alert-psw'>deve essere almeno lunga 6 caratteri !</p>)}
                        </div>
                        <button type='submit'>REGISTRATI</button>
                    </form>
                    <div className="register">
                        <p>Hai già un account? <a href="/fitness">Accedi</a></p>
                    </div>
                </div>
            </div>
        </div>
        {isOpen && (
            <div className='box-popup'>
                <div className='popup'>
                    <h1 style={{textAlign: "center"}}>Errore durante l'accesso</h1>
                    <p style={{textAlign: "center"}}>{message}</p>
                    <button onClick={toggleOpen}>Chiudi</button>
                </div>
            </div>
        )}
        {isPresent && (
            <div className='box-popup'>
                <div className='popup'>
                    <h1 style={{textAlign: "center"}}>Errore durante la registrazione</h1>
                    <p style={{textAlign: "center"}}>Il tuo account esiste giá: <a href="/fitness" style={{ color: "#3FB6FF", fontWeight: "bold" }}>Accedi</a></p>
                    <button onClick={togglePresent}>Chiudi</button>
                </div>
            </div>
        )}
        </div>
    )
}

export default Register;