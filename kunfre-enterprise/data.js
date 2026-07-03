export const SITE = {
  name: "Kunfre Enterprise",
  legalName: "Kunfre Hardware (Pvt) Ltd",
  tagline: "Industrial Sealing · Electrical · Electronics · Instrumentation",
  motto: "Pinnacle of Reliability",
  email: "info.kunfrepvtltd@gmail.com",
  phone1: "+263 719 333 422",
  phone2: "+263 783 249 344",
  website: "www.kunfre.com",
  location: "32065 Mabvazuva, Ruwa, Harare, Zimbabwe",
  address: "32065 Mabvazuva, Ruwa, Harare, Zimbabwe",
  hours: "Monday – Friday: 08:00 – 17:00",
  whatsapp: "https://wa.me/263719333422",
  instagram: "https://www.instagram.com/kunfre_tek_?igsh=aG1iZ2VxdDMxa3hi",
  facebook: "https://www.facebook.com/profile.php?id=100083140241518",
};

export const STATS = [
  { value: "5+", label: "Years of Operation" },
  { value: "600+", label: "Product Lines" },
  { value: "ISO-Aligned", label: "Quality Standards" },
  { value: "Pan African and Asia", label: "Coverage" },
];

export const SECTORS = [
  "Mining & Quarrying",
  "Construction & Infrastructure",
  "Agriculture & Irrigation",
  "Power Generation",
  "Water Utilities & Boreholes",
  "General Manufacturing",
];

export const CATEGORIES = [
  {
    id: "webbing-tapes",
    number: "01",
    title: "Webbing Tapes",
    subtitle: "High-Strength Woven & Synthetic Tapes for Industrial Load Securing",
    description:
      "Kunfre supplies a comprehensive range of webbing tapes engineered for demanding industrial, lifting, and packaging applications. Manufactured from high-tenacity polyester, polypropylene, and nylon yarns, our tapes offer superior tensile strength, UV resistance, and dimensional stability.",
    products: [
      {
        id: "polyester-flat-webbing",
        name: "Polyester Flat Webbing Tape",
        description:
          "Heavy-duty flat webbing from high-tenacity polyester yarns. Resistant to UV radiation, moisture, and most industrial chemicals. Ideal for cargo securing, lashing, and lifting slings.",
        specs: {
          "Width Range": "25 mm – 150 mm",
          Thickness: "1.5 mm – 4.0 mm",
          "Breaking Strength": "Up to 50 kN",
          Material: "100% High-Tenacity Polyester",
          "Temperature Range": "-40 °C to +120 °C",
          "Elongation at Break": "< 15%",
          Colour: "Custom / Standard Black & Safety Yellow",
        },
      },
      {
        id: "pp-webbing",
        name: "Polypropylene (PP) Webbing Tape",
        description:
          "Lightweight, cost-effective polypropylene webbing suitable for packaging, general cargo, and consumer goods strapping.",
        specs: {
          "Width Range": "15 mm – 100 mm",
          "Breaking Strength": "Up to 20 kN",
          Material: "100% Polypropylene",
          "Temperature Range": "-20 °C to +80 °C",
          "Moisture Absorption": "< 0.1%",
          Colour: "Multi-colour / Custom Print",
        },
      },
      {
        id: "nylon-webbing",
        name: "Nylon (Polyamide) Webbing Tape",
        description:
          "High-elasticity nylon webbing providing excellent shock-load absorption. Preferred in safety harness and fall arrest applications.",
        specs: {
          "Width Range": "25 mm – 75 mm",
          "Breaking Strength": "Up to 35 kN",
          Material: "Nylon 6 / Nylon 6.6",
          Elongation: "18 – 22% at rated load",
          "Abrasion Resistance": "Excellent",
          Certifications: "CE / EN 354 Compatible",
        },
      },
      {
        id: "flame-retardant-webbing",
        name: "Flame-Retardant Webbing Tape",
        description:
          "Woven webbing incorporating inherent flame-retardant fibres meeting international fire safety standards. Used in offshore, marine, and rail environments.",
        specs: {
          "Width Range": "25 mm – 100 mm",
          "Breaking Strength": "Up to 25 kN",
          "Flame Standard": "UL94-V0 / ISO 6941 / BS 5867",
          LOI: "> 28%",
          "Operating Temperature": "Up to +150 °C continuous",
        },
      },
    ],
  },
  {
    id: "seals-hoses-spares",
    number: "02",
    title: "Industrial Seals, Hoses & Mechanical Spares",
    subtitle: "Sealing, Belting, Hose & Mechanical Spares for Process & Plant Maintenance",
    description:
      "Our sealing and mechanical spares portfolio is engineered to provide leak-free, long-service-life performance across hydraulic, pneumatic, chemical, and thermal systems, and now extends to the bearings, packings, hose, rope, and rubber consumables needed for everyday plant maintenance and shutdowns.",
    products: [
      {
        id: "ptfe-seal-tape",
        name: "PTFE Thread Seal Tape",
        description:
          "Virgin-grade expanded PTFE tape for sealing pipe threads in gas, water, and chemical service.",
        specs: {
          Width: "12 mm / 19 mm / 25 mm",
          Thickness: "0.075 mm – 0.10 mm",
          Density: "0.35 – 0.40 g/cm³",
          "Temperature Range": "-200 °C to +260 °C",
          "Pressure Rating": "Up to 100 bar",
          Compliance: "NSF 61 / WRAS grades available",
        },
      },
      {
        id: "butyl-rubber-tape",
        name: "Butyl Rubber Sealing Tape",
        description:
          "Self-adhesive butyl rubber tape offering outstanding water, air, and vapour barrier properties. Used for roofing, glazing, HVAC duct sealing, and cable waterproofing.",
        specs: {
          "Width Range": "50 mm – 150 mm",
          Thickness: "1.0 mm – 3.0 mm",
          "Service Temperature": "-30 °C to +80 °C",
          Elongation: "> 500%",
          "Water Vapour Transmission": "< 0.1 g/m²/day",
          "Adhesion to Steel": "> 8 N/25 mm",
        },
      },
      {
        id: "self-amalgamating-tape",
        name: "Self-Amalgamating (Self-Fusing) Tape",
        description:
          "Silicone or EPR-based tape that fuses to itself under hand tension, creating a seamless insulation and sealing layer — no adhesive required.",
        specs: {
          Width: "19 mm / 25 mm / 50 mm",
          "Dielectric Strength": "> 30 kV/mm",
          "Temperature Range": "-55 °C to +200 °C (silicone grade)",
          "Tensile Strength": "> 5 MPa",
          Application: "Electrical, Hydraulic, Pneumatic pipe sealing",
        },
      },
      {
        id: "foam-sealing-tape",
        name: "Foam Sealing Tape (PE / EPDM)",
        description:
          "Closed-cell polyethylene and EPDM foam tapes for gap filling, vibration damping, and weather sealing. Available with single or double-sided adhesive.",
        specs: {
          "Width Range": "6 mm – 100 mm",
          Thickness: "1.5 mm – 25 mm",
          "Compression Set": "< 25% at 50% deflection",
          "Temperature Range": "-40 °C to +90 °C",
          Adhesive: "Acrylic / Rubber (single or double sided)",
        },
      },
      {
        id: "bearings",
        name: "Bearings",
        description:
          "Ball, roller, and plain bearings for pumps, motors, conveyors, and gearboxes. Stocked in standard metric and imperial bore sizes with sealed, shielded, and open variants.",
        specs: {
          "Bearing Types": "Deep Groove Ball / Spherical Roller / Taper Roller / Pillow Block",
          "Bore Range": "6 mm – 200 mm",
          Material: "Chrome Steel (AISI 52100) / Stainless Steel",
          Sealing: "Open / ZZ (Shielded) / 2RS (Sealed)",
          "Speed Rating": "Up to 10,000 rpm (size dependent)",
          Standard: "ISO 15 / DIN 625 / ABMA",
        },
      },
      {
        id: "packings-gland",
        name: "Packings & Gland Packing",
        description:
          "Braided and die-formed gland packing for pumps, valves, and agitator shafts handling water, steam, oil, and abrasive slurries.",
        specs: {
          "Packing Types": "PTFE / Graphite / Aramid / Flax-Cotton",
          "Cross-Section": "3 mm – 25 mm square",
          "Temperature Range": "-40 °C to +280 °C (graphite grade)",
          "Pressure Rating": "Up to 200 bar (static)",
          "Shaft Speed": "Up to 20 m/s (rotary service)",
          Form: "Braided rope / Die-formed rings",
        },
      },
      {
        id: "hydraulic-hose",
        name: "Hydraulic Hose, Fittings & Spares",
        description:
          "High-pressure hydraulic hose, crimped fittings, quick-release couplings, and seal kits for mobile and industrial hydraulic systems.",
        specs: {
          "Hose Standard": "SAE 100R1 / R2 / R12 / R13",
          "Bore Size": '6 mm – 51 mm (1/4" – 2")',
          "Working Pressure": "Up to 420 bar (size dependent)",
          "Burst Pressure": "4x working pressure (min.)",
          Fittings: "BSP / NPT / Metric / JIC / Flange",
          "Temperature Range": "-40 °C to +100 °C",
        },
      },
      {
        id: "pneumatic-hose",
        name: "Pneumatic Hose, Fittings & Spares",
        description:
          "Reinforced PVC and polyurethane air hose with push-fit and threaded fittings, regulators, and cylinder seal kits for compressed-air systems.",
        specs: {
          "Hose Material": "PVC / Polyurethane (PU) / Rubber",
          "Bore Size": "4 mm – 50 mm",
          "Working Pressure": "Up to 20 bar",
          Fittings: "Push-Fit / BSP / Quick-Connect",
          "Temperature Range": "-20 °C to +70 °C",
          Application: "Pneumatic tools, control lines, blow-off systems",
        },
      },
      {
        id: "mining-hose",
        name: "Mining Hose",
        description:
          "Abrasion- and impact-resistant rubber hose for slurry, dewatering, and ore-handling duties in underground and surface mining operations.",
        specs: {
          "Hose Types": "Slurry / Dewatering / Air & Water / Tyre Filling",
          "Bore Size": "25 mm – 300 mm",
          "Working Pressure": "Up to 16 bar (size dependent)",
          Cover: "Abrasion & Ozone Resistant Rubber",
          Reinforcement: "Textile / Steel Wire Helix",
          "Temperature Range": "-25 °C to +80 °C",
        },
      },
      {
        id: "industrial-felt",
        name: "Industrial Felt",
        description:
          "Wool and synthetic felt strip and sheet for sealing, padding, polishing, and vibration damping in mechanical and electrical assemblies.",
        specs: {
          "Felt Types": "Wool Felt / Synthetic (Polyester) Felt",
          Thickness: "1.5 mm – 25 mm",
          Density: "0.20 – 0.45 g/cm³",
          Width: "Roll & sheet, custom slit on request",
          Application: "Gaskets, wipers, dust seals, polishing",
        },
      },
      {
        id: "wire-rope",
        name: "Wire Rope & Fibre Rope",
        description:
          "Galvanised and ungalvanised steel wire rope alongside polyester, polypropylene, and natural-fibre rope for lifting, rigging, and general industrial use.",
        specs: {
          "Wire Rope Construction": "6x19 / 6x36 / 8x19 IWRC",
          "Wire Rope Diameter": "6 mm – 32 mm",
          "Fibre Rope Material": "Polyester / Polypropylene / Sisal",
          "Breaking Strength": "Up to 600 kN (wire), 40 kN (fibre)",
          Finish: "Bright / Galvanised",
          Standard: "EN 12385 / ISO 2408",
        },
      },
      {
        id: "rubber-sheeting",
        name: "Insertion Rubber & Rubber Sheeting",
        description:
          "Fabric-reinforced and plain rubber sheeting for gasketing, lining, conveyor skirting, and wear pads.",
        specs: {
          "Rubber Types": "Natural / Neoprene / Nitrile / EPDM / SBR",
          Reinforcement: "Plain / Single or Multi-Ply Insertion",
          Thickness: "1.5 mm – 50 mm",
          Hardness: "40 – 70 Shore A",
          "Temperature Range": "-30 °C to +120 °C (grade dependent)",
          "Sheet Size": "Up to 1.4 m wide, custom cut to length",
        },
      },
      {
        id: "suction-hose",
        name: "Suction & Delivery Hose",
        description:
          "Reinforced rubber and PVC suction hose for water transfer, dewatering pumps, and irrigation, resistant to collapse under vacuum.",
        specs: {
          "Hose Types": "PVC Spiral Suction / Rubber Suction & Delivery",
          "Bore Size": "25 mm – 200 mm",
          "Vacuum Rating": "Full vacuum (collapse-resistant)",
          "Working Pressure": "Up to 10 bar (delivery duty)",
          Reinforcement: "Rigid PVC Helix / Textile Ply",
          "Temperature Range": "-10 °C to +60 °C",
        },
      },
      {
        id: "jointing-materials",
        name: "Jointing Materials",
        description:
          "Compressed fibre and rubberised jointing sheet for cutting custom gaskets on-site across water, oil, and general process pipework.",
        specs: {
          Materials: "Compressed Fibre / Rubberised Cork / Graphite-Coated",
          Thickness: "0.5 mm – 3.0 mm",
          "Pressure Rating": "Up to PN40 (material dependent)",
          "Temperature Range": "-20 °C to +250 °C",
          "Sheet Size": "1m x 1m / 1.5m x 1.5m standard sheets",
          Standard: "DIN 3754 / ASTM F104",
        },
      },
    ],
  },
  {
    id: "fasteners",
    number: "03",
    title: "Fasteners",
    subtitle: "High-Integrity Bolting & Fixing Solutions for Industrial Structures",
    description:
      "Kunfre stocks a full range of industrial fasteners — from standard hex bolts and nuts to specialised flange, stud, and anchor bolts — in carbon steel, stainless steel, and high-alloy grades, with full traceability and mill certification available.",
    products: [
      {
        id: "hex-bolts",
        name: "Hex Bolts & Nuts (Grade 8.8 / 10.9 / 12.9)",
        description:
          "Fully and partially threaded hex bolts to ISO 4014/4017, paired with ISO 4032 hex nuts.",
        specs: {
          "Size Range": "M6 – M64",
          Grade: "8.8 / 10.9 / 12.9",
          Material: "Medium Carbon Steel / Alloy Steel",
          Thread: "ISO Metric Coarse & Fine",
          Finish: "Zinc Plated / HDG / Geomet / Black Oxide",
          Standard: "ISO 4014, ISO 4017, ISO 4032",
        },
      },
      {
        id: "stainless-fasteners",
        name: "Stainless Steel Fasteners (A2 / A4)",
        description:
          "Austenitic stainless steel bolts, screws, and nuts providing excellent corrosion resistance for marine, food processing, pharmaceutical, and chemical plant applications.",
        specs: {
          Grades: "A2-70 / A4-70 / A4-80",
          "Size Range": "M3 – M36",
          Material: "304 SS (A2) / 316 SS (A4)",
          "Yield Strength": "600 – 800 MPa",
          Standard: "ISO 3506",
        },
      },
      {
        id: "stud-bolts",
        name: "Stud Bolts & Heavy Hex Nuts (ASTM B7 / B8)",
        description:
          "Fully threaded stud bolts for pressure vessel, flange, and pipeline applications. Supplied individually or as complete bolting sets with mill test reports.",
        specs: {
          Specification: "ASTM A193 B7 / B8 / B8M",
          "Nut Specification": "ASTM A194 2H / 8 / 8M",
          "Size Range": '1/2" – 4" (custom larger on request)',
          Thread: "UNC / UNF / Metric",
          Temperature: "B7: up to +540 °C; B8M: cryogenic service",
        },
      },
      {
        id: "anchor-bolts",
        name: "Anchor Bolts & Expansion Fasteners",
        description:
          "Cast-in-place, chemical anchor, and mechanical expansion bolts for structural steel-to-concrete connections and equipment foundation fixing.",
        specs: {
          Types: "Cast-in / Chemical / Sleeve / Wedge Anchor",
          "Size Range": "M8 – M30 (expansion); M12 – M64 (cast-in)",
          Material: "Carbon Steel HDG / Stainless Steel",
          Standard: "EN 1992-4 / ETAG 001",
        },
      },
    ],
  },
  {
    id: "gaskets",
    number: "04",
    title: "Gaskets",
    subtitle: "Engineered Sealing Gaskets for Piping, Flanges & Pressure Systems",
    description:
      "Our gasket portfolio covers the full spectrum — from soft non-metallic sheet gaskets to spiral-wound and ring joint types for high-pressure, high-temperature service. All gaskets are available to ASME, EN, and BS dimensional standards.",
    products: [
      {
        id: "spiral-wound",
        name: "Spiral-Wound Gaskets (SWG)",
        description:
          "Semi-metallic gaskets formed by winding metallic strip and soft filler in a spiral. The most widely used gasket type for high-pressure and high-temperature flange connections.",
        specs: {
          "Pressure Class": "ASME Class 150 – 2500 / PN6 – PN420",
          "Size Range": '1/2" NPS – 60" NPS',
          "Winding Material": "316L SS / Inconel 625 / Hastelloy C276",
          "Filler Material": "Flexible Graphite / PTFE / Mica",
          Standard: "ASME B16.20 / EN 12560-2",
          Temperature: "Up to +1000 °C (graphite filler)",
        },
      },
      {
        id: "ring-joint",
        name: "Ring Joint Gaskets (RTJ – R / RX / BX)",
        description:
          "Solid metallic ring gaskets for API flanges and high-integrity wellhead and subsea connections.",
        specs: {
          "Ring Types": "Oval / Octagonal (R); RX; BX (pressure-energised)",
          Material: "Soft Iron / CS / 316 SS / Inconel / Monel",
          "Hardness (Brinell)": "90 – 200 HB (per API 6A)",
          "Pressure Rating": "Up to 20,000 psi (API 6A BX)",
          Standard: "ASME B16.20 / API 6A",
        },
      },
      {
        id: "sheet-gaskets",
        name: "Full-Face & Raised-Face Sheet Gaskets",
        description:
          "Cut gaskets from compressed fibre, PTFE, rubber, or graphite sheet for standard ASME / EN flange connections.",
        specs: {
          Materials: "CNAF / Pure PTFE / EPDM / Neoprene / Graphite",
          "Pressure Rating": "Up to PN100 (material dependent)",
          Temperature: "-200 °C to +450 °C (material dependent)",
          Size: "Custom cut to ASME B16.21 / EN 1514-1",
          Thickness: "0.8 mm, 1.5 mm, 2.0 mm, 3.0 mm",
        },
      },
      {
        id: "kammprofile",
        name: "Kammprofile (Grooved) Gaskets",
        description:
          "Solid metallic core with concentric serrated grooves, faced with soft sealing material. Ideal for heat exchangers.",
        specs: {
          "Core Material": "316 SS / Carbon Steel / Inconel",
          Facing: "Flexible Graphite / PTFE",
          "Pressure Class": "ASME Class 150 – 1500",
          "Size Range": '1" – 48" NPS',
          Standard: "EN 12560-6 / ASME B16.20",
          "Re-usability": "Core is re-usable; re-face for repeated use",
        },
      },
    ],
  },
  {
    id: "valves",
    number: "05",
    title: "Industrial Valves",
    subtitle: "Flow Control Solutions for Process, Utility & Infrastructure Systems",
    description:
      "Kunfre Enterprise supplies a wide range of industrial valves for fluid and gas control across Zimbabwe's mining, water, agriculture, and process industries. Our valve portfolio covers isolation, regulation, and non-return functions in materials suited to each application.",
    products: [
      {
        id: "gate-valves",
        name: "Gate Valves",
        description:
          "Full-bore gate valves for isolation service in water, steam, and general industrial pipelines. Low-pressure-drop design when fully open.",
        specs: {
          "Size Range": 'DN15 – DN600 (1/2" – 24")',
          "Pressure Rating": "PN10 / PN16 / PN25 / Class 150 – 300",
          "Body Material": "Cast Iron / Ductile Iron / WCB Carbon Steel / 316 SS",
          "Seat Material": "Bronze / SS / Resilient EPDM",
          Standard: "BS 5163 / API 600 / AWWA C500",
          "End Connection": "Flanged / Socket Weld / Butt Weld",
        },
      },
      {
        id: "ball-valves",
        name: "Ball Valves",
        description:
          "Quarter-turn ball valves providing tight shut-off and fast actuation. Available in floating ball and trunnion-mounted designs.",
        specs: {
          "Size Range": "DN6 – DN300",
          "Pressure Rating": "PN16 – PN100 / Class 150 – 600",
          "Body Material": "Carbon Steel / 316 SS / Brass / PVC",
          "Seat Material": "PTFE / RPTFE / Metal-to-metal",
          Standard: "API 6D / BS EN 17292",
          Operation: "Manual / Pneumatic / Electric Actuator",
        },
      },
      {
        id: "butterfly-valves",
        name: "Butterfly Valves",
        description:
          "High-performance centric and double-offset butterfly valves for large-bore isolation and throttling in water treatment, HVAC, and process piping.",
        specs: {
          "Size Range": "DN50 – DN1200",
          "Pressure Rating": "PN10 / PN16 / PN25",
          "Body Material": "Ductile Iron / Carbon Steel / 316 SS",
          "Disc Material": "Ductile Iron / SS / Bronze",
          "Liner / Seat": "EPDM / NBR / PTFE / Metal",
          Standard: "EN 593 / API 609",
        },
      },
      {
        id: "check-valves",
        name: "Check Valves (Non-Return Valves)",
        description:
          "Swing and dual-plate check valves for preventing reverse flow in pump discharge lines, borehole installations, and pipeline systems.",
        specs: {
          Types: "Swing Check / Dual Plate / Lift Check / Foot Valve",
          "Size Range": "DN15 – DN600",
          "Pressure Rating": "PN10 – PN40 / Class 150 – 300",
          "Body Material": "Cast Iron / Carbon Steel / SS",
          Standard: "API 594 / BS 5153",
        },
      },
      {
        id: "globe-needle-valves",
        name: "Globe & Needle Valves",
        description:
          "Precision flow-control globe and needle valves for throttling and regulation service in instrumentation, chemical dosing, and utility systems.",
        specs: {
          "Size Range": "DN6 – DN200",
          "Pressure Rating": "PN16 – PN63 / Class 800 – 1500",
          "Body Material": "Carbon Steel / 316 SS / Brass",
          Trim: "SS / Monel / Stellite-faced",
          Standard: "BS 1873 / ASME B16.34",
        },
      },
    ],
  },
  {
    id: "borehole-services",
    number: "06",
    title: "Borehole Installation Services",
    subtitle: "Complete Water Solutions for Zimbabwe's Agriculture, Industry & Communities",
    description:
      "Kunfre Enterprise offers end-to-end borehole installation and rehabilitation services across Zimbabwe. From site survey and drilling coordination to pump selection, pipework, and commissioning, we deliver reliable water supply solutions for farms, mines, schools, communities, and industrial facilities.",
    products: [
      {
        id: "site-survey",
        name: "Site Survey & Hydrogeological Assessment",
        description:
          "Geophysical survey using resistivity and electromagnetic methods to identify optimal drilling points. Full hydrogeological reporting supplied.",
        specs: {
          "Survey Method": "Resistivity / VES / EM Survey",
          Deliverable: "Hydrogeological report & drilling recommendations",
          Coverage: "All provinces of Zimbabwe",
        },
      },
      {
        id: "borehole-drilling",
        name: "Borehole Drilling & Casing",
        description:
          "Air rotary and rotary percussion drilling to recommended depths. Steel and uPVC casing installed with gravel pack and sanitary seal.",
        specs: {
          "Drilling Method": "Air Rotary / Rotary Percussion",
          "Casing Material": "Steel / uPVC Class 6 & Class 9",
          Depths: "Up to 200 m (deeper on consultation)",
          Development: "Air surge & pump development to optimise yield",
        },
      },
      {
        id: "pump-installation",
        name: "Pump Supply & Installation",
        description:
          "Supply and installation of submersible and surface centrifugal pumps from leading brands. Pump selection matched to borehole yield and system demand.",
        specs: {
          "Pump Types": "Submersible / Surface Centrifugal / Solar Pump",
          "Power Options": "Grid / Generator / Solar PV",
          Brands: "Grundfos / Pedrollo / Lorentz Solar / Kirloskar",
          Controls: "Soft-starter / VFD / GSM Remote Monitoring",
        },
      },
      {
        id: "rising-main",
        name: "Rising Main, Pump House & Reticulation",
        description:
          "Supply and installation of HDPE and uPVC rising mains, surface pipework, pump houses, storage tanks, and distribution reticulation.",
        specs: {
          "Pipe Materials": "HDPE PN10/PN16 / uPVC / Galvanised Steel",
          "Tank Supply": "Polyethylene / Steel Elevated / Ground tanks",
          Connections:
            "All pipe fittings, isolating valves, non-return valves, and pressure gauges supplied",
        },
      },
      {
        id: "borehole-rehab",
        name: "Borehole Rehabilitation & Testing",
        description:
          "Rehabilitation of underperforming or collapsed boreholes including jetting, brushing, chemical treatment, and pump replacement.",
        specs: {
          Testing: "Step Drawdown Test / 24-hr Constant Rate Pumping Test",
          Rehabilitation: "Jetting / Redevelopment / Chemical Dosing",
          Reporting:
            "Pump test report, yield recommendation, water quality sampling guidance",
        },
      },
    ],
  },
  {
    id: "instrumentation",
    number: "07",
    title: "Instrumentation & Control",
    subtitle: "Process Instrumentation, Drives & Control Consumables",
    description:
      "Kunfre supplies instrumentation and drive products to keep process control systems accurate and reliable, from field consumables to variable speed drives, sensors, and panel meters used across pumping, mining, and manufacturing installations.",
    products: [
      {
        id: "instrumentation-consumables",
        name: "Instrumentation Consumables",
        description:
          "General field consumables for instrumentation technicians, including cable glands, calibration fluids, thermocouple wire, and termination accessories.",
        specs: {
          "Product Range":
            "Cable Glands / Thermocouple & Compensating Cable / Calibration Fluids / Ferrules & Terminals",
          "Cable Glands": "M16 – M40, Brass & Nylon",
          "Thermocouple Types": "J / K / T / R-S",
          "Enclosure Ratings": "IP65 / IP66 / IP67",
          Application: "Panel wiring, field instrument termination",
        },
      },
      {
        id: "vsd-drives",
        name: "Variable Speed Drives (VSD / VFD)",
        description:
          "Variable speed and variable frequency drives for induction motors, providing soft-start, energy savings, and process control on pumps, fans, and conveyors.",
        specs: {
          "Power Range": "0.37 kW – 315 kW",
          Voltage: "220V Single Phase / 380–415V Three Phase",
          "Control Modes": "Open-Loop V/Hz / Closed-Loop Vector",
          "Protection Rating": "IP20 (panel) / IP54 (enclosed)",
          Communication: "Modbus RTU / RS485 / Ethernet (model dependent)",
          Application: "Pumps, fans, conveyors, compressors",
        },
      },
      {
        id: "process-sensors",
        name: "Process Sensors & Transmitters",
        description:
          "Pressure, temperature, level, and flow sensors and transmitters for process monitoring and control across water, mining, and industrial plants.",
        specs: {
          "Sensor Types":
            "Pressure / Temperature (PT100, Thermocouple) / Level (Ultrasonic, Float) / Flow",
          "Output Signal": "4–20 mA / 0–10V / Digital (Modbus)",
          Accuracy: "±0.25% – ±1% FS (type dependent)",
          "Enclosure Rating": "IP65 / IP68 (submersible level)",
          "Process Connection": "Threaded / Flanged",
        },
      },
      {
        id: "meters-gauges",
        name: "Meters & Gauges",
        description:
          "Panel and field meters, pressure gauges, and flow meters for local indication and monitoring of plant utilities.",
        specs: {
          "Meter Types":
            "Pressure Gauge / Digital Panel Meter / Water & Flow Meter / Energy Meter",
          "Display Size": "63 mm – 150 mm (gauges); Digital LCD/LED (panel meters)",
          Connection: '1/4" / 1/2" BSP (gauges); DIN rail / panel mount (meters)',
          "Accuracy Class": "1.6 / 2.5 (gauges per EN 837)",
          Application: "Pump stations, compressors, boreholes, switchboards",
        },
      },
    ],
  },
  {
    id: "security-pump-services",
    number: "08",
    title: "Security, Automation & Pump Services",
    subtitle: "CCTV, Access Automation & Pump Field Services",
    description:
      "Kunfre's electrical and field services team supplies and installs security, gate automation, and communication systems, and provides pump repair and installation services for boreholes, sumps, and industrial process pumps.",
    products: [
      {
        id: "cctv",
        name: "CCTV & Surveillance Systems",
        description:
          "Supply, installation, and commissioning of analogue and IP CCTV systems for industrial sites, warehouses, and residential security.",
        specs: {
          "Camera Types": "Analogue (AHD/CVI) / IP (Network) / PTZ",
          Resolution: "2MP – 8MP (4K)",
          Recording: "DVR / NVR, 4 – 32 Channel",
          Storage: "HDD up to 10TB, cloud option available",
          Power: "PoE (IP) / 12V DC (analogue)",
          "Night Vision": "IR up to 40 m",
        },
      },
      {
        id: "gate-motors",
        name: "Gate Motors & Access Automation",
        description:
          "Swing and sliding gate motor supply, installation, and maintenance for residential, commercial, and industrial access control.",
        specs: {
          "Motor Types": "Swing Arm / Sliding / Boom Barrier",
          "Gate Weight Capacity": "Up to 1,000 kg (sliding); 400 kg per leaf (swing)",
          "Power Supply": "220V AC with battery backup",
          Control: "Remote Control / Keypad / Intercom Integration",
          "Safety Features": "Photocell beams, anti-crush force limiting",
        },
      },
      {
        id: "intercom",
        name: "Intercom & Access Communication Systems",
        description:
          "Audio and video intercom systems for gate and entrance access control, integrated with gate motors where required.",
        specs: {
          "System Types": "Audio Intercom / Video Intercom / GSM Intercom",
          Connection: "Wired (2-Core/4-Core) / Wireless / GSM-Based",
          "Power Supply": "12V – 24V DC",
          Integration: "Gate Motor Release / Electric Lock Trigger",
          Application: "Residential gates, office entrances, boom gates",
        },
      },
      {
        id: "pump-repairs",
        name: "Pump Repairs & Installation",
        description:
          "Diagnosis, repair, rewinding coordination, and installation of submersible and surface pumps for borehole, sump, irrigation, and industrial process duties.",
        specs: {
          "Pump Types Serviced": "Submersible / Surface Centrifugal / Multistage / Sump",
          Services:
            "Fault Diagnosis / Seal & Bearing Replacement / Rewind Coordination / Installation & Commissioning",
          "Brands Supported": "Grundfos / Pedrollo / Lorentz / Kirloskar / Generic",
          Response: "Site call-out & workshop repair options",
          Testing: "Post-repair performance test before handover",
        },
      },
    ],
  },
];
