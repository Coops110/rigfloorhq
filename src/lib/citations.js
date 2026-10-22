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
  oshaPpe: {
    en: {
      href: 'https://www.osha.gov/personal-protective-equipment/standards',
      label: 'OSHA — Personal Protective Equipment Standards',
      note: "OSHA's own index of the 1910 Subpart I general-industry PPE standards (1910.132 general requirements, 1910.133 eye/face, 1910.135 head, 1910.136 foot) and the parallel 1926 construction-phase requirements.",
    },
    es: {
      href: 'https://www.osha.gov/personal-protective-equipment/standards',
      label: 'OSHA — Normas de Equipo de Protección Personal',
      note: 'El propio índice de OSHA de las normas de EPP de la Subparte I de la 1910 para industria general (1910.132 requisitos generales, 1910.133 ojos/cara, 1910.135 cabeza, 1910.136 pies) y los requisitos paralelos de la 1926 para fase de construcción.',
    },
  },
  apiRp54: {
    en: {
      href: 'https://www.api.org/products-and-services/standards/important-standards-announcements/recommended-practice-54',
      label: 'API RP 54',
      note: 'Occupational Safety and Health for Oil and Gas Well Drilling and Servicing Operations — PPE selection tied specifically to well control and rig-floor hazards, not just generic workplace PPE rules.',
    },
    es: {
      href: 'https://www.api.org/products-and-services/standards/important-standards-announcements/recommended-practice-54',
      label: 'API RP 54',
      note: 'Seguridad y salud ocupacional para operaciones de perforación y servicio de pozos de petróleo y gas — selección de EPP ligada específicamente a los peligros de control de pozos y del piso de perforación, no solo reglas genéricas de EPP.',
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
  cfr250h: {
    en: {
      href: 'https://www.ecfr.gov/current/title-30/chapter-II/subchapter-B/part-250/subpart-H',
      label: '30 CFR 250 Subpart H (§250.814)',
      note: "BSEE's oil and gas production safety system rules for the US Outer Continental Shelf — §250.814 specifically covers the design, installation and operation of subsurface safety valves, which is a production/completion requirement rather than a well-control (Subpart G) one.",
    },
    es: {
      href: 'https://www.ecfr.gov/current/title-30/chapter-II/subchapter-B/part-250/subpart-H',
      label: '30 CFR 250 Subparte H (§250.814)',
      note: 'Normas de BSEE sobre sistemas de seguridad de producción de petróleo y gas para la plataforma continental exterior de EE. UU. — el §250.814 cubre específicamente el diseño, instalación y operación de válvulas de seguridad subsuperficiales, un requisito de producción/terminación y no de control de pozo (Subparte G).',
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
  api59: {
    en: {
      href: 'https://www.api.org/products-and-services/standards',
      label: 'API RP 59',
      note: 'Recommended Practice for Well Control Operations — the companion practice to API Std 53, covering both surface BOP installations and subsea BOP installations with long choke and kill lines.',
    },
    es: {
      href: 'https://www.api.org/products-and-services/standards',
      label: 'API RP 59',
      note: 'Práctica recomendada para operaciones de control de pozo — la práctica complementaria a API Std 53, que cubre tanto instalaciones de BOP superficiales como instalaciones de BOP submarinas con líneas largas de choke y kill.',
    },
  },
  bls: {
    en: {
      href: 'https://www.bls.gov/oes/2023/may/oes475011.htm',
      label: 'BLS OEWS — Derrick Operators, Oil and Gas',
      note: "The U.S. Bureau of Labor Statistics' Occupational Employment and Wage Statistics survey, the independently verifiable government cross-check used alongside this site's own editorial pay estimates.",
    },
    es: {
      href: 'https://www.bls.gov/oes/2023/may/oes475011.htm',
      label: 'BLS OEWS — Operadores de Torre, Petróleo y Gas',
      note: 'La encuesta de Estadísticas de Empleo y Salarios Ocupacionales de la Oficina de Estadísticas Laborales de EE. UU., el contraste gubernamental independientemente verificable usado junto con las estimaciones editoriales propias de este sitio.',
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
  astmF2413: {
    en: {
      href: "https://www.astm.org/f2413-18.html",
      label: "ASTM F2413",
      note: "Standard Specification for Performance Requirements for Protective (Safety) Toe Cap Footwear — the North American impact/compression test safety boots are rated against.",
    },
    es: {
      href: "https://www.astm.org/f2413-18.html",
      label: "ASTM F2413",
      note: "Especificación estándar de requisitos de desempeño para calzado de protección con puntera de seguridad — la prueba norteamericana de impacto/compresión contra la que se clasifican las botas de seguridad.",
    },
  },
  isoSafetyFootwear: {
    en: {
      href: "https://www.iso.org/standard/73222.html",
      label: "ISO 20345",
      note: "Personal protective equipment — Safety footwear — the EN/ISO standard (S3 is the usual rig requirement) used across the UK, Europe, the Middle East and much of Africa in place of ASTM F2413.",
    },
    es: {
      href: "https://www.iso.org/standard/73222.html",
      label: "ISO 20345",
      note: "Equipo de protección personal — Calzado de seguridad — la norma EN/ISO (S3 es el requisito habitual en taladros) usada en el Reino Unido, Europa, Medio Oriente y gran parte de África en lugar de ASTM F2413.",
    },
  },
  oshaOilGasHazards: {
    en: {
      href: 'https://www.osha.gov/oil-and-gas-extraction/hazards',
      label: 'OSHA — Oil and Gas Extraction Hazards',
      note: "OSHA's own hazard-by-hazard breakdown for the oil and gas extraction industry, covering vehicle/struck-by/caught-in incidents, falls, fires and explosions, confined spaces, and chemical exposure.",
    },
    es: {
      href: 'https://www.osha.gov/oil-and-gas-extraction/hazards',
      label: 'OSHA — Peligros de la Extracción de Petróleo y Gas',
      note: 'El desglose propio de OSHA de peligros para la industria de extracción de petróleo y gas, incluyendo incidentes de vehículos/golpeado por/atrapado en, caídas, incendios y explosiones, espacios confinados y exposición química.',
    },
  },
  blsCfoi: {
    en: {
      href: 'https://www.bls.gov/iif/fatal-injuries-tables.htm',
      label: 'BLS — Census of Fatal Occupational Injuries',
      note: "The U.S. Bureau of Labor Statistics' count of every fatal workplace injury by industry and event type — the federal government's primary source for which hazards actually kill the most workers, oil and gas extraction included.",
    },
    es: {
      href: 'https://www.bls.gov/iif/fatal-injuries-tables.htm',
      label: 'BLS — Censo de Lesiones Ocupacionales Fatales',
      note: 'El conteo de la Oficina de Estadísticas Laborales de EE. UU. de cada lesión laboral fatal por industria y tipo de evento — la fuente federal principal sobre qué peligros matan realmente a más trabajadores, incluida la extracción de petróleo y gas.',
    },
  },
  iogpSpi: {
    en: {
      href: 'https://www.iogp.org/bookstore/portfolio-item/safety-performance-indicators/',
      label: 'IOGP — Safety Performance Indicators',
      note: "IOGP's annual global safety performance report, built from its member companies' incident data — the source for offshore/global E&P fatality-cause breakdowns like dropped objects and process safety events, as distinct from the US-only BLS figures above.",
    },
    es: {
      href: 'https://www.iogp.org/bookstore/portfolio-item/safety-performance-indicators/',
      label: 'IOGP — Indicadores de Desempeño en Seguridad',
      note: 'El reporte anual global de desempeño en seguridad de IOGP, construido con datos de incidentes de sus empresas miembro — la fuente de los desgloses de causas de fatalidad en E&P costa afuera/global como objetos caídos y eventos de seguridad de procesos, distinta de las cifras de BLS (solo EE. UU.) anteriores.',
    },
  },
  hseHsg250: {
    en: {
      href: "https://www.hse.gov.uk/pubns/books/hsg250.htm",
      label: "HSE HSG250",
      note: "Guidance on Permit-to-Work Systems: A Guide for the Petroleum, Chemical and Allied Industries — the UK Health and Safety Executive's own guidance behind the permit-to-work system, including the research finding that permit failures were the largest single cause of maintenance-related incidents.",
    },
    es: {
      href: "https://www.hse.gov.uk/pubns/books/hsg250.htm",
      label: "HSE HSG250",
      note: "Guía sobre sistemas de permiso de trabajo: una guía para las industrias del petróleo, química y afines — la guía propia del Health and Safety Executive del Reino Unido detrás del sistema de permiso de trabajo, incluido el hallazgo de que las fallas del sistema de permisos eran la causa individual más frecuente de incidentes relacionados con mantenimiento.",
    },
  },
};
