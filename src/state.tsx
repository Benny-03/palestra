/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, use, useEffect, useState } from "react";
import { auth, getClient, getEsercizi, getPersonal, getPersonals } from "./Firebase";

type ClientType = {
    nome: string;
    cognome: string;
    data_nascita: string;
    username: string;
    id: string;
    difficoltà: string;
};

type PersonalType = {
    nome: string;
    cognome: string;
    data_nascita: string;
    username: string;
    id: string;
    clienti: string[];
};

type AuthContextType = {
    message: string;
    setMessage: (value: string) => void;
    difficoltà: string;
    setDifficoltà: (value: string) => void;
    personals: PersonalType[]; //lista personal trainer
    setPersonals: (value: PersonalType[]) => void;
    user: ClientType, //utente cliente
    setUser: (value: ClientType) => void;
    personal: PersonalType; //utente personal trainer
    setPersonal: (value: PersonalType) => void;
    isClient: boolean;
    setIsClient: (value: boolean) => void;
    esercizi: Record<string, Record<string, { nome: string; descrizione?: string }[]>>;
    setEsercizi: React.Dispatch<React.SetStateAction<Record<string, Record<string, { nome: string; descrizione?: string }[]>>>>;
    clienti: ClientType[]; //clienti dei personal trainer
    setClienti: (value: ClientType[]) => void;
    pianoEsiste: boolean,
    setPianoEsiste: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
    message: '',
    setMessage: () => {},
    difficoltà: '',
    setDifficoltà: () => {},
    personals: [],
    setPersonals: () => {},
    user: {
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: '',
        difficoltà: ''
    },
    setUser: () => {},
    personal: {
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: '',
        clienti: []
    },
    setPersonal: () => {},
    isClient: false,
    setIsClient: () => {},
    esercizi: {},
    setEsercizi: () => {},
    clienti: [],
    setClienti: () => {},
    pianoEsiste: false,
    setPianoEsiste: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('');
    const [difficoltà, setDifficoltà] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [personals, setPersonals] = useState<PersonalType[]>([]);
    const [user, setUser] = useState<ClientType>({
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: '',
        difficoltà: ''
    });
    const [personal, setPersonal] = useState<PersonalType>({
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: '',
        clienti: []
    });
    const [esercizi, setEsercizi] = useState<Record<string, Record<string, { nome: string; descrizione?: string }[]>>>({});
    const [clienti, setClienti] = useState<ClientType[]>([]);
    const [pianoEsiste, setPianoEsiste] = useState(false)

    useEffect(() => {
        const fetchPersonals = async () => {
            try {
                const fetchedPersonals = await getPersonals();
                setPersonals(fetchedPersonals);
            } catch (error) {
                console.error("Error fetching personals:", error);
            }
        };
        fetchPersonals();

        const fetchEsercizi = async () => {
        try {
            const data = await getEsercizi();
            setEsercizi(data);
            console.log("Esercizi:", data);
        } catch (error) {
            console.error("Errore nel recupero degli esercizi:", error);
        }
        };
        fetchEsercizi();
    }, []);

    useEffect(() => {
        const getUserData = async () => {
            const user = auth.currentUser;
            if (user && user.email) {
                let client = await getClient(user.email);
                let pt = await getPersonal(user.email);
                if (client.id !== "") {
                    setUser({
                        nome: client.nome,
                        cognome: client.cognome,
                        data_nascita: client.data_nascita,
                        username: client.username,
                        id: client.id,
                        difficoltà: client.difficoltà
                    });
                    setPersonal({
                        nome: '',
                        cognome: '',
                        data_nascita: '',
                        username: '',
                        id: '',
                        clienti: []
                    });
                    setIsClient(true);
                    setDifficoltà(client.difficoltà);
                }
                if (pt.id !== "") {
                    setPersonal({
                        nome: pt.nome,
                        cognome: pt.cognome,
                        data_nascita: pt.data_nascita,
                        username: pt.username,
                        id: pt.id,
                        clienti: pt.clienti
                    });
                    setUser({
                        nome: '',
                        cognome: '',
                        data_nascita: '',
                        username: '',
                        id: '',
                        difficoltà: ''
                    });
                    setIsClient(false);
                } 
            }
        };
        getUserData();
    }, [auth.currentUser]);

    useEffect(() => {
        const fetchClienti = async () => {
            if (!isClient && personal.clienti.length > 0) {
                const promises = personal.clienti.map(async (clienteId) => {
                    const data = await getClient(clienteId);
                    return {
                        id: data.id,
                        nome: data.nome,
                        cognome: data.cognome,
                        data_nascita: data.data_nascita,
                        username: data.username,
                        difficoltà: data.difficoltà
                    };
                });
                const clientiData = await Promise.all(promises);
                setClienti(clientiData);
            }
        };
        fetchClienti();
    }, [personal]);

    return (
        <AuthContext.Provider 
            value={{ 
                message,
                setMessage,
                difficoltà,
                setDifficoltà,
                personals,
                setPersonals,
                user,
                setUser,
                personal,
                setPersonal,
                isClient,
                setIsClient,
                esercizi,
                setEsercizi,
                clienti,
                setClienti,
                pianoEsiste,
                setPianoEsiste
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => use(AuthContext);