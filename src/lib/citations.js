// Shared citation data for the "Sources & Standards" blocks added across the
// well-control, H2S, pillar and pressure-calculator pages (2026-10-15 audit
// fix). One definition per standard/body, bilingual, so a URL correction
// only has to happen in one place rather than in every page that cites it.
//
// Every URL here was checked by hand against the live site before use (none
// are guessed). API Std 53 has no dedicated public page on api.org the way
// API 14A does — only its own product catalog, which is what it links to.
export const CITATIONS = {
  api53: {
    en: {
      href: 'https://www.api.org/products-and-services/standards',
      label: 'API Std 53',
      note: "Well Control Equipment Systems for Drilling Wells — installation, testing and inspection requirements for BOP stacks, listed in API's standards catalog.",
    },
    es: {
      href: 'https://www.api.org/products-and-services/standards',
      label: 'API Std 53',
      note: 'Sistemas de equipos de control de pozo para la perforación de pozos — requisitos de instalación, prueba e inspección para stacks de BOP, incluido en el catálogo de normas de API.',
    },
  },
  api14a: {
    en: {
      href: 'https://www.api.org/products-and-services/standards/important-standards-announcements/spec14a',
      label: 'API Spec 14A',
      note: 'Subsurface Safety Valve and Annular Safety Valve Equipment — the standard governing SCSSVs and related barrier equipment.',
    },
    es: {
      href: 'https://www.api.org/products-and-services/standards/important-standards-announcements/spec14a',
      label: 'API Spec 14A',
      note: 'Equipo de válvula de seguridad subsuperficial y válvula de seguridad anular — la norma que rige las SCSSV y el equipo de barrera relacionado.',
    },
  },
  cfr250g: {
    en: {
      href: 'https://www.ecfr.gov/current/title-30/chapter-II/subchapter-B/part-250/subpart-G',
      label: '30 CFR 250 Subpart G',
      note: 'BSEE well operations and equipment rules for the US Outer Continental Shelf, including well-control and BOP equipment requirements.',
    },
    es: {
      href: 'https://www.ecfr.gov/current/title-30/chapter-II/subchapter-B/part-250/subpart-G',
      label: '30 CFR 250 Subparte G',
      note: 'Normas de BSEE sobre operaciones y equipos de pozo para la plataforma continental exterior de EE. UU., incluidos los requisitos de control de pozo y equipos BOP.',
    },
  },
  oshaH2s: {
    en: {
      href: 'https://www.osha.gov/hydrogen-sulfide',
      label: 'OSHA — Hydrogen Sulfide',
      note: "OSHA's hydrogen sulfide safety and health topics page, covering the permissible exposure limit, hazards, and control measures.",
    },
    es: {
      href: 'https://www.osha.gov/hydrogen-sulfide',
      label: 'OSHA — Sulfuro de Hidrógeno',
      note: 'Página de OSHA sobre seguridad y salud relacionada con el sulfuro de hidrógeno, con el límite de exposición permisible, los peligros y las medidas de control.',
    },
  },
  nioshH2s: {
    en: {
      href: 'https://archive.cdc.gov/www_cdc_gov/niosh/topics/hydrogensulfide/default.html',
      label: 'NIOSH — Hydrogen Sulfide',
      note: "CDC/NIOSH's hydrogen sulfide topic page, including recommended exposure limits and hazard controls.",
    },
    es: {
      href: 'https://archive.cdc.gov/www_cdc_gov/niosh/topics/hydrogensulfide/default.html',
      label: 'NIOSH — Sulfuro de Hidrógeno',
      note: 'Página temática de CDC/NIOSH sobre el sulfuro de hidrógeno, incluidos los límites de exposición recomendados y los controles de peligro.',
    },
  },
  iwcf: {
    en: {
      href: 'https://www.iwcf.org/',
      label: 'IWCF',
      note: 'International Well Control Forum — the well control training and certification body referenced throughout this cluster.',
    },
    es: {
      href: 'https://www.iwcf.org/',
      label: 'IWCF',
      note: 'International Well Control Forum — el organismo de capacitación y certificación en control de pozo mencionado en este grupo de páginas.',
    },
  },
  iadcWellsharp: {
    en: {
      href: 'https://iadc.org/accreditation/wellsharp/',
      label: 'IADC WellSharp',
      note: "IADC's well control accreditation program, the other widely recognized certification track alongside IWCF.",
    },
    es: {
      href: 'https://iadc.org/accreditation/wellsharp/',
      label: 'IADC WellSharp',
      note: 'Programa de acreditación de control de pozo de IADC, la otra vía de certificación ampliamente reconocida junto con IWCF.',
    },
  },
};
