// PlaybookReport.jsx
// Drop-in React component that renders the Meta Ads Playbook UI from your backend data.
//
// Usage:
//   const res = await fetch("/api/generate");
//   const data = await res.json();
//   setPlaybook(data.playbook);           // store in state
//   ...
//   <PlaybookReport playbook={playbook} accent="#1877F2" />
//
// Expected shape of `data.playbook` (all arrays optional — sections hide if empty):
// {
//   title: string,
//   subtitle: string,
//   context: { industry, location, budget, offer, adsScanned },
//   tiers:      [{ tier, name, body, examples, highlight?:bool }],
//   takeaways:  [string],
//   excluded:   string,                       // comma-joined noise list
//   competitors:[{ advertiser, sub?, angle, note?, format, dot, offer?, since, highlight?:bool }],
//   hooks:      [{ title, body, top?:bool }],  // order = number shown
//   offers:     [{ label, count }],
//   offerNote:  string,
//   formats:    [{ label, dot, body }],
//   gaps:       [{ title, body, tag?, dark?:bool }],
//   ads:        [{ letter, name, format, badge, badgeTone?:"green"|"gray", hook, body, offer, primary?:bool }],
//   singleCta:  string,
//   budgetNotes:[string],
//   footer:     string
// }

const F = "Geist, system-ui, sans-serif";
const M = "'Geist Mono', ui-monospace, monospace";

export default function PlaybookReport({ playbook = {}, accent = "#1877F2", showToc = true }) {
  const p = playbook;
  const A = accent;
  const card = { background: "#fff", border: "1px solid rgba(15,23,42,.08)", borderRadius: 14, boxShadow: "0 1px 2px rgba(16,24,40,.04)" };
  const label = { font: `500 10px/1 ${M}`, letterSpacing: ".1em", color: "#9aa2b0" };
  const secNum = { font: `600 13px/1 ${M}`, color: A, letterSpacing: ".06em" };
  const secH = { margin: 0, fontSize: 23, fontWeight: 600, letterSpacing: "-.02em" };
  const chip = (dot) => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", background: "#eff3f8", borderRadius: 6, font: `500 11.5px ${F}`, color: "#3a4150" });
  const dotEl = (c) => <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />;

  const Section = ({ n, title, sub, id, children }) => (
    <section id={id}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: sub ? 8 : 20 }}>
        <span style={secNum}>{n}</span><h2 style={secH}>{title}</h2>
      </div>
      {sub && <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.6, color: "#5b6470", maxWidth: 720 }}>{sub}</p>}
      {children}
    </section>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#eef0f4", color: "#14171a", fontFamily: F, WebkitFontSmoothing: "antialiased" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');`}</style>

      {/* TOP NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(15,23,42,.08)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: A, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="9" width="3.4" height="6" rx="1.2" fill="#fff" /><rect x="6.3" y="5" width="3.4" height="10" rx="1.2" fill="#fff" /><rect x="11.6" y="1.5" width="3.4" height="13.5" rx="1.2" fill="#fff" /></svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-.01em" }}>Meta Ads Playbook</span>
              <span style={{ fontSize: 11, color: "#8b93a1", marginTop: 3 }}>Competitor research</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ height: 34, padding: "0 14px", border: "1px solid rgba(15,23,42,.12)", background: "#fff", borderRadius: 8, font: `500 13px ${F}`, color: "#3a4150", cursor: "pointer" }}>Share</button>
            <button style={{ height: 34, padding: "0 15px", border: 0, background: A, borderRadius: 8, font: `600 13px ${F}`, color: "#fff", cursor: "pointer" }}>Export</button>
          </div>
        </div>
      </header>

      {/* REPORT HEADER */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "44px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1fbf75", boxShadow: "0 0 0 3px rgba(31,191,117,.16)" }} />
          <span style={{ font: `500 11.5px/1 ${M}`, letterSpacing: ".14em", color: "#8b93a1" }}>GENERATED PLAYBOOK · READY</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.08, fontWeight: 600, letterSpacing: "-.025em", maxWidth: 820, textWrap: "balance" }}>{p.title}</h1>
        {p.subtitle && <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.55, color: "#5b6470", maxWidth: 680 }}>{p.subtitle}</p>}
        {p.context && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
            {[["INDUSTRY", p.context.industry], ["LOCATION", p.context.location], ["BUDGET", p.context.budget], ["YOUR OFFER", p.context.offer], ["ADS SCANNED", p.context.adsScanned]]
              .filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "11px 15px", ...card, minWidth: 110 }}>
                  <span style={label}>{k}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: "#232a35" }}>{v}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* STICKY NAV */}
      {showToc && (
        <nav style={{ position: "sticky", top: 56, zIndex: 15, marginTop: 34, background: "rgba(238,240,244,.82)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(15,23,42,.06)", borderBottom: "1px solid rgba(15,23,42,.06)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "11px 32px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[["s1", "Summary"], ["s2", "Competitors"], ["s3", "Hook patterns"], ["s4", "Offers & formats"], ["s5", "Gaps"], ["s6", "Recommended ads"]].map(([id, t], i) => (
              <a key={id} href={"#" + id} style={{ font: `500 12.5px ${F}`, color: i === 5 ? A : "#5b6470", padding: "5px 11px", borderRadius: 7, textDecoration: "none", background: i === 5 ? "rgba(24,119,242,.09)" : "transparent" }}>{t}</a>
            ))}
          </div>
        </nav>
      )}

      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "44px 32px 80px", display: "flex", flexDirection: "column", gap: 56 }}>

        {/* 01 SUMMARY */}
        {(p.tiers || p.takeaways) && (
          <Section n="01" id="s1" title="Competitor landscape">
            {p.tiers && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {p.tiers.map((t, i) => (
                  <div key={i} style={{ ...card, border: t.highlight ? `1px solid ${A}` : card.border, boxShadow: t.highlight ? "0 4px 16px rgba(24,119,242,.12)" : card.boxShadow, borderRadius: 14, padding: 22 }}>
                    <span style={{ ...label, color: t.highlight ? A : "#9aa2b0" }}>{t.tier}</span>
                    <h3 style={{ margin: "11px 0 8px", fontSize: 16, fontWeight: 600 }}>{t.name}</h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.55, color: "#5b6470" }}>{t.body}</p>
                    <div style={{ font: `500 12px ${M}`, color: "#8b93a1" }}>{t.examples}</div>
                  </div>
                ))}
              </div>
            )}
            {p.takeaways && (
              <div style={{ marginTop: 16, ...card, borderRadius: 14, padding: "24px 26px" }}>
                <span style={label}>KEY TAKEAWAYS</span>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(p.takeaways.length, 3)},1fr)`, gap: 22, marginTop: 16 }}>
                  {p.takeaways.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <span style={{ flex: "none", width: 24, height: 24, borderRadius: 7, background: "rgba(24,119,242,.1)", color: A, font: `600 12px ${M}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "#3a4150" }}>{t}</p>
                    </div>
                  ))}
                </div>
                {p.excluded && <p style={{ margin: "18px 0 0", paddingTop: 16, borderTop: "1px solid rgba(15,23,42,.06)", fontSize: 12, lineHeight: 1.5, color: "#9aa2b0" }}><b style={{ color: "#8b93a1", fontWeight: 600 }}>Filtered as noise:</b> {p.excluded}</p>}
              </div>
            )}
          </Section>
        )}

        {/* 02 COMPETITOR TABLE */}
        {p.competitors && (
          <Section n="02" id="s2" title="Competitor ads analyzed">
            <div style={{ ...card, borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f7f8fa", textAlign: "left" }}>
                    {["ADVERTISER", "HOOK / ANGLE", "FORMAT", "OFFER", "SINCE"].map((h) => (
                      <th key={h} style={{ padding: "13px 20px", font: `500 10.5px ${M}`, letterSpacing: ".08em", color: "#9aa2b0", borderBottom: "1px solid rgba(15,23,42,.08)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.competitors.map((c, i) => (
                    <tr key={i} style={{ borderBottom: i < p.competitors.length - 1 ? "1px solid rgba(15,23,42,.05)" : "none", background: c.highlight ? "rgba(24,119,242,.03)" : "transparent" }}>
                      <td style={{ padding: "13px 20px", fontWeight: 600 }}>{c.advertiser}{c.sub && <div style={{ fontWeight: 400, fontSize: 11, color: "#9aa2b0", marginTop: 2 }}>{c.sub}</div>}</td>
                      <td style={{ padding: "13px 16px", color: "#5b6470" }}>{c.angle}{c.note && <span style={{ fontSize: 11, color: A, fontWeight: 600 }}> · {c.note}</span>}</td>
                      <td style={{ padding: "13px 16px" }}><span style={chip()}>{dotEl(c.dot || "#1877F2")}{c.format}</span></td>
                      <td style={{ padding: "13px 16px", color: c.offer ? "#5b6470" : "#c2c8d0" }}>{c.offer || "—"}</td>
                      <td style={{ padding: "13px 20px", font: `500 12px ${M}`, color: "#8b93a1" }}>{c.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* 03 HOOK PATTERNS */}
        {p.hooks && (
          <Section n="03" id="s3" title="Dominant copy & hook patterns" sub="Recurring plays across the category. Top ones carry most high-performing ads.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {p.hooks.map((h, i) => (
                <div key={i} style={{ ...card, border: h.top ? `1px solid ${A}` : card.border, boxShadow: h.top ? "0 3px 14px rgba(24,119,242,.1)" : "none", borderRadius: 14, padding: 20, display: "flex", gap: 15 }}>
                  <span style={{ flex: "none", font: `600 20px ${M}`, color: h.top ? A : "#c2c8d0", opacity: h.top ? 0.9 : 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 600 }}>{h.title}</h3><p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#5b6470" }}>{h.body}</p></div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 04 OFFERS & FORMATS */}
        {(p.offers || p.formats) && (
          <Section n="04" id="s4" title="Common offers & media formats">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {p.offers && (
                <div style={{ ...card, borderRadius: 14, padding: 24 }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Offers</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {p.offers.map((o, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 13.5, color: "#3a4150" }}>{o.label}</span>
                        <span style={{ flex: "none", font: `500 10.5px ${M}`, color: "#8b93a1", background: "#f2f4f7", padding: "3px 8px", borderRadius: 6 }}>{o.count}</span>
                      </div>
                    ))}
                    {p.offerNote && <div style={{ marginTop: 6, padding: "13px 15px", background: "rgba(24,119,242,.06)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: A }} /><span style={{ fontSize: 13, color: "#2a4d80" }}>{p.offerNote}</span></div>}
                  </div>
                </div>
              )}
              {p.formats && (
                <div style={{ ...card, borderRadius: 14, padding: 24 }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Media formats</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {p.formats.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ flex: "none", ...chip() }}>{dotEl(f.dot)}{f.label}</span>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#5b6470" }}>{f.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 05 GAPS */}
        {p.gaps && (
          <Section n="05" id="s5" title="Gaps & untapped opportunities" sub="Where the category leaves room — and where a local, human, 1:1 brand can win.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {p.gaps.map((g, i) => g.dark ? (
                <div key={i} style={{ background: "#0f1b2d", borderRadius: 14, padding: 22, color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ font: `600 15px ${M}`, color: "#5fa0ff" }}>{String(i + 1).padStart(2, "0")}</span>
                    {g.tag && <span style={{ font: `600 9.5px ${M}`, letterSpacing: ".1em", color: "#0f1b2d", background: "#5fa0ff", padding: "3px 8px", borderRadius: 5 }}>{g.tag}</span>}
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>{g.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#9fb0c4" }}>{g.body}</p>
                </div>
              ) : (
                <div key={i} style={{ ...card, borderRadius: 14, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: g.tag ? 8 : 0 }}>
                    <span style={{ font: `600 15px ${M}`, color: "#c2c8d0" }}>{String(i + 1).padStart(2, "0")}</span>
                    {g.tag && <span style={{ font: `600 9.5px ${M}`, letterSpacing: ".1em", color: A, background: "rgba(24,119,242,.1)", padding: "3px 8px", borderRadius: 5 }}>{g.tag}</span>}
                  </div>
                  <h3 style={{ margin: "8px 0 6px", fontSize: 15, fontWeight: 600 }}>{g.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#5b6470" }}>{g.body}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 06 RECOMMENDED ADS */}
        {p.ads && (
          <Section n="06" id="s6" title="Recommended ads to test" sub="Run 2–3 concepts max toward a single lead-gen objective. Tight geo + parent targeting.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {p.ads.map((a, i) => {
                const green = a.badgeTone === "green";
                return (
                  <div key={i} style={{ ...card, border: a.primary ? `1px solid ${A}` : card.border, boxShadow: a.primary ? "0 4px 18px rgba(24,119,242,.1)" : card.boxShadow, borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 38, height: 38, borderRadius: 10, background: a.primary ? A : "#eef1f5", color: a.primary ? "#fff" : "#3a4150", font: `600 18px ${F}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.letter}</span>
                        <div><div style={{ fontSize: 15, fontWeight: 600 }}>{a.name}</div><div style={{ font: `500 11.5px ${M}`, color: "#8b93a1", marginTop: 2 }}>{a.format}</div></div>
                      </div>
                      {a.badge && <span style={{ font: `600 10px ${M}`, letterSpacing: ".08em", color: green ? "#0d7a3f" : "#8b93a1", background: green ? "rgba(31,191,117,.14)" : "#f2f4f7", padding: "4px 9px", borderRadius: 6 }}>{a.badge}</span>}
                    </div>
                    <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.5, fontWeight: 500, color: "#14171a", borderLeft: `3px solid ${a.primary ? A : "#d3d8df"}`, paddingLeft: 13 }}>{a.hook}</p>
                    <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.55, color: "#5b6470" }}>{a.body}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(15,23,42,.07)" }}>
                      <span style={{ font: `500 12px ${F}`, color: "#5b6470" }}>Offer: <b style={{ color: "#14171a", fontWeight: 600 }}>{a.offer}</b></span>
                      <span style={{ font: `600 12px ${F}`, color: a.primary ? "#fff" : "#3a4150", background: a.primary ? A : "#eef1f5", padding: "6px 13px", borderRadius: 7 }}>Book now →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {p.budgetNotes && (
              <div style={{ marginTop: 16, background: "linear-gradient(180deg,#0f1b2d,#12203a)", borderRadius: 16, padding: "28px 30px", color: "#fff" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Budget & testing notes</h3>
                  {p.singleCta && <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(95,160,255,.14)", padding: "8px 15px", borderRadius: 10 }}><span style={{ font: `500 10.5px ${M}`, letterSpacing: ".08em", color: "#9fb0c4" }}>SINGLE CTA</span><span style={{ fontSize: 15, fontWeight: 600 }}>{p.singleCta}</span></div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px 30px" }}>
                  {p.budgetNotes.map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 11 }}><span style={{ flex: "none", width: 6, height: 6, borderRadius: "50%", background: "#5fa0ff", marginTop: 6 }} /><p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#c3ccd8" }}>{n}</p></div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {p.footer && <footer style={{ paddingTop: 8, font: `400 12px ${F}`, color: "#9aa2b0", textAlign: "center" }}>{p.footer}</footer>}
      </main>
    </div>
  );
}
