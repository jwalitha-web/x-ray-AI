// ================================================================
//  AI Prediction Simulator
//  Simulates realistic chest X-ray classification output.
//  1-2 diseases get elevated scores; rest remain low, mimicking
//  real model distributions.
// ================================================================

const DISEASES = [
    "Pneumonia",
    "Cardiomegaly",
    "Effusion",
    "Atelectasis",
    "Nodule",
    "Mass",
    "Infiltration",
    "Consolidation",
    "Edema",
    "Fibrosis",
];

function weightedRandom(low, high) {
    return +(Math.random() * (high - low) + low).toFixed(3);
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Simulates AI prediction.
 * Returns a promise that resolves after `delayMs` ms with an array of
 * { disease, probability } objects, sorted highest-first.
 */
export function simulatePrediction(delayMs = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const diseases = shuffle(DISEASES);
            // pick 1-2 "elevated" diseases
            const elevatedCount = Math.random() < 0.45 ? 2 : 1;
            const predictions = diseases.map((disease, i) => {
                let probability;
                if (i < elevatedCount) {
                    probability = weightedRandom(0.55, 0.96);    // elevated
                } else {
                    probability = weightedRandom(0.04, 0.38);    // background noise
                }
                return { disease, probability };
            });

            predictions.sort((a, b) => b.probability - a.probability);
            resolve(predictions);
        }, delayMs);
    });
}

export function getRiskLevel(probability) {
    if (probability >= 0.6) return "high";
    if (probability >= 0.3) return "moderate";
    return "low";
}

export function getRiskLabel(probability) {
    const level = getRiskLevel(probability);
    if (level === "high") return "HIGH";
    if (level === "moderate") return "MODERATE";
    return "LOW";
}

export { DISEASES };
