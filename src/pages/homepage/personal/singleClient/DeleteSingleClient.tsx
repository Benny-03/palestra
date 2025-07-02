import { useState } from "react";
import { deleteClient, removeCampoArray } from "../../../../Firebase";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../state";

interface DeleteProps {
    id: string;
}

function DeleteSingleClient (props: DeleteProps) {
    const { personal, clienti, setClienti, setPersonal } = useAuth();
    const [popup, setPopup] = useState(false);
    const [ flagDelete, setFlagDelete] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const Delete = async () => {
        await deleteClient(props.id);
        const update = clienti;
        update.filter(c => c.id !== props.id);
        setClienti(update);

        await removeCampoArray(personal.id, 'personal-trainer', 'clienti', props.id);
        setPersonal({
            ...personal,
            clienti: personal.clienti.filter(c => c !== props.id)
        });

        setMessage("L'utente è stato eliminato");
        setPopup(!popup);
        setFlagDelete(true);
    }

    const toggle = () => {
        navigate('/fitness/home');
    }
    
    return(
        <>
            <button onClick={() => setPopup(!popup)}>Elimina Cliente</button>
            {popup && (
                <div className='box-popup'>
                    <div className='popup'>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button className="btn-close" onClick={() => setPopup(!popup)}><span className="close">&times;</span></button>
                        </div>
                        <h1 style={{ textAlign: "center" }}>Sicuro di volerlo eliminare?</h1>
                        <p>non si torna più indietro</p>
                        <button onClick={Delete}>Elimina</button>
                    </div>
                </div>
            )}
            {flagDelete && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{ textAlign: "center" }}>{message}</h1>
                        <button onClick={toggle}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
        
    )
}

export default DeleteSingleClient;