// buildSEOOutput.js - FINAL CLEAN VERSION


function aggregateAndCleanSEOData(data) {
  // TEMPORARY: Directly return flattened API data
  return data;
}

import { getKeywordGaps, getClientAdvantages } from "./keywordGap.js";

export function prepareSEOoutput(clientData, competitor1Data, competitor2Data) {
  // 1. Run the aggregation function on all three data sets
  const cleanClient = aggregateAndCleanSEOData(clientData);
  const cleanCompetitor1 = aggregateAndCleanSEOData(competitor1Data);
  const cleanCompetitor2 = aggregateAndCleanSEOData(competitor2Data);

  // Competitor 1 is the main focus for the AI insights
  const competitor = cleanCompetitor1;
  
  return {
   // Return the cleaned client and competitor data
    client: cleanClient,
    competitor: competitor,

    // 2. Keyword Gap logic uses 'rankingKeywords'
    keywordGaps: getKeywordGaps(
      cleanClient.rankingKeywords, 
      competitor.rankingKeywords
    ),

    clientAdvantages: getClientAdvantages(
      cleanClient.rankingKeywords, 
      competitor.rankingKeywords
    ),

    comparison: {
      // 3. Comparison logic uses the new aggregated metrics (Client - Competitor)
      backlinksDiff: cleanClient.totalBacklinks - cleanCompetitor1.totalBacklinks,
      refDomainsDiff: cleanClient.totalReferringDomains - cleanCompetitor1.totalReferringDomains,
      trafficDiff: cleanClient.totalClicks - cleanCompetitor1.totalClicks, 

      // --- NEW ON-PAGE DIFFERENCES ---
      avgTitleLengthDiff: cleanClient.onPageAverages.avgTitleLength - cleanCompetitor1.onPageAverages.avgTitleLength,
      h1ComplianceDiff: cleanClient.onPageAverages.percentPagesWithH1Keyword - cleanCompetitor1.onPageAverages.percentPagesWithH1Keyword,
    },
    
    // Include all clean competitors for the dashboard
    competitorData: [cleanCompetitor1, cleanCompetitor2]
  };
}