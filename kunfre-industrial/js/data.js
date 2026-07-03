const KUNFRE_LOGO = "../kunfre-enterprise/kunfre-logo.jpg";
const PIC_BASE = "../kunfre-enterprise/kunfre-pic/";
const BRAND_LOGO_BASE = "../kunfre-enterprise/product logo/";
const SOCIAL_ICON_BASE = "../kunfre-enterprise/social icon/";

const CATEGORIES = [
  {
    id: "webbing",
    name: "Webbing Tapes",
    label: "Load Securing",
    heroTitle: "Webbing Tapes",
    heroDesc: "High-strength woven and synthetic tapes for industrial load securing, lifting, and packaging applications.",
    description: "High-strength woven & synthetic tapes for industrial load securing, lifting, and packaging applications.",
    image: "polyester flat webbing tape.jpg",
    gallery: [
      "nylon webbing tape.jpg",
      "polypropylene webbing tape.jpg",
      "flame-retardant webbing tape.jpg",
      "fibre rope.jpg"
    ],
    services: ["Polyester webbing slings", "Cargo lashings", "Synthetic lifting straps", "Packaging tie-downs"]
  },
  {
    id: "seals",
    name: "Seals, Hoses & Spares",
    label: "Plant Maintenance",
    heroTitle: "Industrial Seals, Hoses & Mechanical Spares",
    heroDesc: "Sealing, belting, hose and mechanical spares for process and plant maintenance in demanding environments.",
    description: "Sealing, belting, hose & mechanical spares for process & plant maintenance.",
    image: "hydraulic hose, fittings& spares.jpg",
    gallery: [
      "mining hose.jpg",
      "ptfe thread seal tape.jpg",
      "packigs & gland packing.jpg",
      "rubbers sheeting.jpg"
    ],
    services: ["PTFE tape & packings", "Hydraulic & mining hose", "Bearings & rubber sheeting", "Mechanical spares"]
  },
  {
    id: "fasteners",
    name: "Fasteners",
    label: "Quality Assurance",
    heroTitle: "Industrial Fasteners & Bolting",
    heroDesc: "High-integrity bolting and fixing solutions with mill certification and full traceability.",
    description: "High-integrity bolting & fixing solutions for industrial structures with full traceability.",
    image: "hex bolt & nuts.jpg",
    gallery: [
      "stainless steel fasteners.jpg",
      "stud bolts & heavy hex nuts.jpg",
      "anchor bolts & expansion fasteners.jpg"
    ],
    services: ["Hex bolts & stud bolts", "Stainless steel fasteners", "Anchor systems", "Mill-certified bolting"]
  },
  {
    id: "gaskets",
    name: "Gaskets",
    label: "Zero Leakage",
    heroTitle: "Engineered Gaskets",
    heroDesc: "Engineered sealing gaskets for piping, flanges and pressure systems across mining and process industries.",
    description: "Engineered sealing gaskets for piping, flanges & pressure systems.",
    image: "spiral wound gasket.jpg",
    gallery: [
      "rubber gasket.jpg",
      "graphite gasket.jpg",
      "envelope gasket.jpg",
      "flat gasket.jpg"
    ],
    services: ["Spiral-wound gaskets", "Ring joint gaskets", "Sheet gaskets", "Custom flange seals"]
  },
  {
    id: "valves",
    name: "Industrial Valves",
    label: "Flow Control",
    heroTitle: "Industrial Valves",
    heroDesc: "Flow control solutions for process, utility and infrastructure systems — gate, ball, butterfly and check valves.",
    description: "Flow control solutions for process, utility & infrastructure systems.",
    image: "ball valves.jpg",
    gallery: [
      "gate valves.jpg",
      "butterfly valve.jpg",
      "check valves.jpg",
      "globe and needle valve.jpg"
    ],
    services: ["Gate & ball valves", "Butterfly & check valves", "Process control valves", "Utility system valves"]
  },
  {
    id: "borehole",
    name: "Borehole Services",
    label: "Water Solutions",
    heroTitle: "Borehole Installation Services",
    heroDesc: "Complete water solutions for Zimbabwe's agriculture, industry and communities — survey to pump supply.",
    description: "Complete water solutions for Zimbabwe's agriculture, industry & communities.",
    image: "borehole installation.jpg",
    gallery: [
      "borehole pumps.jpg",
      "suction & delivery hose.jpg"
    ],
    services: ["Borehole survey & drilling", "Pump supply & installation", "Rising mains", "Rehabilitation services"]
  },
  {
    id: "instrumentation",
    name: "Instrumentation",
    label: "Process Control",
    heroTitle: "Instrumentation & Control",
    heroDesc: "Process instrumentation, drives and control consumables for accurate process control and automation.",
    description: "Process instrumentation, drives & control consumables for accurate process control.",
    image: "plant visit and ins.jpg",
    gallery: [
      "deep groove ball bearing.jpg",
      "cylindrical roller bearing.jpg",
      "spherical roller bearing.jpg",
      "tapered roller bearing.jpg"
    ],
    services: ["VSD drives", "Process sensors", "Panel meters", "Field consumables"]
  },
  {
    id: "security",
    name: "Security & Pumps",
    label: "Field Services",
    heroTitle: "Security, Automation & Pump Services",
    heroDesc: "CCTV, access automation and pump field services for industrial and residential sites across Zimbabwe.",
    description: "CCTV, access automation & pump field services for industrial and residential sites.",
    image: "solar installation.jpg",
    gallery: [
      "metal fabrication.jpg",
      "pneumatic hose,fitting & spares.jpg",
      "felt engineers and hoses.jpg"
    ],
    services: ["CCTV systems", "Gate motors & intercoms", "Pump repair services", "Access automation"]
  }
];

const BRANDS = [
  {
    id: "skf",
    name: "SKF",
    tagline: "Bearings & Seals",
    logo: "6cf65404-71f4-4fcd-91fc-65e3c1d1b7ee.jpg",
    description: "Premium bearings, seals, lubrication systems and condition monitoring for mining, processing and manufacturing plant.",
    categories: ["Seals, Hoses & Spares", "Instrumentation", "Fasteners"],
    color: "#005aaa"
  },
  {
    id: "trelleborg",
    name: "Trelleborg",
    tagline: "Sealing Solutions",
    logo: "8778f40e-2f98-4313-a114-9eb1fcc8d767.jpg",
    description: "Engineered sealing, hose, gasket and polymer solutions for harsh industrial, mining and hydraulic applications.",
    categories: ["Gaskets", "Seals, Hoses & Spares", "Industrial Valves"],
    color: "#003865"
  },
  {
    id: "nok",
    name: "NOK",
    tagline: "Oil Seals & O-Rings",
    logo: "b3514d9c-0205-4151-8208-8df5900e216b.jpg",
    description: "Japanese-quality oil seals, O-rings, packings and rubber sealing components for pumps, gearboxes and hydraulic systems.",
    categories: ["Gaskets", "Seals, Hoses & Spares"],
    color: "#c8102e"
  },
  {
    id: "synergy",
    name: "Synergy",
    tagline: "Industrial Products",
    logo: "91fbe912-1f80-41e4-b5b8-42a44fac542a.jpg",
    description: "Trusted Synergy-branded industrial consumables, sealing products and maintenance supplies for plant operations.",
    categories: ["Webbing Tapes", "Seals, Hoses & Spares", "Fasteners"],
    color: "#0c2340"
  },
  {
    id: "hilite",
    name: "Hilite",
    tagline: "Industrial Grade",
    logo: "58ee30fb-90b8-49e9-a721-73ebec9ebe74.jpg",
    description: "Hilite industrial tapes, sealing materials and specialty products for construction, mining and utility projects.",
    categories: ["Webbing Tapes", "Gaskets", "Seals, Hoses & Spares"],
    color: "#1f5c4f"
  }
];

const SECTORS = [
  "Mining & Quarrying",
  "Construction & Infrastructure",
  "Agriculture & Irrigation",
  "Power Generation",
  "Water Utilities & Boreholes",
  "General Manufacturing"
];

const VALUES = [
  "Quality & Traceability",
  "Technical Expertise",
  "Pan-Zimbabwe Reach",
  "Reliability & Integrity",
  "Client-Focused Solutions",
  "Industry Excellence"
];

const KEY_SERVICES = [
  {
    title: "Industrial Fasteners & Bolting",
    text: "Hex bolts, stainless steel fasteners, stud bolts, and anchor systems with mill certification and full traceability."
  },
  {
    title: "Seals, Hoses & Mechanical Spares",
    text: "PTFE tape, hydraulic and mining hose, bearings, packings, and rubber sheeting for plant maintenance."
  },
  {
    title: "Borehole & Water Solutions",
    text: "End-to-end borehole survey, drilling, pump supply, rising mains, and rehabilitation across Zimbabwe."
  },
  {
    title: "Instrumentation & Control",
    text: "VSD drives, process sensors, panel meters, and field consumables for accurate process control."
  },
  {
    title: "Security & Automation",
    text: "CCTV systems, gate motors, intercoms, and pump repair services for industrial and residential sites."
  },
  {
    title: "Valves & Gaskets",
    text: "Gate, ball, butterfly, and check valves plus spiral-wound, ring joint, and sheet gaskets."
  }
];

const CONTACT = {
  email: "info.kunfrepvtltd@gmail.com",
  phone1: "+263719333422",
  phone2: "+263783249344",
  whatsapp: "https://wa.me/263719333422",
  address: "32065 Mabvazuva, Ruwa, Harare, Zimbabwe",
  maps: "https://www.google.com/maps/search/?api=1&query=32065+Mabvazuva+Ruwa+Harare+Zimbabwe",
  instagram: "https://www.instagram.com/kunfre_tek_?igsh=aG1iZ2VxdDMxa3hi",
  facebook: "https://www.facebook.com/profile.php?id=100083140241518"
};

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: CONTACT.instagram,
    icon: "7d0451fc-071d-4d79-b5e4-4161da08f259.jpg"
  },
  {
    name: "Facebook",
    url: CONTACT.facebook,
    icon: "fd157238-7f50-4846-bdd2-2daf74874b78.jpg"
  },
  {
    name: "WhatsApp",
    url: CONTACT.whatsapp,
    icon: "bafbfdb2-0e39-48f2-acb9-c18d29663704.jpg"
  },
  {
    name: "Email",
    url: "mailto:" + CONTACT.email,
    icon: "d5495d8f-4dab-40c2-a7e4-f398e30069bc.jpg",
    external: false
  }
];
