// normalizeCompetitorData.js (FINAL CORRECTED VERSION)

export function normalizeCompetitorData(rawData = {}) {
  const metrics = rawData.metrics || {};

  return {
    // Basic Information
    name: rawData.name || metrics.name || "N/A",
    domain: rawData.domain || metrics.domain || "",
    mainKeyword: rawData.mainKeyword || metrics.mainKeyword || "", 

    // Backlink & Authority Metrics (FIXED: Prioritizing rawData keys for mock test)
    authorityScore: rawData.authority_score || metrics.domain_authority || 0,
    totalBacklinks: rawData.totalBacklinks || rawData.backlinks || metrics.total_backlinks || 0, // <-- FIX: Added rawData.totalBacklinks
    referringDomains: rawData.referringDomains || rawData.ref_domains || metrics.referring_domains || 0, // <-- FIX: Added rawData.referringDomains

    // Traffic Metrics
    totalClicks: rawData.totalClicks || rawData.organic_traffic || metrics.organic_traffic || 0,
    totalImpressions: rawData.totalImpressions || rawData.total_impressions || metrics.total_impressions || 0,

    // CRITICAL FIX: Ensure complex data arrays are passed directly
    pages: rawData.pages || metrics.pages || [],
    rankingKeywords: rawData.rankingKeywords || metrics.top_keywords || [],
    
    keywordGapData: rawData.keywordGapData || metrics.keywordGapData || [],
  };
}