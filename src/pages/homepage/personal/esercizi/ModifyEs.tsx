import { useState } from "react";
import { useAuth } from "../../../../state";
import pencil from '../../../../svg/pencil.svg';
import { modifyEsercizio } from "../../../../Firebase";

interface ModifyEsProps {
    id: string;
    cat: string;
    diff: string;
    desc: string;
}

function ModifyEs(props: ModifyEsProps) {
    const { setEsercizi } = useAuth();
    const [popup, setPopup] = useState(false);
    const [ flagModify, setFlagModify] = useState(false);
    const [ newDesc, setNewDesc] = useState('');

    const Modify = async (e: React.FormEvent) => {
        e.preventDefault();

        await modifyEsercizio(props.cat, props.diff, props.id.toLowerCase(), newDesc);

        setEsercizi(prev => {
            const updated = { ...prev };

            updated[props.cat] = {
                ...updated[props.cat],
                [props.diff]: updated[props.cat][props.diff].map(es => {
                if (es.nome === props.id) {
                    return {
                        ...es,
                        descrizione: newDesc
                    };
                }
                return es;
                })
            };
            return updated;
        });

        console.log('esercizio modificato');
        setNewDesc('');
        setPopup(!popup);
        setFlagModify(!flagModify);
    }

    return (
        <>
            <button className="btn-modify" onClick={() => setPopup(!popup)}>
                <img src={pencil} />
            </button>
            {popup && (
                <div className="box-popup">
                    <div className="popup">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button className="btn-close" onClick={() => setPopup(!popup)}><span className="close">&times;</span></button>
                        </div>
                        <h1 style={{ textAlign: "center" }}>Modifica descrizione</h1>
                        <form onSubmit={Modify}>
                            <label htmlFor="descrizione">
                                <input type="text" id="descrizione" required placeholder={props.desc} onChange={(e) => setNewDesc(e.target.value) }/>
                            </label>
                            <button type="submit">Salva</button>
                        </form>
                    </div>
                </div>
            )}
            {flagModify && (
                <div className="box-popup">
                    <div className="popup">
                        <h1 style={{ textAlign: "center" }}>La descrizione è stata modificata correttamente!</h1>
                        <button onClick={() => setFlagModify(!flagModify)}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModifyEs;
