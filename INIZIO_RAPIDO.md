# 🎯 INIZIO RAPIDO - 5 MINUTI

## Opzione A: Scarica e pubblica (PIÙ VELOCE)

### 1️⃣ Scarica il progetto
✅ Hai già il file `medical-tracker-app.tar.gz` - scaricalo!

### 2️⃣ Estrai i file
- **Windows:** Tasto destro → Estrai tutto
- **Mac:** Doppio click sul file
- **Linux:** `tar -xzf medical-tracker-app.tar.gz`

### 3️⃣ Segui la GUIDA_PUBBLICAZIONE.md
Apri il file `GUIDA_PUBBLICAZIONE.md` e segui le istruzioni passo-passo.

In 10 minuti avrai il tuo sito online! 🚀

---

## Opzione B: Prova in locale (per sviluppatori)

```bash
# 1. Entra nella cartella
cd medical-tracker-app

# 2. Installa dipendenze
npm install

# 3. Avvia l'app
npm start
```

Si aprirà automaticamente su `http://localhost:3000`

---

## 📁 Struttura del progetto

```
medical-tracker-app/
├── public/
│   └── index.html          # Pagina HTML principale
├── src/
│   ├── App.js              # Componente principale dell'app
│   ├── index.js            # Entry point React
│   └── index.css           # Stili globali
├── package.json            # Dipendenze del progetto
├── README.md               # Documentazione completa
├── GUIDA_PUBBLICAZIONE.md  # Guida passo-passo (INIZIA DA QUI!)
├── netlify.toml            # Configurazione Netlify
└── .gitignore              # File da ignorare su Git
```

---

## ✨ Funzionalità principali

✅ Aggiungi misurazioni mediche (parametro, valore, data)
✅ Visualizza grafici a linee interattivi
✅ Range standard popolazione generale
✅ Range personalizzato (media ± deviazioni standard)
✅ Includi/escludi misurazioni dal calcolo
✅ Esporta/Importa dati (backup)
✅ Salvataggio automatico nel browser
✅ Design responsive (funziona su mobile)

---

## 🎨 Parametri già configurati

- **Glicemia** (70-100 mg/dL)
- **VES** (0-20 mm/h)
- **TSH** (0.4-4.0 mIU/L)
- **Colesterolo Totale** (0-200 mg/dL)
- **Emoglobina** (12-16 g/dL)

Puoi facilmente aggiungerne altri modificando `src/App.js`!

---

## 🔒 Privacy

- Tutti i dati rimangono nel TUO browser
- Nessun server, nessun database esterno
- Usa Esporta/Importa per backup

---

## ❓ Domande frequenti

**Q: I dati sono al sicuro?**
A: Sì, rimangono solo nel tuo browser. Fai backup con "Esporta"!

**Q: Funziona offline?**
A: No, serve internet. Ma puoi salvarla come PWA in futuro.

**Q: Posso aggiungere altri parametri?**
A: Sì! Modifica l'array `parameters` in `src/App.js`

**Q: È gratis?**
A: Sì, completamente gratis con Netlify/Vercel/GitHub Pages

---

## 🚀 Prossimi passi

1. **Leggi** `GUIDA_PUBBLICAZIONE.md` per pubblicare online
2. **Personalizza** i parametri medici in `src/App.js`
3. **Testa** l'app localmente con `npm start`
4. **Pubblica** su Netlify seguendo la guida

---

**Buon lavoro! 💪**
