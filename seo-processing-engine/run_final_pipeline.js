// run_final_pipeline.js - Executes the production pipeline

import { runPipeline } from "./runPipeline.js";

// --- CLIENT RAW DATA (Needed for the pipeline entry point) ---
// This is your client's initial data that the pipeline needs to normalize 
// and compare competitors against.
const clientRawData = { 
    name: "TilePlan", domain: "tileplan.com", mainKeyword: "waterproof laminate", 
    totalBacklinks: 1000, referringDomains: 100, totalClicks: 1500, totalImpressions: 60000, 
    rankingKeywords: [
        { keyword: "client keyword 1", position: 15, impressions: 500, clicks: 10 }, 
        { keyword: "client keyword 2", position: 5, impressions: 1000, clicks: 50 }
    ],
    pages: [{ title: "Waterproof Laminate Page - Title Length Test", h1: "Best Waterproof Laminate", url: "/waterproof-laminate" }]
};

async function executePipeline() {
    console.log("Starting SEO Pipeline...");
    
    // Call the main pipeline function, passing the required client data
    const results = await runPipeline(clientRawData); 

    console.log("\n--- PIPELINE EXECUTION COMPLETE ---");
    
    // Check and log the results (This shows the API post statuses)
    results.forEach(res => {
        console.log(`\nDomain: ${res.competitorDomain}`);
        console.log(`Competitor DB Insert Status: ${res.competitorDBResult?.success ? 'SUCCESS' : 'FAILURE'}`);
        console.log(`AI Insights DB Insert Status: ${res.insightsDBResult?.success ? 'SUCCESS' : 'FAILURE'}`);
    });
}

executePipeline();

