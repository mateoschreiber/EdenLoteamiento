const CANONICAL_HOST = "edenloteamientos.com";

const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'sha256-Umy7a+rR5uqovD6sus+eSn5fq3l/rp4zIFMwnGzd+BM='; style-src 'self'; img-src 'self' data:; frame-src https://www.google.com https://maps.google.com; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}` || (url.hostname === CANONICAL_HOST && url.protocol !== "https:")) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/index.html" || url.pathname === "/index.htm") {
      url.pathname = "/";
      return Response.redirect(url.toString(), 308);
    }

    let assetResponse = await env.ASSETS.fetch(request);
    const acceptsHtml = (request.headers.get("Accept") || "").includes("text/html");

    if (assetResponse.status === 404 && acceptsHtml) {
      const notFoundUrl = new URL("/404", request.url);
      const notFoundAsset = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      assetResponse = new Response(notFoundAsset.body, {
        status: 404,
        statusText: "Not Found",
        headers: notFoundAsset.headers
      });
    }

    const headers = new Headers(assetResponse.headers);
    Object.entries(SECURITY_HEADERS).forEach(([name, value]) => headers.set(name, value));

    const contentType = headers.get("Content-Type") || "";
    const isCanonicalHost = url.hostname === CANONICAL_HOST;

    if (assetResponse.status >= 400) {
      headers.delete("Location");
      headers.set("Cache-Control", "no-store, no-transform");
      headers.set("X-Robots-Tag", "noindex, nofollow");
    } else if (url.pathname.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (contentType.includes("text/html")) {
      headers.set("Cache-Control", "public, max-age=0, must-revalidate, no-transform");
      headers.set("Link", `<https://${CANONICAL_HOST}/>; rel=\"canonical\"`);
    } else {
      headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
    }

    if (!isCanonicalHost) headers.set("X-Robots-Tag", "noindex, nofollow");

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers
    });
  }
};
