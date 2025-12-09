import React, { useState } from "react";

// Mock SERP + gap data for now.
// Later: replace with real backend API call.
function mockFetchSerp(keyword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        results: [
          {
            title: `Premium ${keyword} for Industrial Spaces | Competitor A`,
            metaDescription:
              "High-performance flooring for warehouses, factories and heavy-duty environments.",
            url: "https://competitor-a.com/premium-industrial-flooring",
          },
          {
            title: `${keyword} Solutions for Commercial Buildings | Competitor B`,
            metaDescription:
              "Durable, easy-to-clean floors ideal for offices, retail units and public buildings.",
            url: "https://competitor-b.com/commercial-flooring",
          },
          {
            title: `Affordable ${keyword} | Competitor C`,
            metaDescription:
              "Cost-effective flooring options with quick installation and long-lasting performance.",
            url: "https://competitor-c.com/affordable-flooring",
          },
        ],
        gaps: {
          missingKeywords: ["anti-slip", "oil-resistant", "easy-clean"],
          competitorKeywords: ["heavy-duty", "premium", "commercial"],
          opportunityKeywords: ["UK warehouse floors", "cold room flooring"],
        },
      });
    }, 1000);
  });
}

function OpportunityFinder() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serpData, setSerpData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    if (!keyword.trim()) {
      setError("Please enter a keyword to analyse.");
      return;
    }

    setIsLoading(true);
    setSerpData(null);

    try {
      const data = await mockFetchSerp(keyword.trim());
      setSerpData(data);
    } catch (err) {
      setError("Something went wrong while fetching SERP data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card card-animate">
      <div className="card-header">
        <h2>SEO Opportunity Finder</h2>
        <p className="card-subtitle">
          Enter a keyword to simulate Page 1 SERP results and highlight keyword gaps
          between TilePlan and competitors.
        </p>
      </div>

      <form className="form-row" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="keyword">Keyword</label>
          <input
            id="keyword"
            type="text"
            placeholder="e.g. industrial flooring, commercial safety floors"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button type="submit" className="primary-btn">
          Run SERP Analysis
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {isLoading && (
        <div className="skeleton-block">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-table-row" />
          <div className="skeleton skeleton-table-row" />
          <div className="skeleton skeleton-table-row" />
        </div>
      )}

      {serpData && !isLoading && (
        <>
          <div className="results-section">
            <h3>SERP Results</h3>
            <div className="table-wrapper fade-in">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Meta Description</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {serpData.results.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.title}</td>
                      <td>{item.metaDescription}</td>
                      <td>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="results-section keyword-gap-grid fade-in">
            <div className="keyword-box">
              <h4>Missing Keywords (TilePlan doesn&apos;t use)</h4>
              <ul>
                {serpData.gaps.missingKeywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="keyword-box">
              <h4>Competitor Keywords</h4>
              <ul>
                {serpData.gaps.competitorKeywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="keyword-box">
              <h4>Opportunity Keywords</h4>
              <ul>
                {serpData.gaps.opportunityKeywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OpportunityFinder;
