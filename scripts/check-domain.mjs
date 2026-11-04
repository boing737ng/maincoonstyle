// Optional IP bypasses DNS caching but still verifies TLS for the domain.
// node scripts/check-domain.mjs [77.91.112.242]
import assert from "node:assert/strict";
import https from "node:https";

const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://maincoonstyle.ru");
const ip = process.argv[2];

function request(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: ip || url.hostname,
        servername: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        headers: { Host: url.host },
        timeout: 20000,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { body += chunk; });
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
      },
    );
    req.on("timeout", () => req.destroy(new Error("Domain check timed out")));
    req.on("error", reject);
  });
}

const home = await request(site);
assert.equal(home.status, 200, "The main domain must serve the site");
assert.match(home.body, /LargeBrush/i, "Expected the cattery site");
console.log("PASS main domain HTTPS");

const alias = new URL("/cats?domain-check=1", `https://www.${site.hostname}`);
const redirect = await request(alias);
assert.equal(redirect.status, 301);
assert.equal(redirect.headers.location, `${site.origin}/cats?domain-check=1`);
console.log("PASS www redirects to main domain and preserves path/query");

const sitemap = await request(new URL("/sitemap.xml", site));
assert.equal(sitemap.status, 200);
assert.ok(sitemap.body.includes(`${site.origin}/`), "Sitemap must use the main domain");
assert.ok(!sitemap.body.includes("hostkey.in"), "Sitemap must not retain the temporary hostname");
console.log("PASS sitemap uses main domain");
