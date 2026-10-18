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
  acgihH2s: {
    en: {
      href: 'https://www.acgih.org/hydrogen-sulfide/',
      label: 'ACGIH — Hydrogen Sulfide',
      note: "ACGIH's hydrogen sulfide page, source of the TLV-TWA (1 ppm) and TLV-STEL (5 ppm) recommended exposure guidelines — a separate, more conservative standard than OSHA's PEL.",
    },
    es: {
      href: 'https://www.acgih.org/hydrogen-sulfide/',
      label: 'ACGIH — Sulfuro de Hidrógeno',
      note: 'Página de ACGIH sobre el sulfuro de hidrógeno, fuente de las guías recomendadas TLV-TWA (1 ppm) y TLV-STEL (5 ppm) — un estándar distinto y más conservador que el PEL de OSHA.',
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
  // Equipment-page standards (2026-10-17). API has no free per-standard page
  // for most of these, so like api53 they link to API's standards catalog
  // (checked live 2026-10-17) and the label names the exact document.
  api16a: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 16A",
      note: "Specification for Drill-through Equipment — design, rating and testing of ram and annular BOPs, drilling spools and their connections.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 16A",
      note: "Especificación para equipo de paso total (drill-through) — diseño, clasificación y prueba de BOP de arietes y anulares, carretes de perforación y sus conexiones.",
    },
  },
  api16d: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 16D",
      note: "Control Systems for Drilling Well Control Equipment and Control Systems for Diverter Equipment — accumulator sizing, closing units, control pods and panels.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 16D",
      note: "Sistemas de control para equipos de control de pozo y para equipos desviadores (diverter) — dimensionamiento de acumuladores, unidades de cierre, pods y paneles de control.",
    },
  },
  api5dp: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 5DP",
      note: "Drill Pipe — tube body grades (E, X, G, S), dimensions and the tool joints welded to them.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 5DP",
      note: "Tubería de perforación — grados del cuerpo del tubo (E, X, G, S), dimensiones y las juntas (tool joints) soldadas a él.",
    },
  },
  api7_1: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 7-1",
      note: "Rotary Drill Stem Elements — kellys, kelly valves, drill stem subs, steel and non-magnetic drill collars, and drilling and coring bits.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 7-1",
      note: "Elementos rotarios de la sarta — kellys, válvulas de kelly, subs de sarta, lastrabarrenas de acero y no magnéticos, y barrenas de perforación y de núcleo.",
    },
  },
  api7g: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 7G",
      note: "Drill Stem Design and Operating Limits — the recommended practice used to size a string for tension, torsion, collapse and fatigue.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 7G",
      note: "Diseño y límites operativos de la sarta — la práctica recomendada usada para dimensionar una sarta a tensión, torsión, colapso y fatiga.",
    },
  },
  api8c: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 8C",
      note: "Drilling and Production Hoisting Equipment (PSL 1 and PSL 2) — traveling blocks, hooks, elevators, links, rotary and power swivels.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 8C",
      note: "Equipo de izaje para perforación y producción (PSL 1 y PSL 2) — bloques viajeros, ganchos, elevadores, brazos, uniones giratorias y power swivels.",
    },
  },
  api4f: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 4F",
      note: "Drilling and Well Servicing Structures — load rating, design and inspection of masts, derricks and substructures.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 4F",
      note: "Estructuras de perforación y servicio de pozos — clasificación de carga, diseño e inspección de mástiles, torres y subestructuras.",
    },
  },
  api9a: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 9A",
      note: "Wire Rope — construction, grades and minimum breaking strength of the wire rope used as drilling line.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 9A",
      note: "Cable de acero — construcción, grados y resistencia mínima a la rotura del cable usado como línea de perforación.",
    },
  },
  api9b: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 9B",
      note: "Application, Care, and Use of Wire Rope for Oil Field Service — including ton-mile based slip-and-cut programs.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 9B",
      note: "Aplicación, cuidado y uso del cable de acero en servicio petrolero — incluidos los programas de corrido y corte por toneladas-milla.",
    },
  },
  api7k: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 7K",
      note: "Drilling and Well Servicing Equipment — rotary tables and bushings, piston mud-pump components, drawworks components, high-pressure mud hoses, slips and tongs.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 7K",
      note: "Equipo de perforación y servicio de pozos — mesas rotarias y bujes, componentes de bombas de lodo de pistón, componentes del malacate, mangueras de lodo de alta presión, cuñas y llaves.",
    },
  },
  api13c: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 13C",
      note: "Drilling Fluid Processing Systems Evaluation — how solids-control performance is assessed, and the API number system that replaced 'mesh' for shaker screens.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 13C",
      note: "Evaluación de sistemas de procesamiento de fluidos de perforación — cómo se evalúa el control de sólidos, y la designación API que reemplazó al 'mesh' en las mallas de zaranda.",
    },
  },
  api5ct: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 5CT",
      note: "Casing and Tubing — steel grades, dimensions and testing for the casing a shoe is made up on.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 5CT",
      note: "Revestimiento y tubería de producción — grados de acero, dimensiones y pruebas del revestimiento sobre el que se arma la zapata.",
    },
  },
  api10f: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 10F",
      note: "Cementing Float Equipment — performance testing of float shoes and float collars (it replaced the older API RP 10F).",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 10F",
      note: "Equipo de flotación para cementación — pruebas de desempeño de zapatas y collares flotadores (reemplazó a la antigua API RP 10F).",
    },
  },
  api10d: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 10D",
      note: "Casing Bow-spring Centralizers — starting force, running force and restoring force testing.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 10D",
      note: "Centralizadores de resorte de arco para revestimiento — pruebas de fuerza de arranque, de corrida y de restauración.",
    },
  },
  api10d2: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 10D-2",
      note: "Centralizer Placement and Stop Collar Testing — calculating spacing for a target standoff.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 10D-2",
      note: "Ubicación de centralizadores y prueba de collares de tope — cálculo del espaciamiento para una separación (standoff) objetivo.",
    },
  },
  api11d1: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 11D1",
      note: "Packers and Bridge Plugs — design validation grades (V0 to V6) and quality grades for packers.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 11D1",
      note: "Empacadores y tapones puente — grados de validación de diseño (V0 a V6) y grados de calidad para empacadores.",
    },
  },
  api19lh: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 19LH",
      note: "Liner Hanger Equipment — hangers, liner top packers, tie-back receptacles and running tools.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API Spec 19LH",
      note: "Equipo de colgadores de liner — colgadores, empacadores de tope de liner, receptáculos de tie-back y herramientas de corrida.",
    },
  },
  api500: {
    en: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 500",
      note: "Classification of Locations for Electrical Installations at Petroleum Facilities (Class I, Division 1 and 2) — the area classification that decides where rig electrical equipment may sit.",
    },
    es: {
      href: "https://www.api.org/products-and-services/standards",
      label: "API RP 500",
      note: "Clasificación de áreas para instalaciones eléctricas en instalaciones petroleras (Clase I, División 1 y 2) — la clasificación que decide dónde puede ubicarse el equipo eléctrico del taladro.",
    },
  },
};
