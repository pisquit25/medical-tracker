# 📊 Tracker Parametri Medici

Web app per monitorare parametri medici nel tempo con visualizzazione grafica e intervalli di riferimento personalizzati.

## ✨ Funzionalità

- 📈 Grafici a linee interattivi con date sull'asse X e valori sull'asse Y
- 🎯 Intervalli standard (valori di riferimento popolazione generale)
- 🔧 Intervalli personalizzati calcolati automaticamente (media ± deviazioni standard)
- ✏️ Aggiungi, modifica ed elimina misurazioni
- 👁️ Escludi/includi misurazioni dal calcolo dell'intervallo personalizzato
- 💾 Salvataggio automatico nel browser (localStorage)
- 📥 Importa/Esporta dati in formato JSON
- 📱 Design responsive per mobile e desktop

## 🚀 Come Pubblicare Online - GUIDA COMPLETA

### Opzione 1: Netlify (CONSIGLIATA - La più semplice)

#### Passo 1: Crea un account GitHub
1. Vai su [github.com](https://github.com)
2. Clicca su "Sign up" e crea un account gratuito
3. Verifica la tua email

#### Passo 2: Carica il progetto su GitHub
1. Accedi a GitHub
2. Clicca sul pulsante "+" in alto a destra → "New repository"
3. Nome del repository: `medical-tracker-app`
4. Lascia "Public" selezionato
5. **NON** selezionare "Add a README file"
6. Clicca "Create repository"

7. **Carica i file:**
   - Clicca su "uploading an existing file"
   - Trascina TUTTI i file e cartelle del progetto (tutto il contenuto della cartella `medical-tracker-app`)
   - Scrivi un messaggio tipo "First commit"
   - Clicca "Commit changes"

#### Passo 3: Pubblica con Netlify
1. Vai su [netlify.com](https://www.netlify.com)
2. Clicca "Sign up" e scegli "Sign up with GitHub"
3. Autorizza Netlify ad accedere al tuo GitHub
4. Clicca "Add new site" → "Import an existing project"
5. Clicca "Deploy with GitHub"
6. Seleziona il repository `medical-tracker-app`
7. **Impostazioni build:**
   - Build command: `npm run build`
   - Publish directory: `build`
8. Clicca "Deploy site"

**Fatto! 🎉** Dopo 2-3 minuti il tuo sito sarà online!

Netlify ti darà un URL tipo `https://random-name-12345.netlify.app`

#### Personalizza il nome del sito (opzionale)
1. Vai in "Site settings" → "Change site name"
2. Scegli un nome (es: `mio-tracker-medico`)
3. Il tuo sito sarà: `https://mio-tracker-medico.netlify.app`

---

### Opzione 2: Vercel (Alternativa simile a Netlify)

1. Vai su [vercel.com](https://vercel.com)
2. Sign up con GitHub
3. Clicca "Add New" → "Project"
4. Importa il repository `medical-tracker-app`
5. Clicca "Deploy"

---

### Opzione 3: GitHub Pages (Gratis, più tecnico)

1. Nel tuo repository su GitHub, vai in "Settings"
2. Nella sidebar, clicca "Pages"
3. In "Source" seleziona "GitHub Actions"
4. Aggiungi questo file nel repository:

Crea: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

5. Commit il file
6. Il sito sarà disponibile a: `https://tuo-username.github.io/medical-tracker-app`

---

## 💻 Sviluppo Locale

### Prerequisiti
- Node.js (versione 14 o superiore)
- npm (incluso con Node.js)

### Installazione

```bash
# 1. Scarica il progetto
cd medical-tracker-app

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo
npm start
```

L'app si aprirà automaticamente nel browser su `http://localhost:3000`

### Comandi disponibili

- `npm start` - Avvia il server di sviluppo
- `npm run build` - Crea la versione di produzione
- `npm test` - Esegue i test
- `npm run eject` - Rimuove l'astrazione di create-react-app (ATTENZIONE: irreversibile)

## 📝 Personalizzazione

### Aggiungere nuovi parametri medici

Modifica il file `src/App.js` nell'array `parameters`:

```javascript
const [parameters, setParameters] = useState([
  { 
    name: 'Nome Parametro', 
    unit: 'unità di misura',
    standardRange: { min: valoreMinimoStandard, max: valoreMassimoStandard },
    customFormula: 'mean ± 1.5*sd'  // o 'mean ± 2*sd'
  },
  // ... altri parametri
]);
```

### Modificare la formula personalizzata

Attualmente supportate:
- `mean ± 1*sd` - Media ± 1 deviazione standard
- `mean ± 1.5*sd` - Media ± 1.5 deviazioni standard
- `mean ± 2*sd` - Media ± 2 deviazioni standard

## 🔒 Privacy e Sicurezza

- **Tutti i dati rimangono nel tuo browser** (localStorage)
- **Nessun dato viene inviato a server esterni**
- **Usa Esporta/Importa per fare backup**
- **I dati vengono persi se cancelli i dati del browser**

## 📦 Tecnologie Utilizzate

- React 18
- Recharts (grafici)
- Tailwind CSS (styling)
- Lucide React (icone)
- localStorage (persistenza dati)

## 🐛 Risoluzione Problemi

### Il sito non funziona dopo il deploy
1. Controlla che tutti i file siano stati caricati su GitHub
2. Verifica che il build command sia `npm run build`
3. Verifica che la publish directory sia `build`

### I dati non vengono salvati
- I dati sono salvati nel browser. Se cambi browser o dispositivo, non li troverai
- Usa "Esporta" per salvare un backup e "Importa" per ripristinarlo

### Il grafico non si visualizza
- Assicurati di aver aggiunto almeno 2 misurazioni per lo stesso parametro
- Controlla che almeno un range (standard o personalizzato) sia attivato

## 📧 Supporto

Per problemi o suggerimenti, apri una issue su GitHub.

## 📄 Licenza

MIT License - Puoi usare, modificare e distribuire liberamente questo progetto.

---

**Fatto con ❤️ per il monitoraggio della salute**
