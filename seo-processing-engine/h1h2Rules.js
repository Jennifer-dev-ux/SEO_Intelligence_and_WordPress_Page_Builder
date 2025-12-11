// h1h2Rules.js
// Evaluates how many pages have good H1 and H2 usage based on the main keyword

export function evaluateHeadingCompliance(pages = [], mainKeyword = "") {
  if (!Array.isArray(pages) || pages.length === 0) {
    return { h1Compliance: 0, h2Compliance: 0 };
  }

  const keyword = mainKeyword.toLowerCase();

  let h1Matches = 0;
  let h2Matches = 0;
  let totalPages = pages.length;

  pages.forEach(page => {
    const h1 = (page.h1 || "").toLowerCase();
    const h2 = (page.h2 || "").toLowerCase(); // just in case future data includes h2

    if (h1.includes(keyword)) h1Matches++;
    if (h2.includes(keyword)) h2Matches++;
  });

  return {
    h1Compliance: Math.round((h1Matches / totalPages) * 100),
    h2Compliance: Math.round((h2Matches / totalPages) * 100)
  };
}
