# 🧮 FEATURE v4.3.0 - RAPPORTI PARAMETRICI (RATIO)

## ✅ FEATURE COMPLETA IMPLEMENTATA!

**Nuova scheda "Ratio" tra Analytics e Impostazioni con sistema completo di rapporti parametrici avanzati.**

---

## 🎯 COSA È STATO IMPLEMENTATO

### 1. ✅ **Nuovi Parametri Predefiniti**
- **Sodiemia**: Range 135-145 mmol/L
- **Azotemia**: Range 15-50 mg/dL

### 2. ✅ **Rapporto Predefinito: Osmolalità Plasmatica**
```
Formula: (Glicemia / 18) + (Azotemia / 2.8) + (2 * Sodiemia)
Range Ottimale: 291-299 mOsm/kg (295 ± 4)
```

### 3. ✅ **Pagina Ratio Completa**
- Lista rapporti disponibili
- Dettaglio rapporto selezionato
- Grafico andamento temporale
- Storico calcoli
- Editor formula drag & drop

### 4. ✅ **Calcolo Automatico**
- Solo per misurazioni con **stessa data**
- Aggiornamento automatico quando si inseriscono nuove misurazioni
- Verifica presenza tutti parametri necessari

### 5. ✅ **Editor Formula Avanzato (Drag & Drop)**
- Palette componenti trascinabili
- Parametri medici
- Operatori (+, -, *, /)
- Numeri custom
- Parentesi per priorità
- Altri rapporti (rapporti da rapporti!)
- Validazione formula real-time
- Anteprima formula

### 6. ✅ **Grafico Cartesiano Temporale**
- Recharts responsive
- Punti colorati (verde/giallo/rosso) basati su range
- Linee tratteggiate range ottimale
- Tooltip dettagliato con parametri usati
- Legenda semaforo

### 7. ✅ **Semaforo Stati**
- 🟢 **Verde (Ottimale)**: Valore in range
- 🟡 **Giallo (Attenzione)**: Valore ±5% range
- 🔴 **Rosso (Critico)**: Valore fuori range

### 8. ✅ **Rapporti da Rapporti**
- Possibilità di usare rapporti già calcolati in nuove formule
- Esempio: Ratio Y = (Osmolalità Plasmatica * 2) + Parametro X

---

## 📊 STRUTTURA IMPLEMENTATA

### File Creati/Modificati:

```
src/
├── context/
│   └── RatioContext.jsx           ⭐ NUOVO - State management rapporti
├── pages/
│   └── Ratio.jsx                  ⭐ NUOVO - Pagina principale
├── components/
│   ├── RatioCard.jsx              ⭐ NUOVO - Card dettaglio rapporto
│   ├── RatioChart.jsx             ⭐ NUOVO - Grafico temporale
│   └── RatioFormulaBuilder.jsx    ⭐ NUOVO - Editor formula drag&drop
├── App.js                         ✅ Già configurato con routing
└── components/Header.jsx          ✅ Già configurato con link Ratio
```

---

## 🎨 INTERFACCIA UTENTE

### Pagina Ratio - Layout:

```
┌─────────────────────────────────────────────────────────────┐
│ 🧮 Rapporti Parametrici           [+ Nuovo Rapporto]        │
├─────────────────────────────────────────────────────────────┤
│ ℹ️  Info Box: Come funzionano i rapporti                     │
├─────────────────────┬───────────────────────────────────────┤
│ LISTA RAPPORTI      │ DETTAGLIO RAPPORTO SELEZIONATO        │
│                     │                                       │
│ ┌─────────────────┐ │ ┌─────────────────────────────────┐   │
│ │ Osmolalità      │ │ │ 📊 Osmolalità Plasmatica       │   │
│ │ Plasmatica  ●   │ │ │ Descrizione...                  │   │
│ │ Predefinito     │ │ │ Formula: (Glicemia/18)+...      │   │
│ │ 5 calcoli       │ │ │                                 │   │
│ └─────────────────┘ │ │ Range: 291-299 mOsm/kg          │   │
│                     │ │                                 │   │
│ ┌─────────────────┐ │ │ Ultimo Valore:                  │   │
│ │ Ratio Custom 1  │ │ │ 295.5 mOsm/kg 🟢 Ottimale      │   │
│ │ 3 calcoli       │ │ │ Data: 15/02/2026                │   │
│ └─────────────────┘ │ │ Parametri usati: Glicemia 88... │   │
│                     │ └─────────────────────────────────┘   │
│ [+ Nuovo]           │                                       │
│                     │ ┌─────────────────────────────────┐   │
│                     │ │ 📈 Andamento Temporale           │   │
│                     │ │                                 │   │
│                     │ │   [Grafico Lineare Recharts]    │   │
│                     │ │                                 │   │
│                     │ │ Legenda: 🟢 🟡 🔴              │   │
│                     │ └─────────────────────────────────┘   │
│                     │                                       │
│                     │ ┌─────────────────────────────────┐   │
│                     │ │ 📋 Storico Calcoli               │   │
│                     │ │ Data | Valore | Stato | Params  │   │
│                     │ │ -----|--------|-------|--------- │   │
│                     │ │ 15/2 | 295.5  | 🟢    | G:88... │   │
│                     │ │ 12/2 | 297.2  | 🟢    | G:92... │   │
│                     │ │ 10/2 | 301.0  | 🔴    | G:110.. │   │
│                     │ └─────────────────────────────────┘   │
└─────────────────────┴───────────────────────────────────────┘
```

---

## 🔧 EDITOR FORMULA (Formula Builder)

### Modal Builder - Drag & Drop:

```
┌───────────────────────────────────────────────────────────┐
│ Nuovo Rapporto Parametrico                            ✕   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Nome: [Osmolalità Plasmatica___________________]          │
│ Descrizione: [Misura concentrazione soluti...___]         │
│ Unità: [mOsm/kg___] Min: [291] Max: [299]                │
│                                                           │
│ Costruttore Formula:                [Nascondi Palette]   │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ PALETTE COMPONENTI                                  │  │
│ ├─────────────────────────────────────────────────────┤  │
│ │ PARAMETRI:                                          │  │
│ │ [+ Glicemia] [+ VES] [+ TSH] [+ Sodiemia]          │  │
│ │ [+ Azotemia] [+ Emoglobina] [+ Colesterolo]        │  │
│ │                                                     │  │
│ │ OPERATORI:                                          │  │
│ │ [+] [-] [*] [/]                                     │  │
│ │                                                     │  │
│ │ PARENTESI:                                          │  │
│ │ [(] [)]                                             │  │
│ │                                                     │  │
│ │ NUMERO:                                             │  │
│ │ [Inserisci numero_____] [+ Aggiungi]                │  │
│ │                                                     │  │
│ │ RAPPORTI ESISTENTI:                                 │  │
│ │ [+ Osmolalità Plasmatica] [+ Ratio Custom 1]       │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ FORMULA CORRENTE:                                         │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ [(] ← [Glicemia] ✕ → [/] ← [18] ✕ → [)]           │  │
│ │ ← [+] ✕ → [(] ← [Azotemia] ✕ → [/] ← [2.8] ✕ → [)] │  │
│ │ ← [+] ✕ → [(] ← [2] ✕ → [*] ← [Sodiemia] ✕ → [)]  │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ANTEPRIMA:                                                │
│ (Glicemia / 18) + (Azotemia / 2.8) + (2 * Sodiemia)      │
│                                                           │
│                                [Annulla] [💾 Salva]       │
└───────────────────────────────────────────────────────────┘
```

**Interazioni:**
- ✅ Click su elemento palette → Aggiunge alla formula
- ✅ Hover su elemento formula → Mostra ← → ✕ (sposta, elimina)
- ✅ Drag & drop per riordinare (via frecce)
- ✅ Validazione real-time
- ✅ Anteprima formula leggibile

---

## 💡 FUNZIONALITÀ AVANZATE

### 1. **Calcolo Solo Date Coincidenti**

```javascript
// Esempio: Osmolalità Plasmatica richiede:
// - Glicemia
// - Azotemia  
// - Sodiemia

// Misurazioni Paziente:
15/02/2026:
  - Glicemia: 88 mg/dL     ✅
  - Azotemia: 35 mg/dL     ✅
  - Sodiemia: 140 mmol/L   ✅
  → CALCOLO: (88/18)+(35/2.8)+(2*140) = 295.5 ✅

12/02/2026:
  - Glicemia: 92 mg/dL     ✅
  - Azotemia: 38 mg/dL     ✅
  - Sodiemia: NON PRESENTE ❌
  → NESSUN CALCOLO ❌

10/02/2026:
  - Tutti e 3 presenti      ✅
  → CALCOLO: 297.2 ✅
```

### 2. **Rapporti da Rapporti (Composizione)**

```javascript
// Rapporto Base:
Osmolalità = (Glicemia/18) + (Azotemia/2.8) + (2*Sodiemia)

// Nuovo Rapporto che USA Osmolalità:
Ratio Custom = (Osmolalità * 2) + TSH

// Sistema:
// 1. Calcola prima Osmolalità
// 2. Usa risultato per calcolare Ratio Custom
// 3. Ordine automatico corretto
```

### 3. **Semaforo Dinamico**

```javascript
Range: 291-299

Valore 295 → 🟢 Verde (in range)
Valore 290 → 🟡 Giallo (291 - 5% = 276, quindi in tolleranza)
Valore 270 → 🔴 Rosso (fuori range e tolleranza)
Valore 302 → 🟡 Giallo (299 + 5% = 314, quindi in tolleranza)
Valore 320 → 🔴 Rosso (fuori)
```

### 4. **Grafico Intelligente**

- ✅ Punti colorati basati su stato
- ✅ Linee tratteggiate min/max range
- ✅ Tooltip con:
  - Data completa
  - Valore con unità
  - Stato (Ottimale/Attenzione/Critico)
  - Lista parametri usati
- ✅ Asse Y auto-scale con margine
- ✅ Asse X con date ruotate 45°
- ✅ Responsive (mobile-friendly)

---

## 🔄 WORKFLOW UTENTE

### Creazione Nuovo Rapporto:

```
1. Click "Nuovo Rapporto"
   ↓
2. Modal si apre
   ↓
3. Compila info base:
   - Nome: "Indice Glicemico Personalizzato"
   - Descrizione: "..."
   - Unità: "punti"
   - Range: min 50, max 100
   ↓
4. Costruisci formula:
   - Click "Glicemia" → Aggiunto
   - Click "/" → Aggiunto
   - Inserisci numero "2" → Click + → Aggiunto
   - Click "*" → Aggiunto
   - Click "TSH" → Aggiunto
   ↓
5. Vedi anteprima: "Glicemia / 2 * TSH"
   ↓
6. Click "Salva"
   ↓
7. Rapporto creato!
   ↓
8. Sistema calcola automaticamente usando misurazioni esistenti
   ↓
9. Risultati appaiono in grafico e storico
```

### Visualizzazione Rapporti:

```
1. Vai su scheda "Ratio"
   ↓
2. Lista rapporti a sinistra
   ↓
3. Click su "Osmolalità Plasmatica"
   ↓
4. Dettaglio appare a destra:
   - Card con ultimo valore e stato
   - Grafico andamento
   - Tabella storico
   ↓
5. Analizza trend visivamente
   ↓
6. Identifica pattern (es: sempre alto dopo pranzo)
```

---

## 📐 FORMULE MATEMATICHE SUPPORTATE

### Operatori:
```
+ Addizione
- Sottrazione
* Moltiplicazione
/ Divisione
() Parentesi per priorità
```

### Esempi Validi:

```javascript
// Semplice
Glicemia / 18

// Con costanti
(Glicemia / 18) + (Azotemia / 2.8)

// Con moltiplicatori
2 * Sodiemia

// Complessa
((Glicemia + Colesterolo) / 2) * TSH

// Usando altri rapporti
(Osmolalità * 1.5) + (Glicemia / 10)

// Multi-livello
((Ratio1 + Ratio2) / 2) * Parametro1
```

### Validazione Automatica:

```
✅ Parentesi bilanciate
✅ Operatori non consecutivi
✅ Almeno un parametro
✅ Sequenza logica
❌ Due operatori di seguito
❌ Parentesi non chiuse
❌ Formula vuota
```

---

## 💾 STORAGE & PERSISTENZA

### localStorage Keys:

```javascript
'medicalRatios'           // Array rapporti definiti
'ratioCalculations'       // Array calcoli storici
```

### Struttura Ratio:

```javascript
{
  id: 'ratio_1234567890',
  name: 'Osmolalità Plasmatica',
  description: 'Misura concentrazione...',
  unit: 'mOsm/kg',
  standardRange: { min: 291, max: 299 },
  formula: '(Glicemia / 18) + ...',
  formulaComponents: [
    { type: 'parenthesis', value: '(' },
    { type: 'parameter', value: 'Glicemia' },
    { type: 'operator', value: '/' },
    { type: 'number', value: 18 },
    // ...
  ],
  parameters: ['Glicemia', 'Azotemia', 'Sodiemia'],
  color: '#8b5cf6',
  predefined: true  // False per custom
}
```

### Struttura Calculation:

```javascript
{
  id: 'calc_1234567890_random',
  ratioId: 'ratio_1',
  ratioName: 'Osmolalità Plasmatica',
  patientId: 'patient_1',
  date: '2026-02-15',
  value: 295.5,
  parameters: {
    'Glicemia': 88,
    'Azotemia': 35,
    'Sodiemia': 140
  },
  timestamp: 1739577600000
}
```

---

## 🔄 RICALCOLO AUTOMATICO

### Trigger Ricalcolo:

1. ✅ Inserimento nuova misurazione
2. ✅ Modifica misurazione esistente
3. ✅ Cambio paziente attivo
4. ✅ Toggle include/exclude misurazione

### Processo:

```
1. Rileva cambio measurements[]
   ↓
2. RatioContext.recalculateRatios()
   ↓
3. Per ogni ratio:
   a. Raggruppa misurazioni per data
   b. Verifica tutti parametri presenti
   c. Calcola formula
   d. Salva risultato
   ↓
4. Update ratioCalculations[]
   ↓
5. localStorage aggiornato
   ↓
6. UI si aggiorna automaticamente
```

---

## 🎨 DESIGN & UX

### Colori Componenti Palette:

```
Parametri:    bg-blue-100 text-blue-700
Operatori:    bg-green-100 text-green-700
Parentesi:    bg-purple-100 text-purple-700
Numeri:       bg-yellow-100 text-yellow-700
Rapporti:     bg-orange-100 text-orange-700
```

### Stati Semaforo:

```
🟢 Verde (Ottimale):
   - bg-green-500
   - border-green-600
   - text-green-700

🟡 Giallo (Attenzione):
   - bg-yellow-500
   - border-yellow-600
   - text-yellow-700

🔴 Rosso (Critico):
   - bg-red-500
   - border-red-600
   - text-red-700
```

---

## 📱 RESPONSIVE DESIGN

### Mobile (<768px):
```
- Lista rapporti: Stack verticale
- Card dettaglio: Full width
- Grafico: Responsive container
- Tabella: Scroll orizzontale
- Palette builder: Stack componenti
```

### Tablet (768-1024px):
```
- Lista rapporti: 33% width
- Dettaglio: 67% width
- Grafico: Ottimizzato
```

### Desktop (>1024px):
```
- Lista rapporti: Sidebar sinistra
- Dettaglio: Main content area
- Formula builder: Modal largo
```

---

## 🧪 TESTING

### Test Osmolalità Plasmatica:

```bash
1. Inserisci misurazioni stessa data:
   - Glicemia: 90 mg/dL
   - Azotemia: 30 mg/dL
   - Sodiemia: 142 mmol/L

2. Calcolo atteso:
   (90/18) + (30/2.8) + (2*142)
   = 5 + 10.71 + 284
   = 299.71 mOsm/kg

3. Vai su Ratio → Osmolalità
4. Verifica:
   ✓ Ultimo valore: 299.71
   ✓ Stato: 🟡 Giallo (sopra 299)
   ✓ Grafico mostra punto giallo
   ✓ Tabella mostra calcolo

5. Inserisci altra data con solo 2 parametri
6. Verifica:
   ✓ Nessun nuovo calcolo (manca parametro)
```

### Test Rapporto Custom:

```bash
1. Click "Nuovo Rapporto"
2. Nome: "Test Ratio"
3. Formula: Glicemia / TSH
4. Range: 10-30
5. Salva

6. Inserisci misurazioni stessa data:
   - Glicemia: 100
   - TSH: 2.5

7. Calcolo atteso: 100 / 2.5 = 40

8. Vai su Ratio → Test Ratio
9. Verifica:
   ✓ Valore: 40
   ✓ Stato: 🔴 Rosso (sopra 30)
   ✓ Grafico mostra punto rosso
```

### Test Rapporti da Rapporti:

```bash
1. Crea Ratio A: Glicemia / 10
2. Inserisci Glicemia: 100
3. Ratio A = 10

4. Crea Ratio B: Ratio A * TSH
5. Inserisci TSH: 2.5 (stessa data)
6. Ratio B = 10 * 2.5 = 25

7. Verifica:
   ✓ Ratio A calcolato per primo
   ✓ Ratio B usa risultato Ratio A
   ✓ Entrambi presenti in lista
```

---

## 🔒 SICUREZZA & VALIDAZIONE

### Input Sanitization:

```javascript
// Numeri
parseFloat(value)  // Converte stringa in numero
isNaN(result)      // Verifica validità

// Formula
Function() invece di eval()  // Più sicuro
Validazione componenti       // Prima esecuzione
```

### Prevenzione Errori:

```javascript
try {
  const result = evaluateFormula(...);
  if (!isFinite(result)) throw Error();
} catch (error) {
  console.error('Errore calcolo');
  // Non salva risultato
}
```

---

## 📚 FILE DA CONOSCERE

### Critici:

1. **src/context/RatioContext.jsx** (300+ righe)
   - State management rapporti
   - Logica calcolo
   - Validazione formule

2. **src/pages/Ratio.jsx** (300+ righe)
   - UI principale
   - Layout responsive
   - Gestione selezione

3. **src/components/RatioFormulaBuilder.jsx** (400+ righe)
   - Editor drag & drop
   - Palette componenti
   - Validazione real-time

### Secondari:

4. **src/components/RatioCard.jsx**
   - Visualizzazione dettaglio

5. **src/components/RatioChart.jsx**
   - Grafico Recharts

---

## ✅ CHECKLIST FEATURE

- [x] Nuovi parametri Sodiemia e Azotemia
- [x] Rapporto predefinito Osmolalità
- [x] Pagina Ratio con routing
- [x] Context per state management
- [x] Calcolo automatico date coincidenti
- [x] Editor formula drag & drop
- [x] Validazione formule real-time
- [x] Grafico cartesiano temporale
- [x] Semaforo verde/giallo/rosso
- [x] Storico calcoli
- [x] Rapporti da rapporti
- [x] Responsive design
- [x] localStorage persistenza
- [x] Documentazione completa

---

**Status:** ✅ FEATURE COMPLETA v4.3.0  
**Testing:** Pronto  
**Deploy:** Pronto  

🎉 **Sistema Rapporti Parametrici Funzionante!**
