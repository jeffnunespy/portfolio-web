// CSP estática preserva SSG. O bootstrap/Flight do Next.js precisa de scripts
// inline; handlers HTML continuam bloqueados. Decisão e risco residual:
// docs/audits/auditoria-02-etapa4-next-http.md.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // As imagens são SVGs locais em <img>; OG usa ImageResponse no build.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // next dev precisa de eval e HMR; a política auditada vale para
          // next build/start (incluindo previews), sem unsafe-eval em produção.
          ...(process.env.NODE_ENV === "development"
            ? []
            : [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]),
        ],
      },
    ];
  },
};

module.exports = nextConfig;
