import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : undefined;

const contentSecurityPolicy = [
  "default-src 'self'",

  // Next.js currently requires inline bootstrap scripts unless
  // a nonce-based CSP is implemented through Proxy.
  `script-src 'self' 'unsafe-inline'${
    isProduction ? "" : " 'unsafe-eval'"
  } https://js.stripe.com https://accounts.google.com`,

  "style-src 'self' 'unsafe-inline'",

  [
    "img-src 'self' data: blob:",
    r2PublicUrl,
    "https://lh3.googleusercontent.com",
  ]
    .filter(Boolean)
    .join(" "),

  "font-src 'self' data:",

  [
    "connect-src 'self'",
    r2PublicUrl,
    "https://api.stripe.com",
    "https://accounts.google.com",
    "https://www.googleapis.com",
    "https://*.googleapis.com",
  ]
    .filter(Boolean)
    .join(" "),

  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com",

  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com https://accounts.google.com",
  "frame-ancestors 'none'",
  "manifest-src 'self'",

  ...(isProduction ? ["upgrade-insecure-requests"] : []),
]
  .join("; ")
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=(self)",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [
            {
              protocol: "https" as const,
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
