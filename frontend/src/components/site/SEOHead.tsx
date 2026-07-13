import { useEffect } from "react";
import { useMatches } from "@tanstack/react-router";
import { SITE_URL, SITE_NAME, routeSEO, getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";

function setMeta(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function SEOHead({ jsonLd }: { jsonLd?: object | object[] }) {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname || "/";

  const seo = routeSEO[currentPath] || routeSEO["/"];
  const canonical = seo.canonical || `${SITE_URL}${currentPath}`;
  const fullTitle = currentPath === "/" ? seo.title : `${seo.title} | ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("description", seo.description);
    setLink("canonical", canonical);

    setMeta("og:title", seo.title, true);
    setMeta("og:description", seo.description, true);
    setMeta("og:url", canonical, true);
    setMeta("og:type", seo.ogType || "website", true);
    setMeta("og:site_name", SITE_NAME, true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
  }, [fullTitle, seo, canonical]);

  useEffect(() => {
    setJsonLd("seo-organization", getOrganizationSchema());
    setJsonLd("seo-website", getWebSiteSchema());

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((schema, i) => {
        setJsonLd(`seo-schema-${i}`, schema);
      });
    }
  }, [jsonLd]);

  return null;
}
