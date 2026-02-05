# 🔧 FEATURE v4.2.0 - Controllo Manuale Include/Escludi Formula

## ✅ NUOVA FUNZIONALITÀ

**Controllo manuale per includere/escludere misurazioni dal calcolo del range personalizzato direttamente dal calendario in Analytics.**

---

## 🎯 CASO D'USO

### Scenario:
```
Operatore inserisce misurazione ma NON vuole che entri nel calcolo del range:
- Errore di misurazione
- Valore durante malattia temporanea
- Test di un nuovo farmaco (fase sperimentale)
- Misurazione in condizioni anomale
```

### Soluzione:
```
✅ Checkbox nel dettaglio misurazione (calendario Analytics)
✅ Toggle manuale: includi/escludi
✅ Ricalcolo automatico range personalizzato
✅ Indicatori visivi nel calendario
```

---

## 📊 INTERFACCIA UTENTE

### 1. **Calendario con Indicatori Visivi**

```
┌─────────────────────────────────────────────┐
│ GENNAIO 2025                                │
├─────────────────────────────────────────────┤
│ L  M  M  G  V  S  D                         │
│ 1  2  3  4  5  6  7                         │
│ 🟢 🟢 🟡 🔴 🟢 🟢 🟢  ← Valori normali      │
│ 88 90 105 250 92 89 91                      │
│                                             │
│ 8  9  10 11 12 13 14                        │
│ 🔴 🟢 🟢 🟢 🟢 🟢 🟢                         │
│ 180◦91 88 90 92 89 87   ◦ = Esclusa!      │
│  ↑ Valore escluso (opaco, bordo tratteggiato, pallino bianco)
│                                             │
└─────────────────────────────────────────────┘

Legenda:
🟢 Ottimale       = In entrambi i range
🟡 Attenzione     = In un solo range
🔴 Critico        = Fuori da entrambi
🔵◦ Esclusa       = Opaca, bordo tratteggiato, pallino bianco
```

**Indicatori Visivi Misurazione Esclusa:**
- ✅ **Opacità 50%** - Meno visibile
- ✅ **Bordo tratteggiato** - Diverso dalle incluse
- ✅ **Pallino bianco** in alto a destra - Simbolo esclusione

---

### 2. **Modal Dettaglio Misurazione**

**Click su un giorno del calendario → Modal:**

```
┌─────────────────────────────────────────────┐
│ Dettaglio Misurazione                    ✕  │
├─────────────────────────────────────────────┤
│                                             │
│ Data                                        │
│ Venerdì, 8 gennaio 2025                     │
│                                             │
│ Valore                                      │
│ 180 mg/dL                                   │
│                                             │
│ Stato                                       │
│ 🔴 Critico                                  │
│                                             │
│ Verifica Range                              │
│ Range Standard:       ✗ NO                  │
│ Range Personalizzato: ✗ NO                  │
│                                             │
│ ╔═══════════════════════════════════════╗  │
│ ║ Calcolo Range Personalizzato         ║  │
│ ╠═══════════════════════════════════════╣  │
│ ║ ☐ ✗ Esclusa dal calcolo               ║  │ ← CHECKBOX!
│ ║                                       ║  │
│ ║ Questa misurazione è esclusa dal      ║  │
│ ║ calcolo. Il range personalizzato sarà ║  │
│ ║ calcolato senza questo valore.        ║  │
│ ║ Seleziona per includerla nuovamente.  ║  │
│ ╚═══════════════════════════════════════╝  │
│                                             │
│ [Chiudi]                                    │
└─────────────────────────────────────────────┘
```

**Quando checkbox è SELEZIONATO (inclusa):**
```
☑ ✓ Inclusa nel calcolo

Questa misurazione viene usata per calcolare
il setpoint e il range personalizzato.
Deseleziona per escluderla (es: valore 
anomalo, errore di misurazione).
```

**Quando checkbox è DESELEZIONATO (esclusa):**
```
☐ ✗ Esclusa dal calcolo

Questa misurazione è esclusa dal calcolo.
Il range personalizzato sarà calcolato senza
questo valore. Seleziona per includerla
nuovamente.
```

---

### 3. **Warning per Outlier Statistici**

**Se il valore è un outlier identificato dal sistema:**

```
☑ ✓ Inclusa nel calcolo

Questa misurazione viene usata per calcolare...

╔════════════════════════════════════════╗
║ ⚠️ Nota: Questo valore è stato        ║
║ identificato come outlier statistico   ║
║ dal sistema. Considera di escluderlo   ║
║ se sembra essere un errore di          ║
║ misurazione.                           ║
╚════════════════════════════════════════╝
```

---

## 🔧 IMPLEMENTAZIONE TECNICA

### File: `src/components/ParameterCalendarView.jsx`

**1. Import funzioni necessarie:**
```javascript
const { 
  measurements, 
  calculateCustomRange, 
  toggleIncludeInFormula,  // ← Toggle manuale
  isOutlier                 // ← Check se è outlier
} = useMedical();
```

**2. Indicatore visivo nel calendario:**
```javascript
<div className={`
  ${measurement ? `${status.color} ${status.border}` : ''}
  ${measurement && !measurement.includedInFormula 
    ? 'opacity-50 border-dashed'  // ← Opaco e tratteggiato
    : ''
  }
`}>
  {measurement.value}
  {!measurement.includedInFormula && (
    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full" />
  )}
</div>
```

**3. Checkbox nel modal:**
```javascript
<label className="flex items-start gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={selectedMeasurement.includedInFormula}
    onChange={() => {
      toggleIncludeInFormula(selectedMeasurement.id);
      setSelectedMeasurement({
        ...selectedMeasurement,
        includedInFormula: !selectedMeasurement.includedInFormula
      });
    }}
    className="w-5 h-5 text-blue-600"
  />
  <div>
    <div className="font-semibold">
      {selectedMeasurement.includedInFormula 
        ? '✓ Inclusa nel calcolo' 
        : '✗ Esclusa dal calcolo'}
    </div>
    <div className="text-xs mt-1">
      {/* Testo esplicativo */}
    </div>
  </div>
</label>
```

**4. Warning outlier (condizionale):**
```javascript
{isOutlier(selectedMeasurement.id) && 
 selectedMeasurement.includedInFormula && (
  <div className="mt-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
    ⚠️ <strong>Nota:</strong> Questo valore è stato identificato come 
    outlier statistico dal sistema. Considera di escluderlo se sembra 
    essere un errore di misurazione.
  </div>
)}
```

**5. Legenda colori:**
```javascript
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
  <div className="flex items-center gap-1.5">
    <div className="w-4 h-4 rounded bg-green-500 border-2"></div>
    <span>Ottimale</span>
  </div>
  {/* ... */}
  <div className="flex items-center gap-1.5">
    <div className="w-4 h-4 rounded bg-blue-500 border-dashed opacity-50 relative">
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
    <span>Esclusa</span>
  </div>
</div>
```

---

## 📈 WORKFLOW UTENTE

### Caso 1: Escludere Valore Anomalo

```
1. Operatore nota valore strano nel calendario (es: 250 mg/dL)
2. Click sul giorno → Modal dettaglio
3. Vede "🔴 Critico" e range check falliti
4. Vede warning: "⚠️ Identificato come outlier statistico"
5. Deseleziona checkbox "Inclusa nel calcolo"
6. Click "Chiudi"
7. Nel calendario: valore diventa opaco con bordo tratteggiato
8. Range personalizzato ricalcolato automaticamente (senza 250)
```

### Caso 2: Reincludere Valore

```
1. Operatore rivede valore escluso (opaco nel calendario)
2. Click sul giorno → Modal dettaglio
3. Checkbox deselezionato: "✗ Esclusa dal calcolo"
4. Seleziona checkbox
5. Click "Chiudi"
6. Nel calendario: valore torna normale (non opaco)
7. Range personalizzato ricalcolato (con valore incluso)
```

---

## 🎯 VANTAGGI

### Per l'Operatore:

✅ **Controllo totale** - Decide cosa includere/escludere  
✅ **Visibilità immediata** - Vede quali valori sono esclusi  
✅ **Facilità d'uso** - Un click per toggle  
✅ **Warning intelligenti** - Sistema suggerisce outlier  
✅ **Reversibile** - Può sempre reincludere  

### Per il Sistema:

✅ **Flessibilità** - Gestisce casi edge (malattia, errori)  
✅ **Accuratezza** - Range calcolato solo su dati validi  
✅ **Tracciabilità** - Ogni valore ha uno stato chiaro  
✅ **Consistenza** - Ricalcolo automatico  

---

## 🧪 TESTING

### Test 1: Esclusione Manuale

```bash
1. Vai Analytics → Click calendario parametro
2. Inserisci 10 misurazioni normali (85-95 mg/dL)
3. Inserisci 1 valore anomalo (250 mg/dL)
4. Click sul giorno con 250
5. Modal si apre
6. Verifica:
   ✓ Stato: 🔴 Critico
   ✓ Warning outlier presente
   ✓ Checkbox selezionato (inclusa)
7. Deseleziona checkbox
8. Click "Chiudi"
9. Verifica nel calendario:
   ✓ Valore 250 ora opaco (opacity-50)
   ✓ Bordo tratteggiato
   ✓ Pallino bianco in alto a destra
10. Verifica Range Personalizzato:
    ✓ Calcolato senza il 250
    ✓ Range ~80-100 (basato su 85-95)
```

### Test 2: Reinclusion

```bash
1. Dal test precedente
2. Click sul valore escluso (250, opaco)
3. Modal si apre
4. Verifica:
   ✓ Checkbox deselezionato
   ✓ Testo: "✗ Esclusa dal calcolo"
5. Seleziona checkbox
6. Click "Chiudi"
7. Verifica nel calendario:
   ✓ Valore 250 non più opaco
   ✓ Bordo solido
   ✓ Nessun pallino
8. Verifica Range Personalizzato:
   ✓ Ricalcolato CON il 250
   ✓ Range più ampio
```

### Test 3: Indicatore Visivo

```bash
1. Calendario con mix valori inclusi/esclusi
2. Verifica legenda:
   ✓ 4 icone: Ottimale, Attenzione, Critico, Esclusa
   ✓ Icona "Esclusa" mostra opacità + pallino
3. Verifica visibilità:
   ✓ Valori esclusi chiaramente distinguibili
   ✓ Pallino bianco visibile
```

---

## 💡 CASI D'USO PRATICI

### Caso 1: Errore di Misurazione
```
Misurazione: 1200 mg/dL (errore strumento)
Azione: Escludi manualmente
Risultato: Range personalizzato accurato
```

### Caso 2: Malattia Temporanea
```
Misurazioni: 3 giorni con febbre alta → valori anomali
Azione: Escludi i 3 giorni
Risultato: Range basato solo su giorni normali
```

### Caso 3: Test Farmaco
```
Misurazioni: 1 settimana test nuovo dosaggio → valori instabili
Azione: Escludi quella settimana
Risultato: Range basato su terapia stabile
```

### Caso 4: Outlier Statistico Valido
```
Sistema identifica valore come outlier
MA l'operatore sa che è corretto (stress intenso documentato)
Azione: Lascia incluso (ignora warning)
Risultato: Valore conta nel range
```

---

## 🎨 DESIGN DECISIONI

### Perché Checkbox (non Toggle/Switch):
✅ Più familiare per form medici  
✅ Chiaro stato selezionato/deselezionato  
✅ Standard UI per "include/exclude"  

### Perché Pallino Bianco:
✅ Minimale, non invasivo  
✅ Visibile su tutti i colori (verde/giallo/rosso)  
✅ Chiaro indicatore "qualcosa è diverso"  

### Perché Opacità + Bordo Tratteggiato:
✅ Opacità = "meno importante"  
✅ Tratteggiato = "non solido/non permanente"  
✅ Combinati = chiaro "escluso"  

### Perché Warning Solo per Outlier:
✅ Non disturbare se valore normale  
✅ Aiuta l'operatore a decidere  
✅ Non impone decisione (suggerisce)  

---

## 📚 DIFFERENZA CON SISTEMA AUTOMATICO

### Sistema Automatico (v4.1):
```
✅ Identifica outlier statistici automaticamente
✅ Esclude automaticamente dal calcolo
❌ Nessun controllo manuale
❌ Può escludere valori validi (stress, patologia)
```

### Sistema Manuale (v4.2):
```
✅ Operatore ha controllo totale
✅ Warning per outlier (ma non forzato)
✅ Include/escludi qualsiasi valore
✅ Flessibile per casi complessi
```

---

## 🔄 COMPATIBILITÀ

**Backward compatible:**
- ✅ Misurazioni esistenti: `includedInFormula = true` (default)
- ✅ Nessuna migrazione dati necessaria
- ✅ Funziona con sistema outlier esistente

**Forward compatible:**
- ✅ Export/Import preserva `includedInFormula`
- ✅ PDF mostra solo valori inclusi nel calcolo
- ✅ Analytics riflette scelte manuali

---

**Status:** ✅ FEATURE COMPLETA  
**Versione:** 4.2.0 - Manual Include/Exclude  
**Testing:** Pronto  
**Deploy:** Pronto  

🎯 **Operatori hanno ora controllo totale sul calcolo del range personalizzato!**
