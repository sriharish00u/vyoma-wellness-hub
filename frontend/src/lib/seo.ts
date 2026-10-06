export const SITE_URL = "https://mivora-academy.vercel.app";
export const SITE_NAME = "Mivora Academy";
export const SITE_DESCRIPTION =
  "Physical wellness, mental wellness & technical services for holistic growth.";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/mivora_academy",
  facebook: "https://www.facebook.com/people/Mivora-Academy/61591345331704/",
  linkedin: "https://in.linkedin.com/in/mivora-academy-645888419",
} as const;

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

export const routeSEO: Record<string, SEOConfig> = {
  "/": {
    title: "Mivora Academy — Calm. Disciplined. Daily.",
    description:
      "Mivora Academy — Physical wellness, mental wellness & technical services for holistic growth.",
    ogType: "website",
  },
  "/about": {
    title: "About — Mivora Academy",
    description:
      "Mivora Academy is a holistic platform for physical wellness, mental wellness & technical services. Learn about our mission, values and community.",
    canonical: `${SITE_URL}/about`,
  },
  "/pricing": {
    title: "Pricing — Mivora Academy",
    description:
      "Simple, transparent pricing for Mivora Academy members. Start free, upgrade when ready. No hidden fees, no long-term contracts.",
    canonical: `${SITE_URL}/pricing`,
  },
  "/events": {
    title: "Events & Workshops — Mivora Academy",
    description:
      "Join yoga, fitness, breathwork, meditation and motivation events at Mivora Academy. Live workshops led by certified coaches.",
    canonical: `${SITE_URL}/events`,
  },
  "/physical-wellness": {
    title: "Physical Wellness — Mivora Academy",
    description:
      "Yoga, meditation and physical wellness programs at Mivora Academy — build strength, flexibility and inner calm.",
    canonical: `${SITE_URL}/physical-wellness`,
  },
  "/mental-wellness": {
    title: "Mental Wellness — Mivora Academy",
    description:
      "Life skills, counseling and mental wellness programs at Mivora Academy — build resilience, clarity and emotional strength.",
    canonical: `${SITE_URL}/mental-wellness`,
  },
  "/technical-services": {
    title: "Technical Services — Mivora Academy",
    description:
      "Website creation, app development, social media maintenance and digital marketing services at Mivora Academy.",
    canonical: `${SITE_URL}/technical-services`,
  },
  "/contact": {
    title: "Contact — Mivora Academy",
    description: "Get in touch with the Mivora Academy team. We typically respond within 24 hours.",
    canonical: `${SITE_URL}/contact`,
  },
  "/login": {
    title: "Login — Mivora Academy",
    description: "Login to your Mivora Academy account.",
  },
  "/signup": {
    title: "Get Started — Mivora Academy",
    description:
      "Create your free Mivora Academy account. Seven days of live sessions, full library access, no card required.",
  },
};

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2022",
    sameAs: Object.values(SOCIAL_LINKS),
    contactPoint: {
      "@type": "ContactPoint",
      email: "mivoraacademy@gmail.com",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
