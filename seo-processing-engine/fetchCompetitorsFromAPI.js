// fetchCompetitorsFromAPI.js
// Pulls live competitor data from Jennifer's API

import { normalizeCompetitorData } from "./normalizeCompetitorData.js";
import { buildFullSEOoutputV2 } from "./seoOutputV2.js";

const BASE_URL = "https://cinder-rigged.poseidon.salford.ac.uk/SEO_API/api";

export async function fetchAndProcessCompetitors(clientRaw) {
  try {
    // 1. Fetch all competitors (latest data only)
    const res = await fetch(`${BASE_URL}/competitors_data.php?latest=1`);
    const json = await res.json();

    const competitors = json.competitors || [];

    // 2. Normalize client
    const client = normalizeCompetitorData(clientRaw);

    // 3. Process each competitor
    const results = competitors.map(item => {
        // FIX: Extract the first metrics object (latest data) from the array.
        const latestMetrics = item.metrics && item.metrics.length > 0 
                              ? item.metrics[0] 
                              : {};

        const competitor = normalizeCompetitorData({
            ...item, // Contains id, name, domain
            ...latestMetrics // FIX: Now spread the single metrics OBJECT
        });

        return {
            competitorDomain: competitor.domain,
            seoReport: buildFullSEOoutputV2(client, competitor),
            competitor: competitor // Pass the normalized competitor object back for re-use in runPipeline
        };
    });

    return results;

  } catch (err) {
    console.error("API Error:", err);
    return { error: "Failed to fetch competitor data" };
  }
}
