// apiPayloadFormatter.js

function getCurrentDate() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Generates automated strengths and weaknesses based on comparison data.
 * (Logic from previous turn)
 */
function generateComparativeInsights(seoReport) {
    const strengths = [];
    const weaknesses = [];

    const comp = seoReport.comparison;
    const clientStats = seoReport.onPageStats.client;
    const competitorStats = seoReport.onPageStats.competitor;

    const THRESHOLD = 0.20; // 20% difference is considered significant

    // 1. Backlink Comparison
    if (comp.backlinks.competitor > comp.backlinks.client * (1 + THRESHOLD)) {
        weaknesses.push({
            "summary": "Significant Backlink Gap",
            "detail": `Competitor has ${comp.backlinks.competitor.toLocaleString()} backlinks, over ${THRESHOLD * 100}% more than the client's ${comp.backlinks.client.toLocaleString()}.`
        });
    } else if (comp.backlinks.client > comp.backlinks.competitor * (1 + THRESHOLD)) {
        strengths.push({
            "summary": "Strong Backlink Profile",
            "detail": `Client leads with a healthy backlink profile, having ${comp.backlinks.client.toLocaleString()} backlinks compared to the competitor.`
        });
    }

    // 2. Referring Domain Comparison
    if (comp.referringDomains.competitor > comp.referringDomains.client * (1 + THRESHOLD)) {
        weaknesses.push({
            "summary": "Authority Gap in Referring Domains",
            "detail": `The competitor has ${comp.referringDomains.competitor.toLocaleString()} referring domains, indicating stronger site authority than the client's ${comp.referringDomains.client.toLocaleString()}.`
        });
    }

    // 3. On-Page Compliance (H1/H2 Rules)
    const h1Diff = competitorStats.percentPagesWithH1Keyword - clientStats.percentPagesWithH1Keyword;
    if (h1Diff > 15) { 
        weaknesses.push({
            "summary": "Poor H1 Compliance",
            "detail": `Competitor uses main keywords in H1 tags on ${competitorStats.percentPagesWithH1Keyword}% of pages, significantly higher than client's ${clientStats.percentPagesWithH1Keyword}%.`
        });
    }

    // 4. Title Length Rules (based on industry standard of 30-65 chars)
    if (competitorStats.avgTitleLength > 65) {
         weaknesses.push({
            "summary": "Over-Optimised/Long Titles",
            "detail": `Competitor's average title length is ${competitorStats.avgTitleLength} characters, which often leads to truncation in SERPs. This is an opportunity for the client to gain an edge.`
        });
    }

    if (strengths.length === 0 && weaknesses.length === 0) {
         strengths.push({
            "summary": "Consistent On-Page Foundation",
            "detail": "No major comparative strengths or weaknesses detected on key metrics."
        });
    }

    return { strengths, weaknesses };
}


export function formatForCompetitorsAddAPI(normalizedData, processedOutput, competitorName) {
    const competitorStats = processedOutput.onPageStats.competitor; 
    const competitorKeywords = normalizedData.rankingKeywords;

    const keywordStrengths = Array.isArray(competitorKeywords) 
        ? competitorKeywords.slice(0, 4).map(k => k.keyword)
        : ["placeholder keyword 1", "placeholder keyword 2"];

    return {
        "name": competitorName, 
        "domain": normalizedData.domain,
        "metrics": {
            "date": getCurrentDate(), 
            // The values below now come from your updated onPageProcessor.js logic
            "numPagesWithTargetKeyword": competitorStats.numPagesWithTargetKeyword || 0, 
            "avgTitleLength": competitorStats.avgTitleLength, 
            "percentPagesWithH1Keyword": competitorStats.percentPagesWithH1Keyword, 
            "totalBacklinks": normalizedData.totalBacklinks, 
            "referringDomains": normalizedData.referringDomains, 
            "avgPositionForMainKeywords": competitorStats.avgPositionForMainKeywords || 0, 
            "totalClicks": normalizedData.totalClicks, 
            "totalImpressions": normalizedData.totalImpressions
        },
        "keywordProfile": {
            "strengths": keywordStrengths,
            "gapType": "Core commercial keyword dominance"
        }
    };
}


export function formatForAIInsightsAddAPI(normalizedData, seoReport, clientDomain) {
    
    const { strengths, weaknesses } = generateComparativeInsights(seoReport);
    const competitorGaps = seoReport.keywordGaps;

    const keywordGaps = competitorGaps.allGaps
        .filter(g => g.priorityScore >= 200)
        .slice(0, 5)
        .map(gap => {
            let priority;
            if (gap.priorityScore >= 1000) priority = "high";
            else if (gap.priorityScore >= 200) priority = "medium";
            else priority = "low";

            return {
                "keywordOrTopic": gap.keyword,
                "reason": `${normalizedData.domain} ranks at position ${gap.position} with estimated monthly volume of ${gap.impressions}. Our site is not ranking.`,
                "priority": priority
            };
        });

    const contentOpportunities = [
        {
            "idea": `Create a dedicated category page for "${keywordGaps[0]?.keywordOrTopic || 'top keyword gap'}"`,
            "description": "Target this high-priority keyword gap with a comprehensive, well-structured content piece.",
            "suggestedFormat": "category page"
        }
    ];

    const recommendedActions = [
        {
            "action": "Earn 5-10 new referring domains",
            "reason": `Closes the gap between our ${clientDomain} and ${normalizedData.domain}.`,
            "expectedImpact": ["backlinks", "rankings"]
        }
    ];
    
    return {
        "domain": normalizedData.domain,
        "metricDate": getCurrentDate(),
        "insights": {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "keywordGaps": keywordGaps,
            "contentOpportunities": contentOpportunities,
            "recommendedActions": recommendedActions
        }
    };
}