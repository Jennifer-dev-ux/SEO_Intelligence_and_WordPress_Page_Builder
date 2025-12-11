// seoOutputV2.js
// Combines all processors into a single clean SEO output object

import { evaluateSlugQuality } from "./slugRules.js";
import { evaluateHeadingCompliance } from "./h1h2Rules.js";
import { processOnPageData } from "./onPageProcessor.js"; 
import { processKeywordGapsV2 } from "./keywordGapV2.js";
import { seoOutputTemplate } from "./seoOutputFormat.js";

export function buildFullSEOoutputV2(client, competitor) {
    if (!client || !competitor) {
        return { error: "Missing client or competitor data" };
    }
    
    // Initialize the final output object
    const output = JSON.parse(JSON.stringify(seoOutputTemplate));

    // 1. ---- On-Page Processor (MUST USE 3 ARGUMENTS for API compliance) ----
    output.onPageStats = {
        client: processOnPageData(
            client.pages || [], 
            client.mainKeyword || "",
            client.rankingKeywords || [] // <-- Argument 3: Used for avgPositionForMainKeywords
        ),
        competitor: processOnPageData(
            competitor.pages || [],
            competitor.mainKeyword || "",
            competitor.rankingKeywords || [] // <-- Argument 3: Used for avgPositionForMainKeywords
        )
    };


    // 2. ---- Keyword Gap V2 ----
    output.keywordGaps = processKeywordGapsV2(
        client.rankingKeywords || [],
        competitor.rankingKeywords || [],
        client.keywordGapData || [] 
    );

    // 3. ---- Title Metrics (NOTE: This looks like old data, but keep it if needed for AI analysis) ----
    output.titleMetrics = {
        client: client.onPageAverages || {},
        competitor: competitor.onPageAverages || {}
    };

    // 4. ---- Slug Rules ----
    output.slugQuality = {
        client: evaluateSlugQuality(client.pages || []),
        competitor: evaluateSlugQuality(competitor.pages || [])
    };

    // 5. ---- Heading H1/H2 Compliance ----
    output.headingCompliance = {
        client: evaluateHeadingCompliance(client.pages || [], client.mainKeyword || ""),
        competitor: evaluateHeadingCompliance(
            competitor.pages || [],
            competitor.mainKeyword || ""
        )
    };

    // 6. ---- Comparison Stats ----
    output.comparison = {
        backlinks: {
            client: client.totalBacklinks || 0,
            competitor: competitor.totalBacklinks || 0
        },
        referringDomains: {
            client: client.referringDomains || 0,
            competitor: competitor.referringDomains || 0
        },
        traffic: {
            client: client.totalClicks || 0,
            competitor: competitor.totalClicks || 0
        }
    };


    return output;
}