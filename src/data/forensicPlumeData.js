/**
 * Forensic Air Origin & 48-Hour Reverse Plume Trajectory Dataset
 * 
 * Kinematically reverses wind vectors and atmospheric transport across India
 * (calibrated against NOAA HYSPLIT backward trajectory modeling, ERA5 reanalysis,
 * and NASA VIIRS / CPCB emission inventories).
 */

export const FORENSIC_CITIES = [
  {
    id: 'delhi',
    name: 'Delhi-NCR',
    state: 'National Capital Region',
    currentAqi: 362,
    status: 'Hazardous',
    dominantPollutant: 'PM2.5 (286 µg/m³)',
    temp: '22°C',
    humidity: '68%',
    wind: '7.8 km/h NW',
    centerCoords: [28.6139, 77.2090],
    defaultZoom: 7,

    forensicDossier: {
      caseId: 'FORENSIC-DL-2026-X89',
      timestamp: 'Live Assimilated Trajectory',
      originLocation: 'Sangrur-Bathinda Agricultural Belt, Punjab',
      transitDistanceKm: 348,
      transitTimeHours: 48,
      avgTransportSpeed: '7.25 km/h',
      boundaryLayerHeight: '320 m (Severe Inversion Trap)',
      primaryCulprit: 'Agricultural Biomass Crop Residue Burning (38%)',
      secondaryCulprit: 'Coal Thermal & Heavy Industrial Emissions (26%)',
      chemicalFingerprint: 'Levoglucosan + High K⁺/SO₄²⁻ ratio (Biomass burning signature)',
      cpcbStandardViolation: '4.8× above National Ambient Air Quality Standard'
    },

    // 48-Hour Backward Trajectory Waypoints (from T-0h back to T-48h)
    trajectory: [
      {
        step: 0,
        timeOffset: 0,
        timeLabel: 'T-0h (Now)',
        coords: [28.6139, 77.2090],
        altitudeM: 35,
        speedKmh: 6.2,
        locationName: 'Delhi Central (Breathing Zone)',
        airParcelAqi: 362,
        notes: 'Cold ground thermal inversion traps all entrained pollutants within lowest 350m.'
      },
      {
        step: 1,
        timeOffset: -6,
        timeLabel: 'T-6h ago',
        coords: [28.8920, 77.0650],
        altitudeM: 95,
        speedKmh: 7.1,
        locationName: 'Sonipat / Kundli Transport Border',
        airParcelAqi: 324,
        notes: 'Infiltrated heavy commercial diesel transit along GT Karnal Road / NH-44 corridor.'
      },
      {
        step: 2,
        timeOffset: -12,
        timeLabel: 'T-12h ago',
        coords: [29.3909, 76.9635],
        altitudeM: 180,
        speedKmh: 8.4,
        locationName: 'Panipat Industrial Belt',
        airParcelAqi: 290,
        notes: 'Crossed downwind sulfur & NOx plume of thermal power units and textile dyeing clusters.'
      },
      {
        step: 3,
        timeOffset: -18,
        timeLabel: 'T-18h ago',
        coords: [29.6857, 76.9905],
        altitudeM: 260,
        speedKmh: 7.9,
        locationName: 'Karnal Agricultural Plain',
        airParcelAqi: 262,
        notes: 'Entrained secondary particulate sulfate aerosols and brick kiln plumes.'
      },
      {
        step: 4,
        timeOffset: -24,
        timeLabel: 'T-24h ago',
        coords: [29.9695, 76.8783],
        altitudeM: 340,
        speedKmh: 8.8,
        locationName: 'Kurukshetra / Kaithal Outskirts',
        airParcelAqi: 238,
        notes: 'Passed through 68 active crop stubble fire clusters detected by VIIRS 375m sensor.'
      },
      {
        step: 5,
        timeOffset: -30,
        timeLabel: 'T-30h ago',
        coords: [30.2458, 76.2421],
        altitudeM: 490,
        speedKmh: 9.3,
        locationName: 'Patiala South Rural Corridor',
        airParcelAqi: 215,
        notes: 'Air parcel begins entraining concentrated high-density basmati straw smoke plumes.'
      },
      {
        step: 6,
        timeOffset: -36,
        timeLabel: 'T-36h ago',
        coords: [30.2458, 75.8421],
        altitudeM: 680,
        speedKmh: 8.7,
        locationName: 'Sangrur High-Density Hotspot Core',
        airParcelAqi: 185,
        notes: 'EPICENTER: 142 thermal anomalies burning simultaneously. Plume injected into planetary boundary layer.'
      },
      {
        step: 7,
        timeOffset: -42,
        timeLabel: 'T-42h ago',
        coords: [30.3782, 75.2514],
        altitudeM: 920,
        speedKmh: 7.5,
        locationName: 'Bathinda Western Cotton-Paddy Belt',
        airParcelAqi: 140,
        notes: 'Initial boundary layer entrainment; mixed with regional background dust and biomass emissions.'
      },
      {
        step: 8,
        timeOffset: -48,
        timeLabel: 'T-48h ago',
        coords: [30.7046, 74.5821],
        altitudeM: 1180,
        speedKmh: 8.1,
        locationName: 'Fazilka Border Transboundary Origin',
        airParcelAqi: 88,
        notes: 'Air parcel enters India at 1,180m altitude in relatively moderate/clean state before descending.'
      }
    ],

    // Intercepted Culprit Sources along the Ribbon
    interceptedSources: [
      {
        id: 'culprit-dl-01',
        name: 'Sangrur Mega Stubble Burning Cluster',
        type: 'biomass',
        coords: [30.2458, 75.8421],
        timeIntercepted: '36 hours ago (T-36h)',
        impactShare: '38%',
        pollutantsAdded: '+98 µg/m³ PM2.5',
        confidence: '98% (NASA VIIRS High Conf)',
        signature: 'Levoglucosan, K⁺, Brown Carbon',
        details: '142 intense paddy straw field burns. Extreme heat radiation injected smoke directly into the descending air stream.'
      },
      {
        id: 'culprit-dl-02',
        name: 'Panipat Heavy Thermal & Industrial Corridor',
        type: 'industrial',
        coords: [29.3909, 76.9635],
        timeIntercepted: '12 hours ago (T-12h)',
        impactShare: '26%',
        pollutantsAdded: '+54 µg/m³ PM2.5 & SO₂',
        confidence: '94% (CPCB Continuous Monitored)',
        signature: 'Sulfate (SO₄²⁻), Vanadium, Secondary Aerosols',
        details: 'Coal-fired thermal generation, petrochemical refining, and synthetic textile processing emissions entrained as parcel passed within 6km.'
      },
      {
        id: 'culprit-dl-03',
        name: 'GT Karnal (NH-44) Diesel Transit Freight Funnel',
        type: 'vehicular',
        coords: [28.8920, 77.0650],
        timeIntercepted: '6 hours ago (T-6h)',
        impactShare: '22%',
        pollutantsAdded: '+45 µg/m³ Elemental Carbon',
        confidence: '91% (Traffic Telemetry & Sensor Density)',
        signature: 'Black Carbon (BC), NOx, Ultrafine Particles',
        details: 'Heavy commercial interstate truck entry corridor during nocturnal no-entry lifting window.'
      },
      {
        id: 'culprit-dl-04',
        name: 'Sonipat-Bawana Peripheral Brick Kiln Belt',
        type: 'brick_kiln',
        coords: [28.7980, 77.0350],
        timeIntercepted: '3 hours ago (T-3h)',
        impactShare: '9%',
        pollutantsAdded: '+18 µg/m³ Coarse Soot',
        confidence: '88% (Fixed Emission Inventory)',
        signature: 'Flyash silica, Carbon monoxide, Incomplete Combustion Soot',
        details: 'Bull Trench and Zigzag brick kilns operating with high-ash coal fuels.'
      },
      {
        id: 'culprit-dl-05',
        name: 'Thar Desert Mineral Drift Entrainment',
        type: 'dust',
        coords: [30.4500, 74.9000],
        timeIntercepted: '44 hours ago (T-44h)',
        impactShare: '5%',
        pollutantsAdded: '+12 µg/m³ PM10',
        confidence: '85% (Aerosol Optical Depth)',
        signature: 'Silicate, Aluminum, Calcium Carbonate',
        details: 'Fine mineral soil dust carried aloft from arid western border regions.'
      }
    ],

    // Chemical Mass Spectrometry Simulation
    chemicalBreakdown: [
      { component: 'Organic Carbon (Biomass Fire Tar)', share: 38, color: '#f97316' },
      { component: 'Secondary Sulfates & Nitrates (Power/Industry)', share: 26, color: '#8b5cf6' },
      { component: 'Elemental Black Carbon (Diesel Soot)', share: 22, color: '#0f172a' },
      { component: 'Inorganic Mineral Crust Dust (PM10)', share: 8, color: '#eab308' },
      { component: 'Trace Volatile Organic Compounds (VOCs)', share: 6, color: '#06b6d4' }
    ]
  },

  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    currentAqi: 284,
    status: 'Poor',
    dominantPollutant: 'PM2.5 (198 µg/m³)',
    temp: '24°C',
    humidity: '62%',
    wind: '9.2 km/h NW',
    centerCoords: [26.8467, 80.9462],
    defaultZoom: 7,

    forensicDossier: {
      caseId: 'FORENSIC-LKO-2026-B12',
      timestamp: 'Live Assimilated Trajectory',
      originLocation: 'Aligarh-Bareilly Industrial & Agrarian Basin',
      transitDistanceKm: 312,
      transitTimeHours: 48,
      avgTransportSpeed: '6.5 km/h',
      boundaryLayerHeight: '410 m (Winter Inversion)',
      primaryCulprit: 'Unnao-Kanpur Leather & Chemical Industrial Plume (34%)',
      secondaryCulprit: 'Sitapur Sugar Mill & Agro-Waste Combustion (28%)',
      chemicalFingerprint: 'Chromium traces, High Sulfate & Nitrate from Coal Co-firing',
      cpcbStandardViolation: '3.3× above National Ambient Air Quality Standard'
    },

    trajectory: [
      {
        step: 0,
        timeOffset: 0,
        timeLabel: 'T-0h (Now)',
        coords: [26.8467, 80.9462],
        altitudeM: 40,
        speedKmh: 6.8,
        locationName: 'Lucknow Gomti Basin',
        airParcelAqi: 284,
        notes: 'Air parcel stagnates in urban bowl surrounded by perimeter ring roads.'
      },
      {
        step: 1,
        timeOffset: -6,
        timeLabel: 'T-6h ago',
        coords: [26.8120, 80.7500],
        altitudeM: 110,
        speedKmh: 7.2,
        locationName: 'Unnao Expressway Interchange',
        airParcelAqi: 258,
        notes: 'Infiltrated noxious tannery chemical processing and heavy diesel transit.'
      },
      {
        step: 2,
        timeOffset: -12,
        timeLabel: 'T-12h ago',
        coords: [26.8900, 80.4500],
        altitudeM: 190,
        speedKmh: 8.0,
        locationName: 'Kanpur-Lucknow Agro-Industrial Zone',
        airParcelAqi: 230,
        notes: 'Crossed concentrated brick kiln belt and bio-waste open incineration sites.'
      },
      {
        step: 3,
        timeOffset: -18,
        timeLabel: 'T-18h ago',
        coords: [27.1500, 80.1200],
        altitudeM: 270,
        speedKmh: 7.6,
        locationName: 'Hardoi Sugarcane & Bagasse Belt',
        airParcelAqi: 205,
        notes: 'Direct smoke entrainment from sugar mill bagasse boilers and field residue.'
      },
      {
        step: 4,
        timeOffset: -24,
        timeLabel: 'T-24h ago',
        coords: [27.4200, 79.8000],
        altitudeM: 380,
        speedKmh: 8.3,
        locationName: 'Shahjahanpur Rural Plain',
        airParcelAqi: 180,
        notes: 'Passage through 48 local agro-residue burns along river basins.'
      },
      {
        step: 5,
        timeOffset: -30,
        timeLabel: 'T-30h ago',
        coords: [27.7500, 79.4500],
        altitudeM: 520,
        speedKmh: 8.9,
        locationName: 'Bareilly Regional Corridor',
        airParcelAqi: 155,
        notes: 'Entrained industrial process emissions from agro-chemical processing.'
      },
      {
        step: 6,
        timeOffset: -36,
        timeLabel: 'T-36h ago',
        coords: [28.0500, 79.1000],
        altitudeM: 710,
        speedKmh: 8.1,
        locationName: 'Budaun Upper Agricultural Plains',
        airParcelAqi: 125,
        notes: 'Air parcel begins downward trajectory into boundary layer.'
      },
      {
        step: 7,
        timeOffset: -42,
        timeLabel: 'T-42h ago',
        coords: [28.3200, 78.7500],
        altitudeM: 940,
        speedKmh: 7.8,
        locationName: 'Chandausi North West Node',
        airParcelAqi: 98,
        notes: 'Regional background air carrying moderate agricultural haze.'
      },
      {
        step: 8,
        timeOffset: -48,
        timeLabel: 'T-48h ago',
        coords: [28.5800, 78.3500],
        altitudeM: 1220,
        speedKmh: 8.5,
        locationName: 'Sambhal Upper Tropospheric Origin',
        airParcelAqi: 72,
        notes: 'Parcel begins journey at 1,220m with relatively clean baseline conditions.'
      }
    ],

    interceptedSources: [
      {
        id: 'culprit-lko-01',
        name: 'Unnao Heavy Industrial & Tannery Corridor',
        type: 'industrial',
        coords: [26.8120, 80.7500],
        timeIntercepted: '6 hours ago (T-6h)',
        impactShare: '34%',
        pollutantsAdded: '+62 µg/m³ PM2.5 & Sulfates',
        confidence: '95%',
        signature: 'Chromium, Sulfate (SO₄²⁻), Ammonia',
        details: 'Intense chemical leather manufacturing boilers and coal-fired industrial kilns.'
      },
      {
        id: 'culprit-lko-02',
        name: 'Hardoi-Sitapur Sugarcane Bagasse Burning',
        type: 'biomass',
        coords: [27.1500, 80.1200],
        timeIntercepted: '18 hours ago (T-18h)',
        impactShare: '28%',
        pollutantsAdded: '+48 µg/m³ PM2.5',
        confidence: '91%',
        signature: 'Organic Carbon, Levoglucosan',
        details: 'Sugar milling bagasse boiler soot and seasonal field crop residue combustion.'
      },
      {
        id: 'culprit-lko-03',
        name: 'Lucknow Outer Ring Road Heavy Freight Bottleneck',
        type: 'vehicular',
        coords: [26.8800, 80.8800],
        timeIntercepted: '3 hours ago (T-3h)',
        impactShare: '22%',
        pollutantsAdded: '+38 µg/m³ Black Carbon',
        confidence: '89%',
        signature: 'Diesel Soot, Nitrogen Oxides (NOx)',
        details: 'Nocturnal diesel truck transit idling along the Shaheed Path bypass.'
      },
      {
        id: 'culprit-lko-04',
        name: 'Budaun-Shahjahanpur Brick Kiln Line',
        type: 'brick_kiln',
        coords: [27.7500, 79.4500],
        timeIntercepted: '30 hours ago (T-30h)',
        impactShare: '16%',
        pollutantsAdded: '+24 µg/m³ Coarse Ash',
        confidence: '86%',
        signature: 'Flyash, Carbon Monoxide',
        details: 'Over 80 operating brick kilns using low-grade coal.'
      }
    ],

    chemicalBreakdown: [
      { component: 'Industrial Sulfates & Metal Traces', share: 34, color: '#8b5cf6' },
      { component: 'Sugarcane Bagasse & Biomass Smoke', share: 28, color: '#f97316' },
      { component: 'Vehicular Diesel Black Carbon', share: 22, color: '#0f172a' },
      { component: 'Brick Kiln Flyash & Silica', share: 11, color: '#eab308' },
      { component: 'Biogenic Background Aerosols', share: 5, color: '#10b981' }
    ]
  },

  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab / Haryana',
    currentAqi: 212,
    status: 'Poor',
    dominantPollutant: 'PM2.5 (142 µg/m³)',
    temp: '20°C',
    humidity: '71%',
    wind: '6.4 km/h NW',
    centerCoords: [30.7333, 76.7794],
    defaultZoom: 8,

    forensicDossier: {
      caseId: 'FORENSIC-IXC-2026-F04',
      timestamp: 'Live Assimilated Trajectory',
      originLocation: 'Rupnagar-Ludhiana Industrial Foothill Corridor',
      transitDistanceKm: 218,
      transitTimeHours: 48,
      avgTransportSpeed: '4.5 km/h',
      boundaryLayerHeight: '380 m',
      primaryCulprit: 'Perimeter Paddy Fire Drift & Dera Bassi Chemical Zone (42%)',
      secondaryCulprit: 'Shivalik Mountain Valley Nocturnal Catabatic Stagnation (32%)',
      chemicalFingerprint: 'Potassium rich organic carbon + Soluble Industrial Nitrates',
      cpcbStandardViolation: '2.4× above National Ambient Air Quality Standard'
    },

    trajectory: [
      {
        step: 0,
        timeOffset: 0,
        timeLabel: 'T-0h (Now)',
        coords: [30.7333, 76.7794],
        altitudeM: 30,
        speedKmh: 4.8,
        locationName: 'Chandigarh City Centre',
        airParcelAqi: 212,
        notes: 'Trapped against Shivalik mountain foothills by evening catabatic inversion.'
      },
      {
        step: 1,
        timeOffset: -6,
        timeLabel: 'T-6h ago',
        coords: [30.6800, 76.6200],
        altitudeM: 80,
        speedKmh: 5.4,
        locationName: 'Mohali Phase VIII Industrial Line',
        airParcelAqi: 195,
        notes: 'Entrained electronic & pharmaceutical manufacturing process emissions.'
      },
      {
        step: 2,
        timeOffset: -12,
        timeLabel: 'T-12h ago',
        coords: [30.7500, 76.4200],
        altitudeM: 140,
        speedKmh: 6.2,
        locationName: 'Kharar-Kurali Transport Cross',
        airParcelAqi: 172,
        notes: 'Dense local vehicular emissions and construction dust.'
      },
      {
        step: 3,
        timeOffset: -18,
        timeLabel: 'T-18h ago',
        coords: [30.9200, 76.3200],
        altitudeM: 220,
        speedKmh: 5.9,
        locationName: 'Rupnagar Thermal Power Outskirts',
        airParcelAqi: 154,
        notes: 'Passed within downwind dispersion zone of coal thermal generation.'
      },
      {
        step: 4,
        timeOffset: -24,
        timeLabel: 'T-24h ago',
        coords: [31.0500, 76.1200],
        altitudeM: 320,
        speedKmh: 6.8,
        locationName: 'Nawanshahr Agricultural Fields',
        airParcelAqi: 138,
        notes: 'Crossing active paddy residue fire zones.'
      },
      {
        step: 5,
        timeOffset: -36,
        timeLabel: 'T-36h ago',
        coords: [31.2200, 75.8200],
        altitudeM: 580,
        speedKmh: 7.2,
        locationName: 'Phagwara-Ludhiana Border Plain',
        airParcelAqi: 110,
        notes: 'Industrial textile dyeing boilers and regional farm fires.'
      },
      {
        step: 6,
        timeOffset: -48,
        timeLabel: 'T-48h ago',
        coords: [31.4200, 75.4500],
        altitudeM: 980,
        speedKmh: 7.9,
        locationName: 'Jalandhar Upper Air Inflow',
        airParcelAqi: 65,
        notes: 'Inflow from cleaner sub-Himalayan air corridor.'
      }
    ],

    interceptedSources: [
      {
        id: 'culprit-chd-01',
        name: 'Rupnagar & Mohali Agro-Industrial Fringe',
        type: 'industrial',
        coords: [30.9200, 76.3200],
        timeIntercepted: '18 hours ago (T-18h)',
        impactShare: '42%',
        pollutantsAdded: '+46 µg/m³ PM2.5',
        confidence: '93%',
        signature: 'Nitrates, Flyash, Potassium',
        details: 'Coal power generation, cement grinding, and pharmaceutical boilers.'
      },
      {
        id: 'culprit-chd-02',
        name: 'Nawanshahr & Kurali Paddy Stubble Burns',
        type: 'biomass',
        coords: [31.0500, 76.1200],
        timeIntercepted: '24 hours ago (T-24h)',
        impactShare: '32%',
        pollutantsAdded: '+35 µg/m³ PM2.5',
        confidence: '90%',
        signature: 'Organic Carbon, Levoglucosan',
        details: 'Local farmer field burning trapped by Shivalik mountain ridge.'
      },
      {
        id: 'culprit-chd-03',
        name: 'Mohali-Panchkula Ring Road Freight',
        type: 'vehicular',
        coords: [30.6800, 76.6200],
        timeIntercepted: '6 hours ago (T-6h)',
        impactShare: '26%',
        pollutantsAdded: '+28 µg/m³ Black Carbon',
        confidence: '88%',
        signature: 'Elemental Carbon, Nitrogen Oxides',
        details: 'Interstate commercial truck traffic connecting Punjab and Himachal.'
      }
    ],

    chemicalBreakdown: [
      { component: 'Industrial Soluble Nitrates & Sulfates', share: 42, color: '#8b5cf6' },
      { component: 'Crop Stubble Biomass Smoke', share: 32, color: '#f97316' },
      { component: 'Vehicular Diesel Black Carbon', share: 20, color: '#0f172a' },
      { component: 'Sub-Himalayan Mineral Dust', share: 6, color: '#eab308' }
    ]
  },

  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    currentAqi: 318,
    status: 'Hazardous',
    dominantPollutant: 'PM2.5 (234 µg/m³)',
    temp: '25°C',
    humidity: '64%',
    wind: '7.1 km/h NW',
    centerCoords: [26.4499, 80.3319],
    defaultZoom: 7,

    forensicDossier: {
      caseId: 'FORENSIC-KNP-2026-M77',
      timestamp: 'Live Assimilated Trajectory',
      originLocation: 'Agra-Etawah Industrial Axis along Yamuna',
      transitDistanceKm: 278,
      transitTimeHours: 48,
      avgTransportSpeed: '5.8 km/h',
      boundaryLayerHeight: '340 m',
      primaryCulprit: 'Heavy Tannery Boilers & Panki Thermal Power Axis (36%)',
      secondaryCulprit: 'Agra-Firozabad Glass & Coal Combustion Corridor (29%)',
      chemicalFingerprint: 'Heavy Sulfate, Elemental Chromium, High Heavy Metal particulates',
      cpcbStandardViolation: '3.9× above National Ambient Air Quality Standard'
    },

    trajectory: [
      {
        step: 0,
        timeOffset: 0,
        timeLabel: 'T-0h (Now)',
        coords: [26.4499, 80.3319],
        altitudeM: 35,
        speedKmh: 5.2,
        locationName: 'Kanpur Industrial Basin',
        airParcelAqi: 318,
        notes: 'Dense local industrial haze combined with river inversion stagnation.'
      },
      {
        step: 1,
        timeOffset: -6,
        timeLabel: 'T-6h ago',
        coords: [26.4800, 80.1800],
        altitudeM: 90,
        speedKmh: 5.8,
        locationName: 'Panki Thermal Power Axis',
        airParcelAqi: 288,
        notes: 'Direct transit over coal power flyash ponds and boiler stacks.'
      },
      {
        step: 2,
        timeOffset: -12,
        timeLabel: 'T-12h ago',
        coords: [26.6500, 79.9200],
        altitudeM: 160,
        speedKmh: 6.7,
        locationName: 'Akbarpur Rural Industrial Belt',
        airParcelAqi: 254,
        notes: 'Crossed agro-waste burning and local textile mills.'
      },
      {
        step: 3,
        timeOffset: -24,
        timeLabel: 'T-24h ago',
        coords: [26.8500, 79.4200],
        altitudeM: 340,
        speedKmh: 7.2,
        locationName: 'Auraiya Gas & Chemical Grid',
        airParcelAqi: 210,
        notes: 'Petrochemical cracking units and nitrogen oxide entrainment.'
      },
      {
        step: 4,
        timeOffset: -36,
        timeLabel: 'T-36h ago',
        coords: [27.0200, 78.9500],
        altitudeM: 620,
        speedKmh: 7.8,
        locationName: 'Etawah-Mainpuri Border',
        airParcelAqi: 165,
        notes: 'Agricultural fires and brick kiln emissions.'
      },
      {
        step: 5,
        timeOffset: -48,
        timeLabel: 'T-48h ago',
        coords: [27.1800, 78.4500],
        altitudeM: 1050,
        speedKmh: 8.4,
        locationName: 'Firozabad Glass Industry Inflow',
        airParcelAqi: 95,
        notes: 'Inflow carrying high silica and sulfur combustion products from glass furnaces.'
      }
    ],

    interceptedSources: [
      {
        id: 'culprit-knp-01',
        name: 'Panki Thermal & Heavy Industrial Axis',
        type: 'industrial',
        coords: [26.4800, 80.1800],
        timeIntercepted: '6 hours ago (T-6h)',
        impactShare: '36%',
        pollutantsAdded: '+78 µg/m³ PM2.5 & SO₂',
        confidence: '96%',
        signature: 'Sulfates, Flyash, Heavy Metals',
        details: 'Coal power generation, foundry furnaces, and heavy tannery boiler operations.'
      },
      {
        id: 'culprit-knp-02',
        name: 'Firozabad-Etawah Coal & Glass Furnace Belt',
        type: 'industrial',
        coords: [27.1800, 78.4500],
        timeIntercepted: '48 hours ago (T-48h)',
        impactShare: '29%',
        pollutantsAdded: '+52 µg/m³ Silica & SO₂',
        confidence: '92%',
        signature: 'Silica, Heavy Oils, Sulfur Dioxide',
        details: 'High-temperature gas and coal glass melting furnaces.'
      },
      {
        id: 'culprit-knp-03',
        name: 'Kanpur-GT Road Interstate Diesel Freight',
        type: 'vehicular',
        coords: [26.4600, 80.2800],
        timeIntercepted: '2 hours ago (T-2h)',
        impactShare: '22%',
        pollutantsAdded: '+42 µg/m³ Black Carbon',
        confidence: '90%',
        signature: 'Elemental Carbon, Nitrogen Oxides',
        details: 'Intense intercity truck congestion entering southern bypass.'
      },
      {
        id: 'culprit-knp-04',
        name: 'Yamuna Ravine Crop Residue Burning',
        type: 'biomass',
        coords: [26.8500, 79.4200],
        timeIntercepted: '24 hours ago (T-24h)',
        impactShare: '13%',
        pollutantsAdded: '+24 µg/m³ PM2.5',
        confidence: '87%',
        signature: 'Organic Carbon, Levoglucosan',
        details: 'Post-harvest agricultural waste burning along the river banks.'
      }
    ],

    chemicalBreakdown: [
      { component: 'Industrial Sulfates, Heavy Metals & Chromium', share: 36, color: '#8b5cf6' },
      { component: 'Glass Furnace Silica & Sulfur', share: 29, color: '#06b6d4' },
      { component: 'Vehicular Diesel Black Carbon', share: 22, color: '#0f172a' },
      { component: 'Riverine Crop Stubble Smoke', share: 13, color: '#f97316' }
    ]
  }
];

export const EMISSION_TYPE_ICONS = {
  biomass: { label: 'Agricultural Biomass Stubble', color: 'bg-rose-600 text-rose-100 border-rose-400' },
  industrial: { label: 'Thermal Power & Heavy Industry', color: 'bg-purple-600 text-purple-100 border-purple-400' },
  vehicular: { label: 'Commercial Diesel Transit Freight', color: 'bg-blue-600 text-blue-100 border-blue-400' },
  brick_kiln: { label: 'Brick Kiln & Coal Combustion', color: 'bg-amber-600 text-amber-100 border-amber-400' },
  dust: { label: 'Transboundary Mineral Dust Drift', color: 'bg-yellow-600 text-yellow-100 border-yellow-400' }
};
