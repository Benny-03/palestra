import { logOutUser } from "../../Firebase";
import { useAuth } from "../../state";
import { useNavigate } from "react-router";

interface props {
  page: string;
}

function Header(props: props) {
    const { user, personal, isClient } = useAuth();
    const utente = isClient ? user : personal;
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await logOutUser();
            console.log('Utente disconnesso con successo');
            navigate('/fitness');
        } catch (error) {
            console.error('Errore di logout:', error);
        }
    };

  return (
    <div>
      <div className="header">
        <div className="user-info">
          <h1>
            {utente.nome.charAt(0).toUpperCase()}
            {utente.cognome.charAt(0).toUpperCase()}
          </h1>
          <p>{utente.username}</p>
        </div>
        <button onClick={logOut}>Logout</button>
      </div>
      {isClient && (
        <div className="links">
          <a className={props.page == 'piano' ? 'active' : ''} href="/fitness/home">Piano di allenamento</a>
        </div>
      )}
      {!isClient && (
        <div className="links">
            <a className={props.page == 'clienti' ? 'active' : ''} href="/fitness/home">Clienti</a>
            <a className={props.page == 'esercizi' ? 'active' : ''} href="/fitness/esercizi">Esercizi</a>
        </div>
      )}
    </div>
  );
}

export default Header;
