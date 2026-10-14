// ============================================================
// VERCEL SERVERLESS — port da /api/lp1-handoff da worker original
// Usado apenas pelo worker-style.html (teste A/B)
// ============================================================

const WAIT_MS = 4750;
const TARGET = "https://tinyurl.com/bdddra7f";

function cleanParams(url) {
  const q = new URLSearchParams(url.searchParams);
  q.delete("step");
  q.delete("prvw");
  const s = q.toString().replace(/[^a-zA-Z0-9=&%._\-]/g, "");
  return s ? s : "";
}

function buildTarget(params, ua) {
  const t = TARGET + (params ? "?" + params : "");
  if (/Android/i.test(ua)) {
    return "intent://webview?url=" + encodeURIComponent(t) + "&hide_nav_bar=1#Intent;scheme=snssdk1233;package=com.zhiliaoapp.musically;s.browser_fallback_url=" + encodeURIComponent(t) + ";end";
  }
  return "snssdk1180://webview?url=" + encodeURIComponent(t) + "&hide_nav_bar=1";
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).setHeader("Allow", "GET").setHeader("Cache-Control", "no-store").send("Method not allowed");
    return;
  }
  const url = new URL(req.url, "https://" + (req.headers.host || "example.com"));
  const ua = req.headers["user-agent"] || "";

  const value = url.searchParams.get("step");
  if (value !== null && !/^[0-3]$/.test(value)) {
    res.status(400).setHeader("Cache-Control", "no-store").send("Invalid step");
    return;
  }
  const step = value === null ? 0 : Number(value);
  const params = cleanParams(url);
  const target = buildTarget(params, ua);

  setTimeout(function () {
    const location = step === 3
      ? target
      : "/api/lp1-handoff?step=" + (step + 1) + (params ? "&" + params : "");
    res.status(302)
      .setHeader("Location", location)
      .setHeader("Cache-Control", "no-store, max-age=0")
      .setHeader("Referrer-Policy", "no-referrer")
      .setHeader("X-Content-Type-Options", "nosniff")
      .end();
  }, WAIT_MS);
}
