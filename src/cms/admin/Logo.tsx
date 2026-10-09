/* eslint-disable @next/next/no-img-element */
export const Logo = () => <img src="/brand/official-logo.png" alt="RedBlink" style={{ height: 56, width: "auto" }} />;
export const Icon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    {[[13, 6], [21, 6], [9, 18], [17, 18]].map(([x, y], i) => (
      <ellipse key={i} cx={x + 3} cy={y + 4} rx="2.6" ry="5" transform={`rotate(30 ${x + 3} ${y + 4})`} fill="#ff352c" />
    ))}
  </svg>
);
