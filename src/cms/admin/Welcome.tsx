const steps = [
  ["1. Edit", "Open a page or item and make your changes."],
  ["2. Save draft", "Click Save Draft. Nothing changes on the live site."],
  ["3. Preview", "Use Preview to see the draft exactly as visitors would."],
  ["4. Submit", "Set Review status to “Pending approval” and save."],
  ["5. Approve", "An approver checks it and sets “Approved”."],
  ["6. Publish", "A publisher clicks Publish. The live site updates within seconds."],
];

export const Welcome = () => (
  <div style={{ marginBottom: 32, padding: "24px 28px", border: "1px solid var(--theme-elevation-150)", borderLeft: "4px solid #ff352c", background: "var(--theme-elevation-0)" }}>
    <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>RedBlink website CMS</h2>
    <p style={{ margin: "0 0 18px", color: "var(--theme-elevation-600)" }}>
      Changes never go live by accident: every edit is a draft until it is approved and published. Two people editing the same item is prevented by document locking, and every version is kept in History so it can be compared or restored.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
      {steps.map(([t, d]) => (
        <div key={t} style={{ padding: "12px 14px", background: "var(--theme-elevation-50)" }}>
          <strong style={{ display: "block", marginBottom: 4 }}>{t}</strong>
          <span style={{ fontSize: 13, color: "var(--theme-elevation-650)" }}>{d}</span>
        </div>
      ))}
    </div>
  </div>
);
