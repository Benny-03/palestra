import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword,getAuth,signInWithEmailAndPassword,signOut,} from "firebase/auth";
import {addDoc, arrayRemove,arrayUnion,collection,deleteDoc,doc,getDocs,getFirestore,query,setDoc,updateDoc,where,} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const authSecond = getAuth(secondaryApp);

const giorniSettimana = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica"
];
const categorie = ["gambe", "addome", "braccia", "glutei", "schiena"];
const livelli = ["Facile", "Avanzato", "Intermedio"];

/* AUTENTICAZIONE */

export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await signOut(authSecond);
    return userCredential.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Errore Firebase:", error.message);
    }
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Errore Firebase:", error.message);
    }
    throw error;
  }
};

export const logOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Utente disconnesso con successo");
  } catch (error) {
    console.error("Errore di logout:", error);
    throw error;
  }
};

export const addClient = async (
  email: string,
  nome: string,
  cognome: string,
  data: string,
  username: string,
  difficoltà: string,
  personal: string
) => {
  await setDoc(doc(db, "clienti", email), {
    nome: nome,
    cognome: cognome,
    data_nascita: data,
    username: username,
    id: email,
    difficoltà: difficoltà,
    personal: personal,
  });
};

export const addPersonal = async (
  email: string,
  nome: string,
  cognome: string,
  data: string,
  username: string,
  clienti: string
) => {
  await setDoc(doc(db, "personal-trainer", email), {
    nome: nome,
    cognome: cognome,
    data_nascita: data,
    username: username,
    id: email,
    clienti: clienti,
  });
};

export const getClient = async (email: string) => {
  const q = query(collection(db, "clienti"), where("id", "==", email));
  const querySnapshot = await getDocs(q);
  let user = {
    nome: "",
    cognome: "",
    data_nascita: "",
    username: "",
    id: "",
    difficoltà: "",
  };
  querySnapshot.forEach((doc) => {
    user = {
      nome: doc.data().nome,
      cognome: doc.data().cognome,
      data_nascita: doc.data().data_nascita,
      username: doc.data().username,
      id: doc.data().id,
      difficoltà: doc.data().difficoltà,
    };
  });
  return user;
};

export const getPersonal = async (email: string) => {
  const q = query(collection(db, "personal-trainer"), where("id", "==", email));
  const querySnapshot = await getDocs(q);
  let user = {
    nome: "",
    cognome: "",
    data_nascita: "",
    username: "",
    id: "",
    clienti: [],
  };
  querySnapshot.forEach((doc) => {
    user = {
      nome: doc.data().nome,
      cognome: doc.data().cognome,
      data_nascita: doc.data().data_nascita,
      username: doc.data().username,
      id: doc.data().id,
      clienti: doc.data().clienti,
    };
  });
  return user;
};

export const getPersonals = async () => {
  const q = query(collection(db, "personal-trainer"));
  const querySnapshot = await getDocs(q);
  let user: {
    nome: any;
    cognome: any;
    data_nascita: any;
    username: any;
    id: any;
    clienti: any;
  }[] = [];
  querySnapshot.forEach((doc) => {
    user.push({
      nome: doc.data().nome,
      cognome: doc.data().cognome,
      data_nascita: doc.data().data_nascita,
      username: doc.data().username,
      id: doc.data().id,
      clienti: doc.data().clienti,
    });
  });
  return user;
};

export const updateCampoArray = async (
  email: string,
  collezione: string,
  campo: string,
  valore: string
) => {
  const docRef = doc(db, collezione, email);
  await updateDoc(docRef, {
    [campo]: arrayUnion(valore),
  });
};

export const removeCampoArray = async (email: string, collezione: string, campo: string, valore: string) => {
  const docRef = doc(db, collezione, email);
  await updateDoc(docRef, {
    [campo]: arrayRemove(valore),
  });
}

export const deleteClient = async (email:string) => {
  try {
    await deleteDoc(doc(db, "clienti", email));
    console.log("Cliente eliminato con successo!");
  } catch (error) {
    console.error("Errore durante l'eliminazione del cliente:", error);
  }
}

export const updateClient = async (email: string, nome: string, cognome: string, data: string, difficoltà: string, username: string) => {
    await updateDoc(doc(db, "clienti", email), {
        cognome: cognome,
        data_nascita: data,
        difficoltà: difficoltà,
        username: username,
        nome: nome
    });
}

/* ESERCIZI */

export const getEsercizi = async () => {
  const esercizi: Record<string, Record<string, { nome: string; descrizione?: string }[]>> = {};

  for (const categoria of categorie) {
    esercizi[categoria] = {};

    for (const livello of livelli) {
      const sottocollezioneRef = collection(db, "esercizi", categoria, livello);
      const snapshot = await getDocs(sottocollezioneRef);

      const listaEsercizi = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          nome: doc.id,
          descrizione: data.descrizione || "", 
        };
      });

      esercizi[categoria][livello] = listaEsercizi;
    }
  }

  return esercizi;
};

export const getEsercizio = async (nome: string, categoria: string) => {
  let es = {
    nome: "",
    descrizione: ""
  };
  for (const livello of livelli) {
    const q = query(collection(db, "esercizi", categoria, livello),where("id", "==", nome));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      es = {
        nome: doc.data().nome,
        descrizione: doc.data().descrizione
      };
      break;
    }
  }
  return es;
};

export const addEsercizio = async (categoria: string, livello: string, nomeEsercizio: string, descrizione?: string): Promise<void> => {
  try {
    const esercizioRef = doc(db, "esercizi", categoria, livello, nomeEsercizio);
    const dati: { nome: string; descrizione?: string } = { nome: nomeEsercizio };

    if (descrizione) {
      dati.descrizione = descrizione;
    }

    await setDoc(esercizioRef, dati, { merge: true });
    console.log(`Esercizio "${nomeEsercizio}" aggiunto in ${categoria}/${livello}`);
  } catch (error) {
    console.error("Errore nell'aggiunta dell'esercizio:", error);
  }
};

export const deleteEsercizio = async (categoria: string, difficoltà: string,nome: string): Promise<void> => {
  try {
    const esercizioDocRef = doc(db, "esercizi", categoria, difficoltà, nome);
    await deleteDoc(esercizioDocRef);
    console.log(`Esercizio ${nome} eliminato da categoria ${categoria} livello ${difficoltà}`);
  } catch (error) {
    console.error("Errore eliminando esercizio:", error);
  }
}

export const modifyEsercizio = async (categoria: string, difficoltà: string, nome: string, nuovaDescrizione: string): Promise<void> => {
  try {
    const ref = doc(db, "esercizi", categoria, difficoltà, nome);
    await updateDoc(ref, { descrizione: nuovaDescrizione });
    console.log("Descrizione aggiornata correttamente.");
  } catch (error) {
    console.error("Errore aggiornando descrizione:", error);
  }
}

/* ERRORI */
export function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

/* PIANO SETTIMANALE */

export const hasPiano = async (id: string): Promise<boolean> => {
    const subColRef = collection(db, "clienti", id, "Lunedì");
    const snapshot = await getDocs(subColRef);
    return !snapshot.empty;
}

export const creaPiano = async (id:string) => {
  for (const giorno of giorniSettimana) {
    const giornoDocRef = doc(db, "clienti", id, giorno, "iniziale");

    await setDoc(giornoDocRef, {
      note: "",
      esercizi: [],
      creato_il: new Date()
    });
  }
}

export const getPianoSettimanale = async (idCliente: string) => {
  const piano = [];

  for (const giorno of giorniSettimana) {
    const esercizi: { id: string; }[] = [];
    const giornoRef = collection(db, "clienti", idCliente, giorno);
    const snapshot = await getDocs(giornoRef);

    snapshot.forEach((doc) => {
      if (doc.id !== "iniziale") {
        const data = doc.data();
        esercizi.push({
          id: doc.id,
          ...data
        });
      }
    });

    piano.push({ giorno, esercizi });
  }
  return piano;
};

export const deletePiano = async (idCliente: string) => {
  for (const giorno of giorniSettimana) {
    const colRef = collection(db, "clienti", idCliente, giorno);
    const snapshot = await getDocs(colRef);

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "clienti", idCliente, giorno, docSnap.id));
    }
  }
}

export const addEsPiano = async (idCliente: string, giorno: string, nomeEsercizio: string, ripetizioni: string, n_volte: string, pausa: string) => {
  const docRef = doc(db, "clienti", idCliente, giorno, nomeEsercizio);

  await setDoc(docRef, {
    nome: nomeEsercizio,
    ripetizioni,
    n_volte,
    pausa
  });
};

export const deleteEsPiano = async (idCliente: string, giorno: string, idEsercizio: string) => {
  const docRef = doc(db, "clienti", idCliente, giorno, idEsercizio);
  await deleteDoc(docRef);
}

export const modifyEsPiano = async (idCliente: string, giorno: string, idEsercizio: string, datiOggetto: {ripetizioni?: string;n_volte?: string;pausa?: string;}) => {
  const docRef = doc(db, "clienti", idCliente, giorno, idEsercizio);
  await updateDoc(docRef, datiOggetto);
}