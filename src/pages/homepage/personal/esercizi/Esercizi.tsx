import { useState } from "react";
import Header from "../../Header";
import { addEsercizio, getEsercizio } from "../../../../Firebase";
import { useAuth } from "../../../../state";
import DeleteEs from "./DeleteEs";
import ModifyEs from "./ModifyEs";

const Esercizi = () => {
    const { esercizi, setEsercizi } = useAuth();
    const [ category, setCategory ] = useState<string>('gambe');
    const [ flagAdd, setFlagAdd ] = useState<boolean>(false);
    const [isPresent, setIsPresent] = useState(false);
    const [ newEsercizio, setNewEsercizio] = useState({
        nome: '',
        descrizione: '',
        difficoltà: ''
    })

    const newEs = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await getEsercizio(newEsercizio.nome.toLowerCase(), category);
        if(data) {
            setFlagAdd(false);
            togglePresent();
            return;
        }
        await addEsercizio(category, newEsercizio.difficoltà, newEsercizio.nome.toLowerCase(), newEsercizio.descrizione);
        setEsercizi(prev => {
            const updated = { ...prev };

            updated[category][newEsercizio.difficoltà].push({
                nome: newEsercizio.nome,
                descrizione: newEsercizio.descrizione
            });

            return updated;
        });
        setNewEsercizio({ nome: '', descrizione: '', difficoltà: '' });
        setFlagAdd(false);
    };

    const togglePresent = () => {
        setIsPresent(!isPresent);
    }

  return (
    <div className="esercizi">
        <Header page='esercizi'/>
        <div className="esercizi-container">
            <div className="buttons">
                <button className={category == 'gambe' ? 'active' : ''} onClick={() => setCategory('gambe')}>Gambe</button>
                <button className={category == 'addome' ? 'active' : ''} onClick={() => setCategory('addome')}>Addome</button>
                <button className={category == 'braccia' ? 'active' : ''} onClick={() => setCategory('braccia')}>Braccia</button>
                <button className={category == 'glutei' ? 'active' : ''} onClick={() => setCategory('glutei')}>Glutei</button>
                <button className={category == 'schiena' ? 'active' : ''} onClick={() => setCategory('schiena')}>Schiena</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
                <button className="add-btn" style={{width: 'auto', padding: '0px 20px'}} onClick={() => setFlagAdd(!flagAdd)}>Aggiungi esercizio {category}</button>
            </div>
            <div className="table">
                <table className="esercizi-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrizione</th>
                            <th>Livello</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {esercizi[category] && Object.entries(esercizi[category]).map(([livello, eserciziList]) => (
                            eserciziList.map((esercizio) => (
                                <tr key={`${esercizio.nome}-${livello}`}>
                                    <td>{esercizio.nome}</td>
                                    <td>{esercizio.descrizione || ''}</td>
                                    <td>{livello}</td>
                                    <td><ModifyEs cat={category} diff={livello} id={esercizio.nome} desc={esercizio.descrizione ?? ''} /></td>
                                    <td><DeleteEs cat={category} diff={livello} id={esercizio.nome} /></td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        { flagAdd && (
            <div className='box-popup'>
                <div className='popup'>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <button className="btn-close" onClick={() => setFlagAdd(!flagAdd)}><span className="close">&times;</span></button>
                    </div>
                    <h1 style={{textAlign: "center"}}>Aggiungi un nuovo esercizio {category}</h1>
                    <form onSubmit={newEs}>
                        <div className="form-popup">
                            <label htmlFor="Nome">
                                <input placeholder="Nome" type="text" id="Nome" required onChange={(e) => setNewEsercizio(prev => ({ ...prev, nome: e.target.value }))} />
                            </label>
                            <label htmlFor="Descrizione">
                                <input placeholder="Descrizione" type="text" id="Descrizione" required onChange={(e) => setNewEsercizio(prev => ({ ...prev, descrizione: e.target.value }))} />
                            </label>
                            <label htmlFor="difficoltà">
                                <select id="difficoltà" required onChange={(e) => setNewEsercizio(prev => ({ ...prev, difficoltà: e.target.value }))}>
                                    <option value="" disabled selected>Seleziona la difficoltà</option>
                                    <option value="Facile">Facile</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzato">Avanzato</option>
                                </select>
                            </label>
                        </div>
                        <button type="submit">Aggiungi</button>
                    </form>
                </div>
            </div>
        )}
        {isPresent && (
            <div className='box-popup'>
                <div className='popup'>
                    <h1 style={{textAlign: "center"}}>Esercizio già presente</h1>
                    <button onClick={togglePresent}>Chiudi</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Esercizi;
