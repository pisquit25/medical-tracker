# 🎯 FEATURE: RANGE MULTIPLI PER PARAMETRI

## ✨ IMPLEMENTAZIONE COMPLETA

Sistema completo di **range multipli** basati su **sesso ed età** per ogni parametro! 🚀

---

## 📍 DOVE TROVARLA

**Impostazioni → Gestione Parametri → Click 🎚️ "Sliders" su un parametro**

Nuovo pulsante viola con icona Sliders accanto a Modifica ed Elimina.

---

## 🎯 PROBLEMA RISOLTO

### Prima:
- ❌ Un solo range standard per parametro (es: Testosterone 300-1000)
- ❌ Stesso range per uomini e donne
- ❌ Stesso range per giovani e anziani
- ❌ Range non realistici per la popolazione specifica

### Ora:
- ✅ Range multipli per parametro
- ✅ Range diversi per Maschio/Femmina
- ✅ Range diversi per fasce d'età
- ✅ Range combinati (es: Donna 40-60 anni)
- ✅ Selezione automatica in base al paziente
- ✅ Fallback a range default se nessuno match

---

## ✨ FUNZIONALITÀ

### 1. **Range Standard (Default)**

Sempre presente, usato quando nessun range personalizzato matcha.

**Esempio Testosterone:**
```
Range Standard: 300-1000 ng/dL
Valido per: Tutti (default)
```

### 2. **Range Personalizzati**

Aggiungi quanti range vuoi con condizioni specifiche!

**Esempio Testosterone - Range Multipli:**
```
Range #1: 450-900 ng/dL
Applicabile a: Maschio, 18-40 anni
Descrizione: Uomini giovani adulti

Range #2: 250-700 ng/dL
Applicabile a: Maschio, 41-65 anni
Descrizione: Uomini di mezza età

Range #3: 200-500 ng/dL
Applicabile a: Maschio, ≥66 anni
Descrizione: Uomini anziani

Range #4: 15-70 ng/dL
Applicabile a: Femmina
Descrizione: Donne (tutte le età)
```

### 3. **Tipi di Filtri**

**Nessuno (default):**
- Range valido per tutti
- Usato come fallback

**Solo Sesso:**
- Range specifico per M o F
- Es: Testosterone Donne vs Uomini

**Solo Età:**
- Range per fascia d'età
- Es: Bambini, Adulti, Anziani
- Min: "≥18 anni"
- Max: "≤65 anni"
- Range: "18-65 anni"

**Sesso E Età:**
- Combinazione entrambi
- Massima specificità
- Es: Donna 40-60 anni (menopausa)

---

## 🎨 INTERFACCIA

### Modal Gestione Range:

```
┌──────────────────────────────────────────────────────┐
│ Range Multipli                                    ✕  │
│ Testosterone - Range in base a sesso ed età          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌─ Range Standard (Default) ────────────────────┐   │
│ │ 300 - 1000 ng/dL                              │   │
│ │ Valido per: Tutti (default)                   │   │
│ └───────────────────────────────────────────────┘   │
│                                                      │
│ Range Personalizzati          [+ Aggiungi Range]    │
│                                                      │
│ ┌─ Range #1 ──────────────────────────────────┐     │
│ │ Maschio, 18-40 anni                         │     │
│ │ 450 - 900 ng/dL                      ✏️ 🗑️  │     │
│ │ Uomini giovani adulti                       │     │
│ └─────────────────────────────────────────────┘     │
│                                                      │
│ ┌─ Range #2 ──────────────────────────────────┐     │
│ │ Maschio, 41-65 anni                         │     │
│ │ 250 - 700 ng/dL                      ✏️ 🗑️  │     │
│ │ Uomini di mezza età                         │     │
│ └─────────────────────────────────────────────┘     │
│                                                      │
│ ┌─ Range #3 ──────────────────────────────────┐     │
│ │ Femmina                                     │     │
│ │ 15 - 70 ng/dL                        ✏️ 🗑️  │     │
│ │ Donne (tutte le età)                        │     │
│ └─────────────────────────────────────────────┘     │
│                                                      │
│ [Chiudi]                                            │
└──────────────────────────────────────────────────────┘
```

### Form Aggiungi/Modifica Range:

```
┌─ Nuovo Range ────────────────────────────────────┐
│                                                  │
│ Valore Minimo *    Valore Massimo *              │
│ [450_______]       [900_______]                  │
│                                                  │
│ Applicabile a:                                   │
│ [Sesso E Età  ▼]                                 │
│                                                  │
│ Sesso *                                          │
│ [Maschio      ▼]                                 │
│                                                  │
│ Età Minima         Età Massima                   │
│ [18________]       [40________]                  │
│                                                  │
│ Descrizione (opzionale)                          │
│ [Uomini giovani adulti_________________]         │
│                                                  │
│ [💾 Aggiungi]  [Annulla]                         │
└──────────────────────────────────────────────────┘
```

---

## 🔄 WORKFLOW COMPLETO

### Esempio: Testosterone con Range Multipli

```
1. Impostazioni → Gestione Parametri

2. Trova "Testosterone" (o aggiungilo se non c'è)

3. Click 🎚️ Sliders → Modal si apre

4. Vedi Range Standard: 300-1000 ng/dL (default)

5. Click "+ Aggiungi Range"

6. Compila Form #1:
   - Min: 450, Max: 900
   - Applicabile a: Sesso E Età
   - Sesso: Maschio
   - Età Min: 18, Max: 40
   - Descrizione: Uomini giovani adulti
   - Click "Aggiungi"

7. Range #1 appare nella lista

8. Ripeti per altri range:
   
   Range #2:
   - Min: 250, Max: 700
   - Sesso: Maschio, Età: 41-65
   - Desc: Uomini mezza età
   
   Range #3:
   - Min: 200, Max: 500
   - Sesso: Maschio, Età: ≥66
   - Desc: Uomini anziani
   
   Range #4:
   - Min: 15, Max: 70
   - Sesso: Femmina
   - Desc: Donne

9. Chiudi modal

10. In lista parametri vedi:
    "Range Standard: 300-1000 + 4 range personalizzati"
```

---

## 🎯 SELEZIONE AUTOMATICA

### Come Funziona:

Quando visualizzi i dati di un paziente, il sistema:

1. **Calcola l'età** del paziente dalla data di nascita
2. **Controlla ogni range personalizzato** in ordine
3. **Verifica le condizioni:**
   - Se range richiede sesso → Controlla sesso paziente
   - Se range richiede età → Controlla se età è nel range
4. **Seleziona il primo range che matcha**
5. **Se nessuno matcha → Usa range standard**

### Esempio Pratico:

**Paziente:**
```
Nome: Mario Rossi
Sesso: Maschio
Data Nascita: 15/03/1985
Età: 40 anni (calcolata automaticamente)
```

**Range Testosterone disponibili:**
```
1. Range Standard: 300-1000 (tutti)
2. Range #1: 450-900 (Maschio 18-40) ← MATCH! ✅
3. Range #2: 250-700 (Maschio 41-65)
4. Range #3: 15-70 (Femmina)
```

**Risultato:**
```
✅ Usato Range #1: 450-900 ng/dL
Perché:
- Paziente è Maschio ✅
- Età 40 è in range 18-40 ✅
```

**Se paziente avesse 42 anni:**
```
✅ Usato Range #2: 250-700 ng/dL
Perché:
- Range #1 non matcha (età 42 > 40)
- Range #2 matcha (Maschio, età 42 in 41-65)
```

**Se paziente fosse donna:**
```
✅ Usato Range #3: 15-70 ng/dL
Perché:
- Range #1 e #2 non matchano (sesso diverso)
- Range #3 matcha (Femmina)
```

---

## 📊 CASI D'USO REALI

### 1. **Testosterone (sesso + età)**

```
Range Standard: 300-1000 ng/dL (default)

Range Personalizzati:
- M 18-40: 450-900 ng/dL
- M 41-65: 250-700 ng/dL
- M ≥66: 200-500 ng/dL
- F: 15-70 ng/dL
```

### 2. **Emoglobina (solo sesso)**

```
Range Standard: 12-16 g/dL (default)

Range Personalizzati:
- M: 13.5-17.5 g/dL
- F: 12-15.5 g/dL
```

### 3. **Pressione Arteriosa (solo età)**

```
Range Standard: 120/80 mmHg (default)

Range Personalizzati:
- 0-18: 110/70 mmHg (bambini/adolescenti)
- 19-40: 120/80 mmHg (giovani adulti)
- 41-60: 130/85 mmHg (mezza età)
- ≥61: 140/90 mmHg (anziani)
```

### 4. **PSA (solo sesso + età)**

```
Range Standard: 0-4 ng/mL (default)

Range Personalizzati:
- M 40-49: 0-2.5 ng/mL
- M 50-59: 0-3.5 ng/mL
- M 60-69: 0-4.5 ng/mL
- M ≥70: 0-6.5 ng/mL
- F: Non applicabile (range non mostrato)
```

---

## 🧪 TESTING

### Test 1: Aggiungi Range Testosterone

```
1. Impostazioni → Gestione Parametri

2. Aggiungi parametro "Testosterone"
   - Unità: ng/dL
   - Range Standard: 300-1000

3. Click 🎚️ Sliders su Testosterone

4. Click "+ Aggiungi Range"

5. Compila:
   - Min: 450, Max: 900
   - Applicabile: Sesso
   - Sesso: Maschio
   - Descrizione: Uomini

6. Aggiungi

7. Verifica:
   ✅ Range appare in lista
   ✅ Etichetta: "Maschio"
   ✅ Valori: 450-900 ng/dL
```

### Test 2: Range Età

```
1. Stesso parametro Testosterone

2. Aggiungi Range:
   - Min: 200, Max: 500
   - Applicabile: Solo Età
   - Età Min: 66
   - (lascia Max vuoto = ≥66)
   - Descrizione: Anziani

3. Aggiungi

4. Verifica:
   ✅ Etichetta: "≥66 anni"
   ✅ Valori: 200-500 ng/dL
```

### Test 3: Range Combinato

```
1. Aggiungi Range:
   - Min: 250, Max: 700
   - Applicabile: Sesso E Età
   - Sesso: Maschio
   - Età Min: 41, Max: 65
   - Descrizione: Mezza età

2. Aggiungi

3. Verifica:
   ✅ Etichetta: "Maschio, 41-65 anni"
   ✅ Valori: 250-700 ng/dL
```

### Test 4: Selezione Automatica

```
1. Pazienti → Aggiungi paziente:
   - Nome: Test
   - Sesso: Maschio
   - Data Nascita: 15/03/1990 (34 anni)

2. Dashboard → Inserisci misurazione:
   - Parametro: Testosterone
   - Valore: 600 ng/dL

3. Analytics → Testosterone

4. Verifica:
   ✅ Grafico usa range "Maschio, 18-40" (450-900)
   ✅ Non usa range standard (300-1000)
   ✅ Valore 600 appare nel range corretto
```

### Test 5: Fallback a Default

```
1. Paziente non specificato o senza data nascita

2. Analytics → Testosterone

3. Verifica:
   ✅ Grafico usa range standard (300-1000)
   ✅ Messaggio: "Usando range standard (paziente non specificato)"
```

---

## 📋 STRUTTURA DATI

### Parameter con Range Rules:

```javascript
{
  id: 'param_testosterone',
  name: 'Testosterone',
  unit: 'ng/dL',
  standardRange: { min: 300, max: 1000 },
  rangeRules: [
    {
      id: 'rule_1',
      range: { min: 450, max: 900 },
      conditions: {
        sesso: 'M',
        minAge: 18,
        maxAge: 40
      },
      description: 'Uomini giovani adulti'
    },
    {
      id: 'rule_2',
      range: { min: 15, max: 70 },
      conditions: {
        sesso: 'F'
      },
      description: 'Donne'
    }
  ]
}
```

### Funzione Selezione Range:

```javascript
getApplicableRange(parameter, patient)

// Input:
parameter = { ...con rangeRules }
patient = { sesso: 'M', dataNascita: '1990-03-15' }

// Output:
{ min: 450, max: 900 } // Range più specifico che matcha
```

---

## 🔧 FILE MODIFICATI

### Nuovi File:
1. **src/components/RangeRuleManager.jsx** (450 righe)
   - Modal gestione range multipli
   - Form aggiungi/modifica
   - Lista con expand
   - Validazione condizioni

### File Modificati:
2. **src/context/MedicalContext.jsx**
   - Aggiunto `rangeRules: []` a defaultParameters
   - Funzione `getApplicableRange(parameter, patient)`
   - Funzioni `addRangeRule`, `updateRangeRule`, `deleteRangeRule`
   - Export nuove funzioni

3. **src/components/ParameterManager.jsx**
   - Import RangeRuleManager
   - Pulsante 🎚️ Sliders per ogni parametro
   - Indicatore "+ X range personalizzati"
   - Modal integration

---

## ⚠️ NOTA IMPORTANTE

**Il sistema è implementato ma NON ancora integrato completamente!**

### Cosa Funziona:
- ✅ Gestione range multipli in Impostazioni
- ✅ Aggiunta/Modifica/Eliminazione range
- ✅ Visualizzazione range personalizzati
- ✅ Funzione `getApplicableRange()` disponibile

### Cosa Serve Ancora:
- ⚠️ **Chart.jsx** deve usare `getApplicableRange()` invece di `standardRange`
- ⚠️ **StatusOverview.jsx** deve usare `getApplicableRange()`
- ⚠️ Ogni componente che mostra range deve essere aggiornato

### Prossimi Passi:

1. **Trova tutti gli usi di `standardRange`:**
```bash
grep -r "standardRange" src/components/
grep -r "standardRange" src/pages/
```

2. **Sostituisci con `getApplicableRange()`:**
```javascript
// PRIMA:
const range = parameter.standardRange;

// DOPO:
const range = getApplicableRange(parameter, activePatient);
```

3. **Passa paziente attivo:**
```javascript
import { usePatients } from '../context/PatientContext';
const { getActivePatient } = usePatients();
const activePatient = getActivePatient();
```

---

## 🚀 DEPLOY

```bash
1. Estrai medical-tracker-v4.3.0-MULTIPLE-RANGES.zip
2. npm install
3. npm start
4. Test: Impostazioni → Parametri → Sliders
5. npm run build
6. git push
```

---

## ✅ CHECKLIST

- [x] Struttura dati rangeRules
- [x] Funzione getApplicableRange()
- [x] Funzioni CRUD range rules
- [x] Componente RangeRuleManager
- [x] Integrazione ParameterManager
- [x] Pulsante Sliders
- [x] Indicatore range count
- [x] Form aggiungi/modifica
- [x] Validazione condizioni
- [x] Selezione automatica range
- [ ] Integrazione Chart.jsx
- [ ] Integrazione StatusOverview.jsx
- [ ] Testing completo selezione

---

**✨ Sistema Range Multipli Implementato!**  
**⚠️ Serve integrazione nei componenti che visualizzano i range!**  

**La base è pronta - ora serve collegare tutto!** 🚀
