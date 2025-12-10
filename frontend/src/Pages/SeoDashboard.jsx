import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const clicksTrendData = [
  { week: "Week 1", tileplan: 8200, competitorA: 9600 },
  { week: "Week 2", tileplan: 9100, competitorA: 9800 },
  { week: "Week 3", tileplan: 10100, competitorA: 10050 },
  { week: "Week 4", tileplan: 10750, competitorA: 10200 },
];

const visibilityShareData = [
  { name: "tileplan.co.uk", value: 32 },
  { name: "Competitor A", value: 41 },
  { name: "Competitor B", value: 17 },
  { name: "Competitor C", value: 10 },
];

const visibilityColours = ["#4f46e5", "#fb7185", "#f97316", "#fbbf24"];

const keywordTable = [
  {
    keyword: "industrial flooring tiles",
    ourRank: 12,
    competitor: "Competitor A",
    competitorRank: 3,
    clicks: 260,
    opportunity: "Loses 70% of clicks to Competitor A",
    priority: "High",
  },
  {
    keyword: "commercial kitchen floor",
    ourRank: 8,
    competitor: "Competitor B",
    competitorRank: 6,
    clicks: 180,
    opportunity: "We are close to top 5",
    priority: "Medium",
  },
  {
    keyword: "warehouse floor tiles uk",
    ourRank: 4,
    competitor: "Competitor C",
    competitorRank: 9,
    clicks: 120,
    opportunity: "We already lead, focus on defending",
    priority: "Low",
  },
  {
    keyword: "non slip factory flooring",
    ourRank: 15,
    competitor: "Competitor A",
    competitorRank: 2,
    clicks: 300,
    opportunity: "Strong intent, big gap",
    priority: "High",
  },
];

const demandTable = [
  { keyword: "Wood effect tiles", searches: "9,900", cpc: "2.00", competition: "HIGH", priority: "High" },
  { keyword: "Herringbone tiles", searches: "5,400", cpc: "1.12", competition: "HIGH", priority: "High" },
  { keyword: "Porcelain floor tiles", searches: "2,900", cpc: "1.95", competition: "HIGH", priority: "Medium" },
  { keyword: "Mosaic tiles for bathrooms", searches: "2,900", cpc: "1.13", competition: "HIGH", priority: "Medium" },
  { keyword: "Bathroom tiles UK", searches: "2,400", cpc: "2.00", competition: "HIGH", priority: "High" },
  { keyword: "Natural stone tiles", searches: "1,600", cpc: "1.86", competition: "HIGH", priority: "Medium" },
  { keyword: "Outdoor tiles UK", searches: "1,000", cpc: "1.38", competition: "HIGH", priority: "Medium" },
];

function badgeClass(priority) {
  if (priority === "High") return "badge badge-high";
  if (priority === "Medium") return "badge badge-medium";
  return "badge badge-low";
}

const SeoDashboard = () => {
  return (
    <div className="dashboard-root">
      {/* Filters row */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Our Site</label>
          <select defaultValue="tileplan.co.uk">
            <option>tileplan.co.uk</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Competitor</label>
          <select defaultValue="all">
            <option value="all">All competitors</option>
            <option value="compA">Competitor A</option>
            <option value="compB">Competitor B</option>
            <option value="compC">Competitor C</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Device</label>
          <div className="segmented-control">
            <button className="active">All</button>
            <button>Desktop</button>
            <button>Mobile</button>
          </div>
        </div>

        <div className="filter-group">
          <label>Primary Metric</label>
          <select defaultValue="clicks">
            <option value="clicks">Organic Clicks</option>
            <option value="impressions">Impressions</option>
            <option value="ctr">CTR</option>
          </select>
        </div>
      </div>

      {/* Top metric cards */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <p className="metric-label">ORGANIC CLICKS</p>
          <p className="metric-value">42,180</p>
          <p className="metric-subtext">vs last period <span className="text-positive">+12%</span></p>
        </div>

        <div className="metric-card">
          <p className="metric-label">AVERAGE POSITION</p>
          <p className="metric-value">9.4</p>
          <p className="metric-subtext">Top 10 for 63% of tracked keywords</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">VISIBILITY VS COMPETITORS</p>
          <p className="metric-value">32%</p>
          <p className="metric-subtext">Behind Competitor A by 6 pts</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">NEW KEYWORD OPPORTUNITIES</p>
          <p className="metric-value">48</p>
          <p className="metric-subtext">High-intent terms Competitor A ranks for</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Organic Clicks Trend</h3>
            <span className="chart-subtitle">tileplan.co.uk vs Competitor A</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={clicksTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tileplan"
                  name="tileplan.co.uk"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="competitorA"
                  name="Competitor A"
                  stroke="#fb7185"
                  strokeDasharray="5 5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Visibility Share</h3>
            <span className="chart-subtitle">Top 50 keywords</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={visibilityShareData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {visibilityShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={visibilityColours[index % visibilityColours.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Keyword breakdown */}
      <div className="table-card">
        <div className="table-header">
          <h3>Keyword &amp; Competitor Breakdown</h3>
          <input
            className="table-search"
            placeholder="Filter by keyword or URL..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Our Rank</th>
                <th>Competitor</th>
                <th>Competitor Rank</th>
                <th>Clicks</th>
                <th>Opportunity</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {keywordTable.map((row) => (
                <tr key={row.keyword}>
                  <td>{row.keyword}</td>
                  <td>{row.ourRank}</td>
                  <td>{row.competitor}</td>
                  <td>{row.competitorRank}</td>
                  <td>{row.clicks}</td>
                  <td>{row.opportunity}</td>
                  <td>
                    <span className={badgeClass(row.priority)}>
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-caption">
          In the real system, this table would be populated dynamically from TilePlan&apos;s n8n flow / SEO data source.
        </p>
      </div>

      {/* Demand & CPC table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Keyword Demand &amp; CPC (Google Ads)</h3>
          <div className="table-header-actions">
            <select defaultValue="volume">
              <option value="volume">Sort: Highest volume</option>
              <option value="cpc">Sort: Highest CPC</option>
            </select>
            <input
              className="table-search"
              placeholder="Filter by keyword..."
            />
          </div>
        </div>

        <div className="table-wrapper table-scroll">
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Monthly Searches</th>
                <th>Competition</th>
                <th>Est. CPC (£)</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {demandTable.map((row) => (
                <tr key={row.keyword}>
                  <td>{row.keyword}</td>
                  <td>{row.searches}</td>
                  <td>{row.competition}</td>
                  <td>{row.cpc}</td>
                  <td>
                    <span className={badgeClass(row.priority)}>
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-caption">
          Based on mock Google Ads volumes &amp; CPC – ready to plug into live API or CSV export later.
        </p>
      </div>
    </div>
  );
};

export default SeoDashboard;
