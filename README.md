# 🏋️‍♂️ Progetto Gestione Palestra
Questa applicazione web permette di gestire clienti, piani settimanali di allenamento ed esercizi, utilizzando **React** e **Firebase**.

## ✅ Requisiti
1. **Node.js**  
   Scarica da: [https://nodejs.org](https://nodejs.org)
2. **Git** (opzionale ma consigliato)  
   Scarica da: [https://git-scm.com](https://git-scm.com)

## 📦 Istruzioni per l'installazione
### 1. Scarica il progetto
**Opzione A: con Git**
```bash
git clone https://github.com/Benny-03/palestra.git
```
**Opzione B: scarica ZIP**
1. Vai alla pagina GitHub del progetto
2. Clicca su "Code" > "Download ZIP"
3. Estrai la cartella sul tuo computer

### 2. Apri la cartella del progetto
```bash
cd palestra
```

### 3. Usa la versione di node corretta e installa le dipendenze
```bash
nvm use
npm install
```

### 4. Configura Firebase
Crea un file .env nella cartella principale del progetto con questo contenuto:
```bash
VITE_FIREBASE_API_KEY=la-tua-api-key
VITE_FIREBASE_AUTH_DOMAIN=il-tuo-auth-domain
VITE_FIREBASE_PROJECT_ID=il-tuo-project-id
VITE_FIREBASE_STORAGE_BUCKET=il-tuo-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=il-tuo-sender-id
VITE_FIREBASE_APP_ID=la-tua-app-id
```

### 5. Avvia il progetto in locale
```bash
npm run dev
```

L'app sarà visibile all'indirizzo:
```bash
http://localhost:5173/fitness
```

## Problemi comuni
1. Errore vite not found? Installa Vite con:
```bash
npm install vite
```
2. Errore Firebase? Controlla che il file .env sia corretto e che le credenziali Firebase siano aggiornate.
