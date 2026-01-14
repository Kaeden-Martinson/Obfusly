/**
 * Break segments into random chunks, shuffle the parts array,
 * and produce rebuiltCode that references the new indices.
 *
 * @param {string[]} iifeBreaks - result of originalIIFECode.split('"')
 * @param {Map} declarationMapping - map with "IIFEstringBreaker" key
 * @param {object} opts - options { maxChunks, reinsertQuotes }
 * @returns {{ brokenIIFE: string[], rebuiltCode: string }}
 */
function breakShuffleAndBuild(iifeBreaks, declarationMapping, opts = {}) {
  const maxChunks = opts.maxChunks || 4;        // max parts per segment
  const reinsertQuotes = opts.reinsertQuotes ?? true;

  // Helper: split a string into k random non-empty pieces.
  function randomSplitIntoK(str, k) {
    const L = str.length;
    if (k <= 1 || L <= 1) return [str];

    // choose k-1 unique cut positions in range [1 .. L-1)
    const cuts = new Set();
    while (cuts.size < k - 1) {
      const pos = Math.floor(Math.random() * (L - 1)) + 1;
      cuts.add(pos);
    }
    const cutPositions = Array.from(cuts).sort((a, b) => a - b);

    const parts = [];
    let prev = 0;
    for (let c of cutPositions) {
      parts.push(str.slice(prev, c));
      prev = c;
    }
    parts.push(str.slice(prev));
    return parts;
  }

  // 1) Build parts array and placeholders where each placeholder references old indices
  const brokenIIFE = [];
  const placeholderEntries = []; // each entry: { oldIndices: [...], addPlus: bool }

  for (let i = 0; i < iifeBreaks.length; i++) {
    const segment = iifeBreaks[i];

    if (segment.length > 1) {
      // choose random number of chunks between 1 and min(maxChunks, segment.length)
      const k = Math.floor(Math.random() * Math.min(maxChunks, segment.length)) + 1;
      const subparts = randomSplitIntoK(segment, k);

      const indices = [];
      for (const sub of subparts) {
        brokenIIFE.push(sub);
        indices.push(brokenIIFE.length - 1); // record old index
      }

      // optionally reinsert the quote token as another part (like split + reinsert behavior)
      if (reinsertQuotes && i < iifeBreaks.length - 1) {
        brokenIIFE.push(' ');
        indices.push(brokenIIFE.length - 1);
      }

      placeholderEntries.push({ oldIndices: indices, addPlus: i !== iifeBreaks.length - 1 });
    } else {
      // length 0 or 1 -> keep as single part (can't split)
      // skip plus signs if you want:
      if (segment === "+") {
        // if you specifically want to skip single plus tokens, continue
        continue;
        // or include them:
      }
      brokenIIFE.push(segment);
      // if there's a following quote, reinsert
      if (reinsertQuotes && i < iifeBreaks.length - 1) {
        brokenIIFE.push('');
        placeholderEntries.push({
          oldIndices: [brokenIIFE.length - 2, brokenIIFE.length - 1].filter(x => x >= 0),
          addPlus: i !== iifeBreaks.length - 1
        });
      } else {
        placeholderEntries.push({ oldIndices: [brokenIIFE.length - 1], addPlus: i !== iifeBreaks.length - 1 });
      }
    }
  }

  // 2) Shuffle brokenIIFE (Fisher-Yates) and build mapping oldIndex -> newIndex
  const oldToNew = new Array(brokenIIFE.length);
  // create array of indices, perform shuffle on indices and build newParts
  const indices = Array.from({ length: brokenIIFE.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newParts = [];
  for (let newIdx = 0; newIdx < indices.length; newIdx++) {
    const oldIdx = indices[newIdx];
    newParts.push(brokenIIFE[oldIdx]);
    oldToNew[oldIdx] = newIdx;
  }

  // replace brokenIIFE with shuffled version (if you'd like to persist)
  // but keep oldToNew for mapping
  // brokenIIFE.length = 0; brokenIIFE.push(...newParts);
  const shuffledBrokenIIFE = newParts;

  // 3) Build rebuiltCode using placeholderEntries but mapping oldIndices -> newIndices
  const breakerToken = declarationMapping.get("IIFEstringBreaker") || "__IIFE_PARTS__";
  let rebuiltCode = "";
  for (let entryIdx = 0; entryIdx < placeholderEntries.length; entryIdx++) {
    const entry = placeholderEntries[entryIdx];
    // for each old index referenced for this original segment, map to new index and append token
    for (let oi = 0; oi < entry.oldIndices.length; oi++) {
      const oldIndex = entry.oldIndices[oi];
      if (oldIndex == null || oldToNew[oldIndex] == null) {
        // defensive: skip if mapping missing
        continue;
      }
      const newIndex = oldToNew[oldIndex];
      rebuiltCode += `${breakerToken}[${newIndex}]`;
      // add + between the parts in this segment
      if (oi < entry.oldIndices.length - 1) rebuiltCode += "+";
    }
    // add + between segments (if requested)
    if (entry.addPlus) rebuiltCode += "+";
  }

  return { brokenIIFE: shuffledBrokenIIFE, rebuiltCode };
}

module.exports = { breakShuffleAndBuild };