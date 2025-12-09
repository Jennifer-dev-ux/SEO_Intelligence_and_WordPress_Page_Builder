import React, { useState } from "react";

function mockGenerateSeo(topic, keywords) {
  const kwList = keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const primaryKeyword = kwList[0] || topic;
  const secondaryKeywords = kwList.slice(1);

  return new Promise((resolve) => {
    setTimeout(() => {
      const urlSlug = topic
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      resolve({
        title: `${topic} | ${primaryKeyword} Specialists`,
        metaDescription: `Discover ${topic.toLowerCase()} solutions optimised for ${
          primaryKeyword
        }. Durable, safe and designed for high-traffic environments with full installation and support.`,
        h1: `${topic} for Modern Industrial and Commercial Spaces`,
        intro: `This page introduces TilePlan’s ${topic.toLowerCase()} offering, designed for busy industrial and commercial environments where safety, durability and hygiene are critical. It positions TilePlan as a specialist partner who can advise, specify and install the right system for each site.`,

        keyBenefits: [
          "High-performance surface engineered for heavy footfall and vehicle traffic.",
          "Improved safety with slip-resistant finishes and clearly zoned walkways.",
          "Easy to clean and maintain, supporting hygiene and compliance requirements.",
          "Bespoke specification support from the TilePlan team for each project.",
        ],

        specHighlights: [
          "Suitable for warehouses, factories, workshops and logistics hubs.",
          "Compatible with racking, forklifts and pallet trucks.",
          "Options for chemical resistance, cold storage and wet process areas.",
          "Available in a range of colours and finishes to support wayfinding.",
        ],

        sectionOutline: [
          "Introduction to the flooring solution and where it is used.",
          `Key benefits of ${primaryKeyword} for safety, performance and lifetime cost.`,
          "Technical specification overview (substrate, loading, coatings, finishes).",
          "Recommended applications (warehouses, production, logistics, cold stores).",
          "Installation process and project timelines.",
          "Cleaning, maintenance and aftercare support.",
          "Why choose TilePlan (experience, case studies, customer support).",
        ],

        faq: [
          {
            question: "Where is this flooring solution most suitable?",
            answer:
              "It is ideal for warehouses, production areas, logistics centres, workshops and other high-traffic industrial spaces.",
          },
          {
            question: "Can it handle forklift and pallet truck traffic?",
            answer:
              "Yes. The system can be specified to cope with regular forklift and pallet truck movements, including turning areas and loading bays.",
          },
          {
            question: "How easy is it to clean and maintain?",
            answer:
              "The surface is designed to be easy to clean using standard industrial cleaning equipment. We can provide maintenance guidance based on your site.",
          },
          {
            question: "How long does installation usually take?",
            answer:
              "Installation time depends on the size and condition of the area, but we aim to minimise downtime and can plan works in phases where needed.",
          },
        ],

        altTextSuggestions: [
          `${primaryKeyword} installed in a busy warehouse with racking and forklifts`,
          `Close-up of ${primaryKeyword} surface showing slip-resistant texture`,
          `TilePlan team installing ${primaryKeyword} in an industrial unit`,
        ],

        urlSlug,
        internalLinks: [
          "/categories/industrial-flooring",
          "/categories/health-and-safety-floors",
          "/services/installation",
          "/case-studies",
        ],

        cta: "Ready to discuss your project? Contact the TilePlan team to specify the right flooring system for your site.",

        primaryKeyword,
        secondaryKeywords,
      });
    }, 1000);
  });
}

function PageBuilder() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("Please enter a page topic.");
      return;
    }

    setIsLoading(true);
    setOutput(null);

    try {
      const data = await mockGenerateSeo(topic.trim(), keywords);
      setOutput(data);
    } catch {
      setError("Something went wrong while generating SEO content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!output) return;
    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-page-builder-output.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!output) return;

    const faqString = output.faq
      .map((item) => `${item.question} -> ${item.answer}`)
      .join(" | ");

    const rows = [
      ["title", output.title],
      ["metaDescription", output.metaDescription],
      ["h1", output.h1],
      ["intro", output.intro],
      ["urlSlug", output.urlSlug],
      ["primaryKeyword", output.primaryKeyword],
      ["secondaryKeywords", output.secondaryKeywords.join(" | ")],
      ["sectionOutline", output.sectionOutline.join(" | ")],
      ["keyBenefits", output.keyBenefits.join(" | ")],
      ["specHighlights", output.specHighlights.join(" | ")],
      ["faq", faqString],
      ["altTextSuggestions", output.altTextSuggestions.join(" | ")],
      ["internalLinks", output.internalLinks.join(" | ")],
      ["cta", output.cta],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((r) =>
          r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "seo-page-builder-output.csv";
    link.click();
  };

  const handleWordPressClick = () => {
    alert(
      "WordPress draft publishing will be connected by the backend team in a later sprint."
    );
  };

  return (
    <div className="card card-animate">
      <div className="card-header">
        <h2>SEO Page Builder</h2>
        <p className="card-subtitle">
          Enter a topic and target keywords to generate a structured SEO brief
          for a new TilePlan page. This uses mock data for Sprint 2.
        </p>
      </div>

      <form className="form-grid" onSubmit={handleGenerate}>
        <div className="form-group">
          <label htmlFor="topic">Page Topic</label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Industrial Flooring for Warehouses"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Target Keywords (comma separated)</label>
          <input
            id="keywords"
            type="text"
            placeholder="e.g. industrial flooring, anti-slip floors, warehouse safety floor"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <button type="submit" className="primary-btn form-full-width">
          Generate SEO Brief
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {isLoading && (
        <div className="skeleton-block">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      )}

      {output && !isLoading && (
        <div className="builder-output fade-in">
          <div className="output-header">
            <div>
              <h3>Generated SEO Elements</h3>
              <p className="card-subtitle">
                Use this as a starting brief. Content, FAQs and links can be
                refined based on TilePlan&apos;s tone of voice and examples.
              </p>
            </div>

            <div className="output-image-placeholder">
              <img
                src="https://via.placeholder.com/220x120.png?text=Tile+Floor+Visual"
                alt="Example flooring visual"
              />
            </div>
          </div>

          <div className="output-grid">
            <div className="output-card">
              <h4>Title</h4>
              <p>{output.title}</p>
            </div>

            <div className="output-card">
              <h4>Meta Description</h4>
              <p>{output.metaDescription}</p>
            </div>

            <div className="output-card">
              <h4>H1</h4>
              <p>{output.h1}</p>
            </div>

            <div className="output-card">
              <h4>Intro Paragraph</h4>
              <p>{output.intro}</p>
            </div>

            <div className="output-card">
              <h4>Key Benefits</h4>
              <ul>
                {output.keyBenefits.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="output-card">
              <h4>Specification Highlights</h4>
              <ul>
                {output.specHighlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="output-card">
              <h4>Section Outline</h4>
              <ol>
                {output.sectionOutline.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="output-card">
              <h4>FAQs</h4>
              <ul>
                {output.faq.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.question}</strong>
                    <br />
                    {item.answer}
                  </li>
                ))}
              </ul>
            </div>

            <div className="output-card">
              <h4>URL Slug</h4>
              <code>/{output.urlSlug}</code>
            </div>

            <div className="output-card">
              <h4>Alt Text Suggestions</h4>
              <ul>
                {output.altTextSuggestions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="output-card">
              <h4>Internal Links</h4>
              <ul>
                {output.internalLinks.map((link, idx) => (
                  <li key={idx}>{link}</li>
                ))}
              </ul>
            </div>

            <div className="output-card">
              <h4>Call to Action</h4>
              <p>{output.cta}</p>
            </div>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="secondary-btn"
              onClick={handleExportCSV}
            >
              ⬇️ Export as CSV
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleExportJSON}
            >
              ⬇️ Export as JSON
            </button>
            <button
              type="button"
              className="wp-btn"
              onClick={handleWordPressClick}
            >
              🔗 Publish to WordPress (placeholder)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageBuilder;
