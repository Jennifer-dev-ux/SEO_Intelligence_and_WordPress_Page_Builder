
import { postDataToAPI } from './apiUtils.js'; 
import { normalizeCompetitorData } from './normalizeCompetitorData.js'; // Needed if we process raw fetch
import { formatForAIPageBuilder } from './aiPayloadFormatter.js'; // Will be used in the next step

// Base URL remains constant
const BASE_URL = "https://cinder-rigged.poseidon.salford.ac.uk/SEO_API/api";

/**
 * Fetches the latest AI Insights and Competitor Metrics from the database
 * for a specified competitor domain.
 * * @param {string} competitorDomain - The domain (e.g., 'toppstiles.co.uk') to fetch data for.
 * @returns {object|null} The combined, structured insights report, or null on failure.
 */
export async function fetchLatestInsights(competitorDomain) {
    if (!competitorDomain) {
        console.error("fetchLatestInsights requires a competitor domain.");
        return null;
    }

    const endpoint = `${BASE_URL}/ai_insights.php?domain=${competitorDomain}&latest=1`;

    try {
        const res = await fetch(endpoint);
        const json = await res.json();

        if (json.success && json.insights && json.insights.length > 0) {
            // The API returns an array of insights, even when querying for the 'latest=1'.
            const latestInsight = json.insights[0];
            
            // The 'insights' property contains all the structured arrays (strengths, gaps, etc.)
            const insightsData = latestInsight.insights || {}; 

            // Combine key data points into a single, clean report object for formatting
            const combinedReport = {
                domain: latestInsight.domain,
                metricDate: latestInsight.metric_date,
                strengths: insightsData.strengths || [],
                weaknesses: insightsData.weaknesses || [],
                keywordGaps: insightsData.keywordGaps || [],
                contentOpportunities: insightsData.contentOpportunities || [],
                recommendedActions: insightsData.recommendedActions || []
            };

            return combinedReport;
        } else {
            console.warn(`No latest insights found for domain: ${competitorDomain}`);
            return null;
        }

    } catch (err) {
        console.error("Error fetching latest AI insights:", err);
        return null;
    }
}