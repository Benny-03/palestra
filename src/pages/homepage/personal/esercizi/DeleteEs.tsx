import { useState } from "react";
import { useAuth } from "../../../../state";
import trash from "../../../../svg/trash.svg";
import { deleteEsercizio } from "../../../../Firebase";

interface DeleteEsProps {
    id: string;
    cat: string;
    diff: string;
}

function DeleteEs (props: DeleteEsProps) {
    const { setEsercizi } = useAuth();
    const [popup, setPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [ flagDelete, setFlagDelete] = useState(false);
    
    const Delete = async () => {
        await deleteEsercizio(props.cat, props.diff, props.id);

        setEsercizi(prev => {
            const updated = {... prev};
            updated[props.cat][props.diff] = updated[props.cat][props.diff].filter(
                (esercizio) => esercizio.nome !== props.id
            );

            return updated;
        })

        setMessage("L'esercizio è stato eliminato");
        setPopup(!popup);
        setFlagDelete(true);
    }

    return(
        <>
            <button className='btn-delete' onClick={() => setPopup(!popup)}>
                <img src={trash} />
            </button>
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
                        <button onClick={() => {setFlagDelete(!flagDelete)}}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
        
    )
}

export default DeleteEs;