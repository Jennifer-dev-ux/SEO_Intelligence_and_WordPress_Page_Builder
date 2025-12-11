// onPageProcessor.js (ABSOLUTE FINAL CORRECTED VERSION)

export function processOnPageData(pages = [], mainKeyword = "", rankingKeywords = []) {
  if (!Array.isArray(pages) || pages.length === 0) {
    return {
      avgTitleLength: 0,
      percentPagesWithH1Keyword: 0,
      totalPages: 0,
      numPagesWithTargetKeyword: 0, 
      avgPositionForMainKeywords: 0 
    };
  }

  let totalTitleLength = 0;
  let h1KeywordMatches = 0;
  let pagesWithTargetKeyword = 0; 
  
  const keyword = (mainKeyword || "").toLowerCase().trim(); // Clean keyword

  pages.forEach(page => {
    // Ensure title exists and convert to lowercase for comparison
    const title = page.title || "";
    const titleLower = title.toLowerCase();
    const h1 = (page.h1 || "").toLowerCase();

    // 1. TITLE LENGTH: Use the actual string length
    totalTitleLength += title.length; // <-- This is why it was stuck at 18/page length

    // 2. H1 KEYWORD MATCH %
    if (keyword && h1.includes(keyword)) {
      h1KeywordMatches++;
    }

    // 3. numPagesWithTargetKeyword: Check if main keyword is in title OR H1
    if (keyword && (titleLower.includes(keyword) || h1.includes(keyword))) {
        pagesWithTargetKeyword++;
    }
  });
    
  // avgPositionForMainKeywords Calculation (This is confirmed correct)
  let totalPosition = 0;
  let mainKeywordCount = 0;
  
  const topKeywords = (rankingKeywords || []).slice(0, 4);

  topKeywords.forEach(k => {
      if (k.position && k.position > 0) {
          totalPosition += k.position;
          mainKeywordCount++;
      }
  });

  const avgPosition = mainKeywordCount 
    ? Number((totalPosition / mainKeywordCount).toFixed(2)) 
    : 0;

  const total = pages.length;

  return {
    totalPages: total,
    avgTitleLength: Number((totalTitleLength / total).toFixed(2)),
    percentPagesWithH1Keyword: Number(
      ((h1KeywordMatches / total) * 100).toFixed(2)
    ),
    numPagesWithTargetKeyword: pagesWithTargetKeyword, 
    avgPositionForMainKeywords: avgPosition 
  };
}