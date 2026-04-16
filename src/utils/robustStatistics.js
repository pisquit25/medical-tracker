/**
 * ROBUST STATISTICS - Media Robusta con IQR
 * Per < 20 misurazioni
 */

function quantile(sortedArray, q) {
  const pos = (sortedArray.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArray[base + 1] !== undefined) {
    return sortedArray[base] + rest * (sortedArray[base + 1] - sortedArray[base]);
  }
  return sortedArray[base];
}

function mean(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function std(arr) {
  const m = mean(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export function calculateRobustMean(values, multiplier = 1.5) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const q1 = quantile(sorted, 0.25);
  const q2 = quantile(sorted, 0.50);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  const lowerBound = q1 - multiplier * iqr;
  const upperBound = q3 + multiplier * iqr;

  const filtered = values.filter(v => v >= lowerBound && v <= upperBound);
  const outliers = values.filter(v => v < lowerBound || v > upperBound);
  const dataToUse = filtered.length > 0 ? filtered : values;

  const robustMean = mean(dataToUse);
  const robustStd = std(dataToUse);
  const cv = (robustStd / robustMean) * 100;

  return {
    setpoint: Number(robustMean.toFixed(2)),
    std: Number(robustStd.toFixed(2)),
    cv: Number(cv.toFixed(2)),
    quartiles: { 
      q1: Number(q1.toFixed(2)), 
      q2: Number(q2.toFixed(2)), 
      q3: Number(q3.toFixed(2)) 
    },
    iqr: Number(iqr.toFixed(2)),
    bounds: { 
      lower: Number(lowerBound.toFixed(2)), 
      upper: Number(upperBound.toFixed(2)) 
    },
    nValues: n,
    nFiltered: dataToUse.length,
    nOutliers: outliers.length,
    outliers: outliers.map(v => Number(v.toFixed(2)))
  };
}

export default calculateRobustMean;

/**
 * CALCOLO Z-SCORE PERSONALIZZATO (< 20 misurazioni)
 * 
 * Procedura:
 * 1. Identificare ed escludere outlier con IQR ± 1.5×IQR
 * 2. Calcolare mediana sui valori filtrati
 * 3. Calcolare z-score: (x - mediana) / (IQR / 1.35)
 * 
 * @param {number} newValue - Il nuovo valore da valutare
 * @param {number[]} historicalValues - Valori storici di riferimento
 * @returns {object} - { zScore, median, iqr, lowerBound, upperBound, filteredCount, outliersCount, isValid }
 */
export function calculateZScoreIQR(newValue, historicalValues) {
  if (!historicalValues || historicalValues.length < 3) {
    return { isValid: false, reason: 'Servono almeno 3 valori storici per il calcolo dello z-score' };
  }

  const sorted = [...historicalValues].sort((a, b) => a - b);

  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  if (iqr === 0) {
    // IQR zero: tutti i valori uguali, usa la mediana semplice
    const median = quantile(sorted, 0.5);
    return {
      isValid: true,
      zScore: 0,
      median: Number(median.toFixed(3)),
      iqr: 0,
      lowerBound: median,
      upperBound: median,
      filteredCount: sorted.length,
      outliersCount: 0
    };
  }

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Esclude outlier
  const filtered = historicalValues.filter(v => v >= lowerBound && v <= upperBound);
  const outliersCount = historicalValues.length - filtered.length;

  const dataToUse = filtered.length >= 2 ? filtered : historicalValues;
  const filteredSorted = [...dataToUse].sort((a, b) => a - b);

  // Mediana dei valori filtrati
  const median = quantile(filteredSorted, 0.5);

  // z-score individuale: (x - mediana) / (IQR / 1.35)
  const zScore = Math.abs((newValue - median) / (iqr / 1.35));

  return {
    isValid: true,
    zScore: Number(zScore.toFixed(3)),
    median: Number(median.toFixed(3)),
    iqr: Number(iqr.toFixed(3)),
    lowerBound: Number(lowerBound.toFixed(3)),
    upperBound: Number(upperBound.toFixed(3)),
    filteredCount: dataToUse.length,
    outliersCount
  };
}

/**
 * Restituisce la categoria semaforica per lo z-score personalizzato
 * Verde: zScore <= 2
 * Arancione: 2 < zScore <= 3
 * Rosso: zScore > 3
 */
export function getZScoreStatus(zScore) {
  if (zScore === null || zScore === undefined) return null;
  if (zScore <= 2) return { level: 'green', label: 'Nella norma', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' };
  if (zScore <= 3) return { level: 'orange', label: 'Attenzione', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300' };
  return { level: 'red', label: 'Anomalo', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' };
}
