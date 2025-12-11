// runPipeline.js (FINAL CORRECT VERSION)

import { fetchAndProcessCompetitors } from "./fetchCompetitorsFromAPI.js"; // <--- FIXED IMPORT
import { normalizeCompetitorData } from "./normalizeCompetitorData.js";
import { buildFullSEOoutputV2 } from "./seoOutputV2.js";
import { 
    formatForCompetitorsAddAPI, 
    formatForAIInsightsAddAPI 
} from "./apiPayloadFormatter.js";
import { postDataToAPI } from "./apiUtils.js"; 

const BASE_URL = "https://cinder-rigged.poseidon.salford.ac.uk/SEO_API/api";

export async function runPipeline(clientRawData) { 

  // 1. Normalize client data (Needed for the comparison logic)
  const normalizedClient = normalizeCompetitorData(clientRawData);

  // 2. Fetch and Process Competitors (This returns the list of processed reports)
  const processedCompetitors = await fetchAndProcessCompetitors(clientRawData);
    
  // Handle the error case
  if (processedCompetitors.error) {
    console.error(`Pipeline failed to fetch competitors: ${processedCompetitors.error}`);
    return [];
  }

  // 3. Post to API for each competitor (This needs to be done here 
  // because fetchAndProcessCompetitors returns the final reports, not the raw data)
  const results = await Promise.all(processedCompetitors.map(async item => {

    // 3a. Re-normalize the competitor data if necessary for clean extraction
    const normComp = normalizeCompetitorData(item.competitor); 
    
    // 3b. Generate the internal comparison report (Already done in fetchAndProcessCompetitors, 
    // but we use item.seoReport for clarity)
    const seoReport = item.seoReport; 

    // Payload for Endpoint 1: Competitor Metrics
    const competitorPayload = formatForCompetitorsAddAPI(
        normComp, 
        seoReport, 
        normComp.name 
    );
    
    // Payload for Endpoint 3: AI Insights
    const insightsPayload = formatForAIInsightsAddAPI(
        normComp, 
        seoReport, 
        normalizedClient.domain 
    );

    // POST Payload 1
    const competitorPostResult = await postDataToAPI(
        `${BASE_URL}/competitors_add.php`, 
        competitorPayload
    );

    // POST Payload 2
    const insightsPostResult = await postDataToAPI(
        `${BASE_URL}/ai_insights_add.php`, 
        insightsPayload
    );
    
    // 3c. Return the internal report and API results
    return {
      competitorDomain: normComp.domain,
      seoReport,
      competitorDBResult: competitorPostResult,
      insightsDBResult: insightsPostResult
    };
  }));

  return results;
}