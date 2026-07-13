import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  jsonLdId?: string;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  subtitle,
  items,
  jsonLdId = "faq-schema",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-24">
      <script
        id={jsonLdId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-12 mx-auto max-w-3xl space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`ml-4 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
