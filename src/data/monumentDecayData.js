/**
 * Monument Decay & Heritage Acid Erosion Dataset
 * 
 * Calibrated against Archaeological Survey of India (ASI) reports,
 * Georgia Tech & IIT Kanpur aerosol research on the Taj Mahal,
 * and Supreme Court of India Taj Trapezium Zone (TTZ) judicial proceedings.
 */

export const MONUMENTS_DATA = [
  {
    id: 'taj_mahal',
    name: 'The Taj Mahal',
    location: 'Agra, Uttar Pradesh (Yamuna River Basin)',
    builtYear: '1632 - 1648 CE',
    material: 'Translucent White Makrana Marble (Calcium Carbonate, CaCO₃)',
    designation: 'UNESCO World Heritage Site & Global Wonder',
    primaryThreats: [
      'Sulfur Dioxide (SO₂) from Mathura Refinery & Agra iron foundries',
      'Black & Brown Carbon soot from regional biomass & diesel traffic',
      'Yamuna riverbed drying leading to dry abrasive silica dust plumes'
    ],
    chemicalReaction: {
      reactants: 'CaCO₃ (White Marble) + H₂SO₄ (Acid Rain) + 2H₂O',
      products: 'CaSO₄ · 2H₂O (Brown/Black Gypsum Crust) + CO₂ ↑',
      consequence: 'Soluble gypsum crust expands by 125%, crumbling delicate marble carvings and permanently trapping black carbon soot inside stone micro-cavities.'
    },
    // Timeline steps from 1970 to 2045
    timeline: [
      {
        year: 1970,
        label: '1970: Pristine Luster',
        status: 'Pristine White Makrana Marble',
        aqiAvg: 45,
        so2ppb: 8,
        blackCarbonUgm3: 2.1,
        whitenessIndex: '96% (Original Translucent Luster)',
        gypsumCrustThicknessUm: 0.2,
        stoneLossRate: '0.02 mm/century',
        marbleColor: '#fbfbfb',
        sootOpacity: 0.0,
        fogDensity: 0.003,
        fogColor: 0x87ceeb, // Sky blue
        notes: 'Pre-industrial regional baseline. Natural Makrana crystalline reflections remain completely unoccluded.'
      },
      {
        year: 1995,
        label: '1995: Early Yellowing & Legal Wakeup',
        status: 'Early Sulfuric Yellow Patina',
        aqiAvg: 165,
        so2ppb: 38,
        blackCarbonUgm3: 14.8,
        whitenessIndex: '78% (Yellowish Discoloration Along Rain Channels)',
        gypsumCrustThicknessUm: 4.8,
        stoneLossRate: '0.18 mm/century',
        marbleColor: '#ece2c6',
        sootOpacity: 0.25,
        fogDensity: 0.009,
        fogColor: 0x94a3b8, // Slate gray
        notes: 'Mathura Oil Refinery and hundreds of coal-fired glassworks in Firozabad and Agra lead to the Supreme Court Taj Trapezium Zone (TTZ) PIL by M.C. Mehta.'
      },
      {
        year: 2024,
        label: '2024: Present Anthropocene Crisis',
        status: 'Brown-Yellow Crust & Diesel Soot Infiltration',
        aqiAvg: 298,
        so2ppb: 54,
        blackCarbonUgm3: 28.4,
        whitenessIndex: '54% (Heavy Brown-Yellow Gypsum & Soot)',
        gypsumCrustThicknessUm: 14.2,
        stoneLossRate: '0.62 mm/century',
        marbleColor: '#9c8362',
        sootOpacity: 0.65,
        fogDensity: 0.018,
        fogColor: 0x64748b, // Smoggy brownish gray
        notes: 'High ambient Black Carbon (BC) and non-carbonate Brown Carbon tar droplets from stubble burning and highway transit adhere to the pitted gypsum layer.'
      },
      {
        year: 2045,
        label: '2045 (Projected): Structural Spalling',
        status: 'Severe Black Crust & Marble Pitting',
        aqiAvg: 410,
        so2ppb: 82,
        blackCarbonUgm3: 45.0,
        whitenessIndex: '31% (Extensive Black Crust & Loss of Relief)',
        gypsumCrustThicknessUm: 32.5,
        stoneLossRate: '1.45 mm/century',
        marbleColor: '#4f4133',
        sootOpacity: 0.95,
        fogDensity: 0.028,
        fogColor: 0x334155, // Toxic thick smog
        notes: 'Unchecked transboundary smog causes deep exfoliating spalling, irreversibly dissolving delicate Pietra Dura floral semiprecious stone inlays.'
      }
    ],
    restorationTechnique: {
      name: 'Archaeological Multani Mitti (Fuller’s Earth) Mud-Pack Treatment',
      scientificBasis: 'A non-abrasive clay paste (lime-free bentonite / attapulgite clay) is applied at 2-3mm thickness over marble. As it slowly dries over 48 hours, capillary suction extracts embedded sulfuric salts, hydrocarbons, and black carbon soot out of marble micropores without mechanical scratching.',
      annualApplicationArea: 'Over 12,000 sq meters per cleaning cycle',
      durability: 'Restores whiteness to ~88%, but discoloration returns within 3-4 years under current ambient air conditions.'
    }
  },

  {
    id: 'india_gate',
    name: 'India Gate',
    location: 'New Delhi (Rajpath / Kartavya Path Axis)',
    builtYear: '1921 - 1931 CE',
    material: 'Bharatpur & Dholpur Red/Pale Sandstone',
    designation: 'National War Memorial Arch of India',
    primaryThreats: [
      'Heavy vehicular diesel black carbon from central Delhi transit junctions',
      'Ammonium Nitrate (NH₄NO₃) secondary particulate aerosol crystallization',
      'Wind-blown silica particulate micro-sandblasting during summer pre-monsoon dust storms'
    ],
    chemicalReaction: {
      reactants: 'SiO₂ + Fe₂O₃ (Sandstone matrix) + High NOx / Acid Aerosols',
      products: 'Soluble nitrate salt crystallization inside pores + Dark Black Carbon staining',
      consequence: 'Sub-efflorescence pressure from expanding nitrate salts forces quartz sandstone grains to flake away, dulling the warm ochre-red color into drab charcoal gray.'
    },
    timeline: [
      {
        year: 1970,
        label: '1970: Golden Sandstone Warmth',
        status: 'Crisp Red & Pale Dholpur Sandstone',
        aqiAvg: 55,
        so2ppb: 12,
        blackCarbonUgm3: 3.5,
        whitenessIndex: '94% (Natural Ochre Warmth)',
        gypsumCrustThicknessUm: 0.5,
        stoneLossRate: '0.04 mm/century',
        marbleColor: '#d97736',
        sootOpacity: 0.0,
        fogDensity: 0.003,
        fogColor: 0x87ceeb,
        notes: 'Clean central ceremonial axis with clear views of the Rashtrapati Bhavan dome.'
      },
      {
        year: 1995,
        label: '1995: Traffic Boom & Dark Patina',
        status: 'Traffic Soot Accumulation on Cornice',
        aqiAvg: 210,
        so2ppb: 42,
        blackCarbonUgm3: 21.0,
        whitenessIndex: '72% (Dark Soot Streaks on Arch Frieze)',
        gypsumCrustThicknessUm: 6.2,
        stoneLossRate: '0.24 mm/century',
        marbleColor: '#b45a27',
        sootOpacity: 0.35,
        fogDensity: 0.012,
        fogColor: 0x94a3b8,
        notes: 'Pre-CNG conversion era: Unregulated diesel exhaust from thousands of buses and trucks coats the porous sandstone facade.'
      },
      {
        year: 2024,
        label: '2024: Present Heavy Diesel & Nitrate Film',
        status: 'Charcoal Soot Crust & Surface Flaking',
        aqiAvg: 362,
        so2ppb: 48,
        blackCarbonUgm3: 36.2,
        whitenessIndex: '48% (Severe Charcoal Smudge on East/West Facades)',
        gypsumCrustThicknessUm: 18.0,
        stoneLossRate: '0.88 mm/century',
        marbleColor: '#6e4530',
        sootOpacity: 0.75,
        fogDensity: 0.022,
        fogColor: 0x475569,
        notes: 'Winter smog episodes envelop the arch in dense aerosol blankets; nitrogen oxide salts crystallize within porous carved inscriptions.'
      },
      {
        year: 2045,
        label: '2045 (Projected): Inscription Erosion',
        status: 'Granular Stone Disintegration',
        aqiAvg: 480,
        so2ppb: 75,
        blackCarbonUgm3: 58.0,
        whitenessIndex: '28% (Deep Salt Weathering & Sand Disaggregation)',
        gypsumCrustThicknessUm: 38.0,
        stoneLossRate: '1.92 mm/century',
        marbleColor: '#3a271f',
        sootOpacity: 0.95,
        fogDensity: 0.032,
        fogColor: 0x1e293b,
        notes: 'The carved names of 13,300 fallen soldiers risk becoming illegible as acidic micro-abrasion strips the sandstone lettering.'
      }
    ],
    restorationTechnique: {
      name: 'Micro-Steam Vapor Extraction & Low-Pressure Water-Jet Scrubbing',
      scientificBasis: 'ASI conservators use controlled 140°C saturated micro-steam to liquefy hydrophobic diesel waxes and unbind carbon soot without using harsh chemical solvents that dissolve sandstone silicate bonding.',
      annualApplicationArea: 'Complete arch and cornice wash conducted periodically',
      durability: 'Clean appearance lasts 1-2 years before severe winter smog re-deposits the carbon blanket.'
    }
  }
];
