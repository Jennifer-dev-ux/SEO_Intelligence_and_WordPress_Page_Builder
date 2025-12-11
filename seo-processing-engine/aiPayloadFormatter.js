
/**
 * Transforms the retrieved AI Insights Report into the structure required 
 * by the AI Page Builder (Endpoint 5).
 * @param {object} insightsReport - The combined report object from the database.
 * @returns {object} The compliant JSON request body for Endpoint 5.
 */
export function formatForAIPageBuilder(insightsReport) {
    if (!insightsReport || !insightsReport.keywordGaps) {
        return { error: "Missing required insights report data." };
    }

    // 1. Extracting the top 5 high-priority keywords from Gaps
    const topKeywordsFromGaps = insightsReport.keywordGaps
        .filter(gap => gap.priority === 'high') // Only take high priority gaps
        .slice(0, 5) // Take up to 5 keywords
        .map(gap => gap.keywordOrTopic); // Map to array of strings

    
    let mainTopic = "Default Product Category Page Topic";
    let finalTargetKeywords = topKeywordsFromGaps;

    // --- FALLBACK LOGIC ADDED HERE ---
    if (topKeywordsFromGaps.length > 0) {
        // A. If we have high-priority gaps, use the top one as the primary focus
        mainTopic = topKeywordsFromGaps[0]; 
    } else if (insightsReport.contentOpportunities.length > 0) {
        // B. If NO GAPS, use the highest priority Content Opportunity idea as the Topic
        const topOpportunityIdea = insightsReport.contentOpportunities[0].idea;
        
        // Use the opportunity idea as the main topic
        mainTopic = topOpportunityIdea;

        // If the opportunity has a specific keyword (like "Create a page for 'keyword'"), 
        // try to extract it and use it as the single target keyword.
        const keywordMatch = topOpportunityIdea.match(/"(.*?)"/);
        if (keywordMatch && keywordMatch[1]) {
            finalTargetKeywords = [keywordMatch[1]];
        }
    }
    // --- END FALLBACK LOGIC ---


    // Concatenate all weaknesses/strengths into a single summary string 
    // for the AI to understand the competitor's landscape.
    const competitorSummary = [
        ...(insightsReport.weaknesses || []).map(w => w.summary),
        ...(insightsReport.strengths || []).map(s => s.summary)
    ].join('; ');

    // Extracting top competitor domains (using placeholder if not available)
    const topCompetitors = insightsReport.competitorDomains || ["toppstiles.co.uk", "tilegiant.co.uk"]; 
    
    // The Endpoint 5 Request Body
    return {
        "topic": mainTopic,
        "category": "Product category page", 
        "target_keywords": finalTargetKeywords,
        "competitor_insights": {
            "summary": competitorSummary,
            "top_competitors": topCompetitors,
            "notes": "Emphasis should be placed on high-durability and installation ease due to competitor gaps."
        },
        "save": true 
    };
}