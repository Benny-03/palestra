import { useState } from "react";
import { deletePiano } from "../../../../Firebase";
import { useAuth } from "../../../../state";

interface DeleteProps {
  id: string;
}

function DeletePiano (props: DeleteProps) {
    const { setPianoEsiste, pianoEsiste} = useAuth();
    const [popup, setPopup] = useState(false);
    const [flagDelete, setFlagDelete] = useState(false);

    const toggle = () => {
        setFlagDelete(false);
    };

    const handleEliminaPiano = async () => {
        await deletePiano(props.id);
        setPianoEsiste(false);
        setPopup(!popup)
        setFlagDelete(true);
    }

    return (
    <>
      <button className={!pianoEsiste ? 'disabled' : ''} onClick={() => setPopup(true)}>Elimina piano settimanale</button>
      {popup && (
        <div className="box-popup">
          <div className="popup">
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <button className="btn-close" onClick={() => setPopup(false)}>
                <span className="close">&times;</span>
              </button>
            </div>
            <h1 style={{ textAlign: "center" }}>Confermi eliminazione piano settimanale?</h1>
            <p>non si torna più indietro</p>
            <button onClick={handleEliminaPiano}>Conferma</button>
          </div>
        </div>
      )}

      {flagDelete && (
        <div className="box-popup">
          <div className="popup">
            <h1 style={{ textAlign: "center" }}>Piano settimanale eliminato con successo!</h1>
            <button onClick={toggle}>Chiudi</button>
          </div>
        </div>
      )}
    </>
  );
}

export default DeletePiano;