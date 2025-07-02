import { useNavigate } from "react-router";
import { getClient, isFirebaseError, signInUser } from "../../Firebase";
import { useAuth } from "../../state";
import { useState } from "react";
import image from '../../images/sfondo.jpeg';
import logo from '../../images/logo.png';

function Login() {
    const { message, setMessage} = useAuth();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setEmail('');
        setPassword('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await getClient(email);
            if(data) {
                await signInUser(email, password);
                console.log("Accesso riuscito");
                navigate('/fitness/home');
            }
            setMessage('non sei registrato');
            togglePopup();
        } catch (error) {
            if (isFirebaseError(error)) {
                if (error.code === 'auth/invalid-credential') {
                    setMessage("Credenziali non valide");
                } else {
                    setMessage("Errore Firebase");
                }
            } else {
                setMessage("Errore sconosciuto");
            }
            togglePopup();
        }
    };

    return (
        <div className="root-login-page">
            <div className='login-page'>
            <div className='background'>
                <img src={image} className='img' />
            </div>
            <div className='overlay'>
                <img src={logo}/>
                <h1>TRASFORMA IL TUO CORPO.<br></br>INIZIA OGGI.</h1>
            </div>
            <div className='container'>
                <h3>Accedi al tuo account!</h3>
                <div className='form-container'>
                    <form style={{ width: "80%" }} onSubmit={handleSubmit}>
                        <div className='form'>
                            <label htmlFor="email">
                                <input placeholder="Email" type="email" id="email" autoComplete="current-email" required onChange={(e) => setEmail(e.target.value)} />
                            </label>
                            <label htmlFor="password">
                                <input placeholder="Password" type="password" id="password" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                            </label>
                        </div>
                        <button type='submit'>ACCEDI</button>
                    </form>
                    <div className="register">
                        <p>Non hai un account? <a href="/fitness/register">Registrati</a></p>
                    </div>
                </div>
            </div>
        </div>
        {isOpen && (
            <div className='box-popup'>
                <div className='popup'>
                    <h1 style={{textAlign: "center"}}>Errore durante l'accesso</h1>
                    <p style={{textAlign: "center"}}>{message}</p>
                    <button onClick={togglePopup}>Chiudi</button>
                </div>
            </div>
        )}
        </div>
    )
}

export default Login;