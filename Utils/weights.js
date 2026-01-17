function pickWeightedRandom(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, val]) => sum + val, 0);

    let r = Math.random() * total;
    for (const [key, weight] of entries) {
        if (r < weight) return key;
        r -= weight;
    }
    return entries[0][0];
}

module.exports = { pickWeightedRandom };