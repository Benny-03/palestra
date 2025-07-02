import { useState } from "react";
import { creaPiano } from "../../../../Firebase";
import { useAuth } from "../../../../state";

interface AddProps {
  id: string;
}

function AddPiano(props: AddProps) {
  const { pianoEsiste, setPianoEsiste} = useAuth();
  const [popup, setPopup] = useState(false);
  const [flagAdd, setFlagAdd] = useState(false);

  const handleCreaPiano = async () => {
    await creaPiano(props.id);
    setPopup(false);
    setFlagAdd(true);
    setPianoEsiste(true);
  };

  const toggle = () => {
    setFlagAdd(false);
  };

  return (
    <>
      <button className={pianoEsiste ? 'disabled' : ''} onClick={() => setPopup(true)} disabled={pianoEsiste}>Crea piano settimanale</button>
      {popup && (
        <div className="box-popup">
          <div className="popup">
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <button className="btn-close" onClick={() => setPopup(false)}>
                <span className="close">&times;</span>
              </button>
            </div>
            <h1 style={{ textAlign: "center" }}>Conferma creazione piano</h1>
            <p>Vuoi creare una sottocartella per ogni giorno della settimana?</p>
            <button onClick={handleCreaPiano}>Conferma</button>
          </div>
        </div>
      )}

      {flagAdd && (
        <div className="box-popup">
          <div className="popup">
            <h1 style={{ textAlign: "center" }}>Piano settimanale creato con successo!</h1>
            <button onClick={toggle}>Chiudi</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddPiano;
