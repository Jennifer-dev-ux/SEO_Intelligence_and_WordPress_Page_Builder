// keywordGapV2.js
// Task 5 — advanced keyword gap processing (V2)

/**
 * clientRankings:      array of { keyword, position, clicks, impressions, ... }
 * competitorRankings:  same structure as clientRankings
 * gapData:             OPTIONAL extra dataset from Option 2 (e.g. KD, intent, etc.)
 *
 * Returns:
 * {
 *   highPriority:  [...],
 *   mediumPriority:[...],
 *   lowPriority:   [...],
 *   allGaps:       [...],
 *   summary: {
 *     totalGaps,
 *     avgVolume,
 *     avgPosition
 *   }
 * }
 */

export function processKeywordGapsV2(
  clientRankings = [],
  competitorRankings = [],
  gapData = []
) {
  // --- 1. Build fast lookup sets/maps --------------------------------------
  const clientSet = new Set(
    clientRankings
      .map(k => (k && k.keyword ? k.keyword.toLowerCase() : null))
      .filter(Boolean)
  );

  const gapDataMap = new Map(
    (gapData || []).map(item => [
      (item.keyword || "").toLowerCase(),
      item
    ])
  );

  // --- 2. Find all "true" gaps --------------------------------------------
  // competitor ranks, client does NOT
  const rawGaps = (competitorRankings || []).filter(c => {
    const kw = (c.keyword || "").toLowerCase();
    if (!kw) return false;
    return !clientSet.has(kw);
  });

  // --- 3. Enrich each gap + calculate priority score ----------------------
  const enriched = rawGaps.map(gap => {
    const kw = (gap.keyword || "").toLowerCase();

    const volume =
      gap.impressions ??
      gap.volume ??
      gap.search_volume ??
      0;

    const position = gap.position ?? 100;

    // look up any extra info from Option 2 dataset if it exists
    const extra = gapDataMap.get(kw) || {};

    const difficulty =
      extra.kd ??
      extra.keyword_difficulty ??
      null;

    const intent =
      extra.intent ||
      extra.search_intent ||
      null;

    // Simple priority score: higher volume + better position = higher score
    const priorityScore = volume / Math.max(position, 1);

    return {
      keyword: gap.keyword,
      position,
      clicks: gap.clicks ?? gap.traffic ?? 0,
      impressions: volume,
      priorityScore,
      difficulty,
      intent
    };
  });

  // --- 4. Split into high / medium / low priority -------------------------
  const highPriority = [];
  const mediumPriority = [];
  const lowPriority = [];

  enriched.forEach(item => {
    const score = item.priorityScore || 0;

    if (score >= 1000) {
      highPriority.push(item);
    } else if (score >= 200) {
      mediumPriority.push(item);
    } else {
      lowPriority.push(item);
    }
  });

  // --- 5. Summary stats ---------------------------------------------------
  const totalGaps = enriched.length;

  const totalVolume = enriched.reduce(
    (sum, k) => sum + (k.impressions || 0),
    0
  );
  const totalPos = enriched.reduce(
    (sum, k) => sum + (k.position || 0),
    0
  );

  const summary = {
    totalGaps,
    avgVolume: totalGaps ? Number((totalVolume / totalGaps).toFixed(2)) : 0,
    avgPosition: totalGaps ? Number((totalPos / totalGaps).toFixed(2)) : 0
  };

  return {
    highPriority,
    mediumPriority,
    lowPriority,
    allGaps: enriched,
    summary
  };
}
