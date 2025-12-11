// slugRules.js
// Checks URL slug quality for each page

export function evaluateSlugQuality(pages = []) {
  if (!Array.isArray(pages)) return 0;

  let goodSlugs = 0;

  pages.forEach(page => {
    if (!page.url) return;

    const slug = page.url.split("/").filter(Boolean).pop() || "";

    // Rules for good slugs:
    const isClean =
      slug.length > 0 &&
      !slug.includes("?") &&
      !slug.includes("=") &&
      !/[A-Z]/.test(slug) &&
      !slug.includes(".html") &&
      slug.length <= 80;

    if (isClean) goodSlugs++;
  });

  const qualityPercent = (goodSlugs / pages.length) * 100 || 0;

  return {
    totalPages: pages.length,
    goodSlugs,
    qualityPercent: Number(qualityPercent.toFixed(2))
  };
}
