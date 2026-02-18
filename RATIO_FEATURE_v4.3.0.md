# 🧮 FEATURE RATIO v4.3.0 - RAPPORTI TRA PARAMETRI

## ✅ IMPLEMENTAZIONE COMPLETA

**Nuova scheda "Ratio" per calcolare e monitorare rapporti matematici tra parametri medici.**

---

## 🎯 FUNZIONALITÀ

### 1. **Nuovi Parametri Aggiunti**

**Sodiemia:**
- Unità: mmol/L
- Range Standard: 135 - 145 mmol/L
- Categoria: Elettroliti

**Azotemia:**
- Unità: mg/dL
- Range Standard: 15 - 50 mg/dL
- Categoria: Funzionalità Renale

---

### 2. **Rapporto Predefinito: Osmolalità Plasmatica**

```javascript
Formula: (Glicemia / 18) + (Azotemia / 2.8) + (2 * Sodiemia)
Range Standard: 291 - 299 mOsm/kg (295 ± 4)
```

**Calcolo Automatico:**
- ✅ Calcolato solo se TUTTI i parametri hanno la stessa data
- ✅ Se data diversa → Nessun calcolo (evita dati inconsistenti)
- ✅ Ricalcolo automatico quando inserisci nuove misurazioni

**Esempio:**
```
Data: 15/02/2025
├─ Glicemia: 90 mg/dL  ✓
├─ Azotemia: 30 mg/dL  ✓
└─ Sodiemia: 140 mmol/L ✓

→ Osmolalità = (90/18) + (30/2.8) + (2*140) = 295.7 mOsm/kg ✓

Data: 16/02/2025
├─ Glicemia: 88 mg/dL  ✓
└─ Sodiemia: 142 mmol/L ✓
    (Azotemia mancante ✗)

→ Osmolalità NON calcolata ✗
```

---

### 3. **Formula Builder Drag & Drop**

**Elementi Disponibili:**
- 📊 **Parametro** - Qualsiasi parametro configurato
- 🧮 **Rapporto** - Altri rapporti già creati (nesting!)
- 🔢 **Numero** - Costanti numeriche (es: 2, 18, 2.8)

**Operatori Aritmetici:**
- ➕ Addizione (+)
- ➖ Sottrazione (-)
- ✖️ Moltiplicazione (*)
- ➗ Divisione (/)

**Ordine Operazioni:**
```
Rispetta precedenza matematica standard:
1. Moltiplicazione e Divisione (prima)
2. Addizione e Sottrazione (dopo)

Esempio: 2 + 3 * 4 = 2 + 12 = 14 ✓
```

**Riordino Elementi:**
- ⬆️ Sposta elemento su
- ⬇️ Sposta elemento giù
- 🗑️ Elimina elemento

---

### 4. **Rapporti da Rapporti (Nesting)**

**Esempio Pratico:**

```
Rapporto Base: "Rapporto A"
└─ Formula: Glicemia / Sodiemia

Rapporto Derivato: "Rapporto B"
└─ Formula: (Rapporto A) * 100

Rapporto Complesso: "Rapporto C"
└─ Formula: (Rapporto B) + Azotemia
```

**Calcolo Intelligente:**
```
Sistema risolve automaticamente dipendenze:
1. Calcola Rapporto A
2. Usa risultato per Rapporto B
3. Usa risultato B per Rapporto C

Ordine: A → B → C ✓
```

---

### 5. **Grafico Andamento Temporale**

**Features:**
- 📈 Grafico lineare cartesiano
- 📅 Asse X: Date (formato gg/mm)
- 📊 Asse Y: Valore rapporto
- 🟢 Range standard visualizzato (linee rosse tratteggiate)
- 🎯 Punti colorati (verde = in range, rosso = fuori range)
- 🔍 Tooltip dettagliato al hover:
  - Data completa
  - Valore esatto
  - Unità misura
  - Stato (in/fuori range)

---

### 6. **Gestione Rapporti**

**Lista Rapporti:**
- 📋 Visualizza tutti i rapporti
- 🎨 Codice colore personalizzato
- 📊 Ultimo valore calcolato
- ✅ Stato in/fuori range
- 🔢 Numero misurazioni totali

**Azioni:**
- ➕ Crea nuovo rapporto
- ✏️ Modifica rapporto esistente
- 🗑️ Elimina rapporto
- 📊 Visualizza grafico e storico

---

## 📊 INTERFACCIA UTENTE

### Layout Pagina Ratio:

```
┌─────────────────────────────────────────────────┐
│ 🧮 Rapporti tra Parametri    [+ Nuovo Rapporto]│
├─────────────────┬───────────────────────────────┤
│ LISTA RAPPORTI  │ GRAFICO E DETTAGLI            │
│                 │                               │
│ 📊 Osmolalità   │ ┌───────────────────────────┐ │
│ Plasmatica      │ │ 🧮 Osmolalità Plasmatica  │ │
│ 295.7 mOsm/kg   │ │                           │ │
│ ✓ In range      │ │ Formula:                  │ │
│ [✏️][🗑️]        │ │ (Glicemia/18)+...         │ │
│                 │ │                           │ │
│ 📊 Rapporto X   │ │ Range: 291-299 mOsm/kg    │ │
│ Custom...       │ │                           │ │
│                 │ │ ┌─────────────────────┐   │ │
│ [+ Nuovo]       │ │ │   GRAFICO LINEARE   │   │ │
│                 │ │ │   📈               │   │ │
│                 │ │ │                     │   │ │
│                 │ │ └─────────────────────┘   │ │
│                 │ │                           │ │
│                 │ │ STORICO VALORI:           │ │
│                 │ │ 15/02  295.7  ✓ In range  │ │
│                 │ │ 10/02  297.2  ✓ In range  │ │
│                 │ └───────────────────────────┘ │
└─────────────────┴───────────────────────────────┘
```

---

### Formula Builder Modal:

```
┌─────────────────────────────────────────────┐
│ Nuovo Rapporto                          ✕  │
├─────────────────────────────────────────────┤
│                                             │
│ Nome: [Osmolalità Plasmatica        ]      │
│ Unità: [mOsm/kg                     ]      │
│                                             │
│ Range Standard:                             │
│ Min: [291    ]  Max: [299    ]             │
│                                             │
│ Colore: [🎨]                                │
│                                             │
│ Formula:                                    │
│ [+ Parametro][+ Rapporto][+ Numero]        │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ [↑↓] [/] [Glicemia      ▼] 📊 [🗑️]  │  │
│ │ [↑↓] [+] [18           ] 🔢 [🗑️]    │  │
│ │ [↑↓] [/] [Azotemia      ▼] 📊 [🗑️]  │  │
│ │ [↑↓] [+] [2.8          ] 🔢 [🗑️]    │  │
│ │ [↑↓] [*] [2            ] 🔢 [🗑️]    │  │
│ │ [↑↓] [+] [Sodiemia      ▼] 📊 [🗑️]  │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ Anteprima Formula:                          │
│ (Glicemia/18) + (Azotemia/2.8) +           │
│ (2*Sodiemia)                                │
│                                             │
│ [Annulla]           [Crea Rapporto]        │
└─────────────────────────────────────────────┘
```

---

## 🔧 ARCHITETTURA TECNICA

### File Creati/Modificati:

```
src/
├── context/
│   ├── MedicalContext.jsx (modificato)
│   │   └── + Sodiemia, Azotemia
│   └── RatioContext.jsx (nuovo) ⭐
│       ├── State ratios
│       ├── State calculatedRatios
│       ├── calculateRatioValue()
│       ├── calculateRatiosForDate()
│       ├── recalculateAllRatios()
│       └── getRatioValues()
├── pages/
│   └── Ratio.jsx (nuovo) ⭐
│       ├── Lista rapporti
│       ├── Grafico andamento
│       ├── Storico valori
│       └── Gestione CRUD
├── components/
│   ├── Header.jsx (modificato)
│   │   └── + Link "Ratio"
│   └── RatioBuilder.jsx (nuovo) ⭐
│       ├── Formula builder
│       ├── Drag & drop elementi
│       ├── Operatori aritmetici
│       └── Anteprima formula
└── App.js (modificato)
    └── + RatioProvider, Route /ratio
```

---

### RatioContext API:

```javascript
// State
ratios[]              // Definizioni rapporti
calculatedRatios[]    // Valori calcolati

// Methods
addRatio(ratio)       // Crea nuovo rapporto
updateRatio(id, data) // Aggiorna rapporto
deleteRatio(id)       // Elimina rapporto

// Calcolo
calculateRatioValue(formula, measurements, date, ratios, calcRatios)
  // Returns: number | null

calculateRatiosForDate(date, measurements, patientId)
  // Returns: calculatedRatio[]

recalculateAllRatios(measurements, patientId)
  // Ricalcola tutti per tutte le date

getRatioValues(ratioId, patientId)
  // Returns: calculatedRatio[] ordinati per data
```

---

### Struttura Dati:

**Ratio Definition:**
```javascript
{
  id: 'ratio_1',
  name: 'Osmolalità Plasmatica',
  formula: [
    { type: 'parameter', value: 'Glicemia', operator: '/' },
    { type: 'number', value: 18, operator: '+' },
    { type: 'parameter', value: 'Azotemia', operator: '/' },
    { type: 'number', value: 2.8, operator: '+' },
    { type: 'number', value: 2, operator: '*' },
    { type: 'parameter', value: 'Sodiemia', operator: null }
  ],
  unit: 'mOsm/kg',
  standardRange: { min: 291, max: 299 },
  color: '#8b5cf6',
  description: '(Glicemia/18) + (Azotemia/2.8) + (2*Sodiemia)',
  isCustom: false
}
```

**Calculated Ratio:**
```javascript
{
  id: 'calc_1708354321_0.123',
  ratioId: 'ratio_1',
  ratioName: 'Osmolalità Plasmatica',
  value: 295.7,
  date: '2025-02-15',
  patientId: 'patient_1',
  timestamp: 1708354321000
}
```

---

## 🧮 ALGORITMO CALCOLO

### 1. Match Date:

```javascript
// Per ogni data unica nelle misurazioni
uniqueDates.forEach(date => {
  // Per ogni rapporto configurato
  ratios.forEach(ratio => {
    // Verifica TUTTI i parametri hanno valore per questa data
    const allParamsPresent = ratio.formula.every(element => {
      if (element.type === 'parameter') {
        return measurements.some(m => 
          m.parameter === element.value && m.date === date
        )
      }
      return true // Number e Ratio sempre "presenti"
    })
    
    if (allParamsPresent) {
      calculateAndStore(ratio, date)
    }
  })
})
```

### 2. Risoluzione Dipendenze:

```javascript
// Ordina rapporti per dipendenze
const sortedRatios = ratios.sort((a, b) => {
  const aUsesRatio = a.formula.some(el => el.type === 'ratio')
  const bUsesRatio = b.formula.some(el => el.type === 'ratio')
  return aUsesRatio - bUsesRatio
  // false (0) < true (1) → rapporti semplici prima
})

// Calcola in ordine
sortedRatios.forEach(ratio => {
  // Passa ratios già calcolati per questa data
  const value = calculateRatioValue(
    ratio.formula,
    measurements,
    date,
    ratios,
    alreadyCalculated // ← Rapporti già calcolati per nesting
  )
})
```

### 3. Valutazione Formula:

```javascript
function calculateRatioValue(formula, measurements, date, ratios, calcRatios) {
  let result = 0
  let currentOperator = '+'
  let pendingValue = null
  let pendingOperator = null
  
  // Per ogni elemento nella formula
  for (const item of formula) {
    let value
    
    // Ottieni valore elemento
    if (item.type === 'parameter') {
      const m = measurements.find(
        m => m.parameter === item.value && m.date === date
      )
      if (!m) return null // Parametro mancante
      value = m.value
    } else if (item.type === 'ratio') {
      const cr = calcRatios.find(
        cr => cr.ratioId === item.value && cr.date === date
      )
      if (!cr) return null // Rapporto mancante
      value = cr.value
    } else if (item.type === 'number') {
      value = item.value
    }
    
    // Gestisce precedenza operatori
    // Moltiplicazione/Divisione hanno precedenza
    if (item.operator === '*' || item.operator === '/') {
      if (pendingValue !== null) {
        value = pendingOperator === '*'
          ? pendingValue * value
          : pendingValue / value
        pendingValue = null
        pendingOperator = null
      }
      
      // Controlla prossimo operatore
      const nextItem = formula[i + 1]
      if (nextItem && (nextItem.operator === '*' || nextItem.operator === '/')) {
        pendingValue = value
        pendingOperator = item.operator
        continue
      }
    }
    
    // Applica addizione/sottrazione
    result = currentOperator === '+' ? result + value : result - value
    currentOperator = item.operator
  }
  
  return result
}
```

---

## 💡 ESEMPI PRATICI

### Esempio 1: Rapporto Semplice

```javascript
Rapporto: "Rapporto Glicemia/Sodiemia"
Formula:
  1. Glicemia (parametro)
  2. / (divisione)
  3. Sodiemia (parametro)

Misurazioni 15/02/2025:
  - Glicemia: 90 mg/dL
  - Sodiemia: 140 mmol/L

Calcolo: 90 / 140 = 0.64 ✓
```

### Esempio 2: Rapporto con Costanti

```javascript
Rapporto: "Index Personalizzato"
Formula:
  1. Glicemia (parametro)
  2. * (moltiplicazione)
  3. 2.5 (numero)
  4. + (addizione)
  5. Colesterolo (parametro)
  6. / (divisione)
  7. 10 (numero)

Misurazioni 15/02/2025:
  - Glicemia: 90 mg/dL
  - Colesterolo: 180 mg/dL

Calcolo: (90 * 2.5) + (180 / 10) = 225 + 18 = 243 ✓
```

### Esempio 3: Rapporto Nested

```javascript
Rapporto A: "Base"
Formula: Glicemia / 18
Risultato (15/02): 90 / 18 = 5.0

Rapporto B: "Derivato"
Formula: 
  1. Rapporto A (rapporto)
  2. * (moltiplicazione)
  3. Sodiemia (parametro)

Misurazioni 15/02/2025:
  - Rapporto A: 5.0 (calcolato)
  - Sodiemia: 140 mmol/L

Calcolo: 5.0 * 140 = 700 ✓
```

### Esempio 4: Date Non Matching

```javascript
Rapporto: "Osmolalità"
Richiede: Glicemia + Azotemia + Sodiemia

Misurazioni:
  15/02/2025:
    - Glicemia: 90 ✓
    - Sodiemia: 140 ✓
    (Azotemia mancante ✗)
  
  16/02/2025:
    - Azotemia: 30 ✓
    (Glicemia e Sodiemia mancanti ✗)

Risultato:
  - 15/02: NON calcolato (manca Azotemia)
  - 16/02: NON calcolato (mancano Glicemia e Sodiemia)
  
Soluzione:
  - Inserisci tutti e 3 i parametri con stessa data
  - Sistema calcola automaticamente ✓
```

---

## 🎯 CASI D'USO

### Caso 1: Monitoraggio Osmolalità

```
Operatore:
1. Inserisce Glicemia, Azotemia, Sodiemia (stessa data)
2. Sistema calcola automaticamente Osmolalità
3. Vede grafico andamento
4. Identifica trend (stabile, crescente, decrescente)
5. Export PDF con grafico per medico
```

### Caso 2: Rapporto Custom Tiroide

```
Operatore crea: "T3/T4 Ratio"
1. Click "Nuovo Rapporto"
2. Nome: "Rapporto T3/T4"
3. Formula Builder:
   - T3 (parametro)
   - / (divisione)
   - T4 (parametro)
4. Range: 0.3 - 0.5
5. Salva
6. Sistema calcola automaticamente per date esistenti
7. Monitor andamento nel tempo
```

### Caso 3: Indice Complesso Multi-Parametro

```
Operatore crea: "Indice Rischio Cardiovascolare"
Formula: (Colesterolo Totale / HDL) * (Glicemia / 18)

1. Definisce rapporto base: "Rapporto Col/HDL"
2. Definisce rapporto base: "Glicemia mmol/L"
3. Crea rapporto finale usando i 2 precedenti
4. Range personalizzato: 0 - 5 (basso rischio)
5. Monitor paziente nel tempo
```

---

## 🔄 WORKFLOW COMPLETO

### 1. Inserimento Misurazioni:

```
Dashboard → Inserisci Misurazione
├─ Data: 15/02/2025
├─ Glicemia: 90 mg/dL → Salva ✓
├─ Azotemia: 30 mg/dL → Salva ✓
└─ Sodiemia: 140 mmol/L → Salva ✓
     ↓
Sistema ricalcola automaticamente TUTTI i rapporti
     ↓
Ratio → Osmolalità Plasmatica
  Nuovo valore: 295.7 mOsm/kg ✓
  In range: ✓ (291-299)
```

### 2. Creazione Rapporto Custom:

```
Ratio → [+ Nuovo Rapporto]
  ↓
Modal Formula Builder
  ├─ Nome: "Mio Rapporto"
  ├─ Unità: "unità"
  ├─ Range: Min-Max (opzionale)
  ├─ Colore: [Scegli]
  └─ Formula Builder:
      ├─ [+ Parametro] → Scegli da dropdown
      ├─ Operator: +, -, *, /
      ├─ [+ Numero] → Inserisci costante
      ├─ [+ Rapporto] → Scegli rapporto esistente
      ├─ [↑↓] Riordina elementi
      └─ [🗑️] Elimina elemento
  ↓
[Crea Rapporto]
  ↓
Sistema calcola automaticamente per tutte le date
  ↓
Vedi risultati immediatamente in grafico
```

### 3. Modifica Rapporto Esistente:

```
Ratio → Lista → Rapporto X → [✏️]
  ↓
Modal pre-compilato
  ↓
Modifica formula/range
  ↓
[Aggiorna]
  ↓
Sistema ricalcola TUTTI i valori storici
  ↓
Grafico aggiornato istantaneamente
```

---

## 📊 STORAGE

### localStorage Keys:

```javascript
'medicalRatios'     // Definizioni rapporti
'calculatedRatios'  // Valori calcolati
```

### Export/Import:

```javascript
// Export include rapporti in JSON export
exportData() {
  parameters: [...],
  measurements: [...],
  ratios: [...],           // ← Nuovo
  calculatedRatios: [...]  // ← Nuovo
}

// Import ripristina tutto
importData(json)
```

---

## ✅ TESTING

### Test 1: Osmolalità Plasmatica

```javascript
1. Inserisci misurazioni (stessa data):
   - Glicemia: 90 mg/dL
   - Azotemia: 30 mg/dL
   - Sodiemia: 140 mmol/L

2. Vai Ratio → Osmolalità Plasmatica

3. Verifica:
   ✓ Valore calcolato: 295.7 mOsm/kg
   ✓ Stato: "In range" (verde)
   ✓ Grafico mostra punto
   ✓ Tabella mostra valore

Calcolo manuale:
(90/18) + (30/2.8) + (2*140)
= 5.0 + 10.7 + 280
= 295.7 ✓ CORRETTO
```

### Test 2: Date Non Matching

```javascript
1. Inserisci:
   - 15/02: Glicemia 90
   - 15/02: Sodiemia 140
   - 16/02: Azotemia 30 (data diversa!)

2. Vai Ratio → Osmolalità

3. Verifica:
   ✓ Nessun valore calcolato
   ✓ Messaggio: "Inserisci parametri stessa data"

4. Aggiungi:
   - 15/02: Azotemia 30

5. Verifica:
   ✓ Ora calcola 295.7 ✓ CORRETTO
```

### Test 3: Rapporto Custom

```javascript
1. Crea rapporto: "Test Ratio"
   Formula: Glicemia / Sodiemia

2. Formula Builder:
   - [Glicemia] [/] [Sodiemia]

3. Salva

4. Inserisci:
   - 15/02: Glicemia 90, Sodiemia 140

5. Verifica:
   ✓ Valore: 0.64
   ✓ Grafico mostra punto ✓ CORRETTO
```

### Test 4: Nesting

```javascript
1. Crea "Rapporto A":
   Formula: Glicemia / 18

2. Crea "Rapporto B":
   Formula: (Rapporto A) * Sodiemia

3. Inserisci:
   - 15/02: Glicemia 90, Sodiemia 140

4. Verifica:
   Rapporto A: 90/18 = 5.0 ✓
   Rapporto B: 5.0*140 = 700 ✓ CORRETTO
```

---

## 📚 DOCUMENTAZIONE UTENTE

### Come Creare un Rapporto:

```
1. Vai alla scheda "Ratio"
2. Click "Nuovo Rapporto"
3. Compila:
   - Nome descrittivo
   - Unità di misura
   - Range standard (opzionale)
   - Scegli colore
4. Costruisci formula:
   - Aggiungi parametri/numeri/rapporti
   - Scegli operatori (+, -, *, /)
   - Riordina con frecce
   - Rimuovi elementi non voluti
5. Anteprima formula
6. Click "Crea Rapporto"
7. ✓ Calcoli automatici per tutte le date!
```

### Come Leggere il Grafico:

```
- Linea colorata: Andamento rapporto
- Linee rosse tratteggiate: Range min/max
- Punti verdi: Valore in range ✓
- Punti rossi: Valore fuori range ✗
- Hover punto: Dettagli completi
```

---

**Status:** ✅ FEATURE COMPLETA  
**Versione:** 4.3.0 - Ratio System  
**File Modificati:** 7  
**File Creati:** 3 (RatioContext, Ratio.jsx, RatioBuilder.jsx)  
**Testing:** Pronto  
**Deploy:** Compatibile Netlify/VPS  

🎯 **Sistema rapporti completo con nesting, calcolo automatico date matching, e formula builder visual!**
