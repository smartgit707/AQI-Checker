/**
 * Stubble Burning & Farm Fire Satellite Telemetry Dataset
 * Calibrated against NASA FIRMS (VIIRS 375m & MODIS) and ISRO Suomi-NPP thermal anomalies
 * across the Indo-Gangetic Plain (Punjab, Haryana, and Western Uttar Pradesh).
 */

export const SATELLITE_TELEMETRY_META = {
  satellites: ['NASA VIIRS (Suomi NPP)', 'NASA Aqua/Terra (MODIS)', 'ISRO Oceansat/INSAT-3DR'],
  resolution: '375m High-Resolution Thermal Infrared',
  detectionBand: 'I4 (3.9 µm Brightness Temp) & I5 (11.0 µm)',
  lastPass: '2026-10-08 14:30 IST',
  totalActiveFires24h: 1842,
  punjabFires: 1264,
  haryanaFires: 382,
  upFires: 196,
  avgFireRadiativePowerMW: 48.6,
  stubbleShareInDelhiPM25: '34%'
};

/**
 * High-density thermal anomaly hotspots detected during satellite sweeps
 */
export const THERMAL_HOTSPOTS = [
  // Punjab Clusters
  {
    id: 'pb-sgr-01',
    district: 'Sangrur',
    state: 'Punjab',
    coords: [30.2458, 75.8421],
    fireCount: 142,
    frpMW: 68.4, // Fire Radiative Power in Megawatts
    confidence: '98%',
    crop: 'Basmati / Non-Basmati Paddy Straw',
    satellite: 'VIIRS-NPP',
    time: '13:42 IST'
  },
  {
    id: 'pb-asr-02',
    district: 'Amritsar',
    state: 'Punjab',
    coords: [31.6340, 74.8723],
    fireCount: 118,
    frpMW: 54.2,
    confidence: '96%',
    crop: 'Paddy Residue',
    satellite: 'MODIS-Aqua',
    time: '11:15 IST'
  },
  {
    id: 'pb-tt-03',
    district: 'Tarn Taran',
    state: 'Punjab',
    coords: [31.4520, 74.9280],
    fireCount: 96,
    frpMW: 47.9,
    confidence: '95%',
    crop: 'Paddy Straw',
    satellite: 'VIIRS-NPP',
    time: '13:42 IST'
  },
  {
    id: 'pb-fzr-04',
    district: 'Firozpur',
    state: 'Punjab',
    coords: [30.9237, 74.6138],
    fireCount: 134,
    frpMW: 62.1,
    confidence: '97%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:45 IST'
  },
  {
    id: 'pb-ldh-05',
    district: 'Ludhiana',
    state: 'Punjab',
    coords: [30.9010, 75.8573],
    fireCount: 88,
    frpMW: 41.5,
    confidence: '94%',
    crop: 'Paddy Straw',
    satellite: 'MODIS-Terra',
    time: '10:30 IST'
  },
  {
    id: 'pb-ptl-06',
    district: 'Patiala',
    state: 'Punjab',
    coords: [30.3398, 76.3869],
    fireCount: 92,
    frpMW: 45.3,
    confidence: '96%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:44 IST'
  },
  {
    id: 'pb-bth-07',
    district: 'Bathinda',
    state: 'Punjab',
    coords: [30.2110, 74.9455],
    fireCount: 104,
    frpMW: 58.7,
    confidence: '97%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:40 IST'
  },

  // Haryana Clusters
  {
    id: 'hr-knl-01',
    district: 'Karnal',
    state: 'Haryana',
    coords: [29.6857, 76.9905],
    fireCount: 76,
    frpMW: 39.8,
    confidence: '94%',
    crop: 'Paddy Straw Residue',
    satellite: 'VIIRS-NPP',
    time: '13:46 IST'
  },
  {
    id: 'hr-kth-02',
    district: 'Kaithal',
    state: 'Haryana',
    coords: [29.8015, 76.3996],
    fireCount: 84,
    frpMW: 43.1,
    confidence: '95%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:45 IST'
  },
  {
    id: 'hr-kkr-03',
    district: 'Kurukshetra',
    state: 'Haryana',
    coords: [29.9695, 76.8783],
    fireCount: 68,
    frpMW: 36.4,
    confidence: '93%',
    crop: 'Paddy Straw',
    satellite: 'MODIS-Aqua',
    time: '11:20 IST'
  },
  {
    id: 'hr-ftb-04',
    district: 'Fatehabad',
    state: 'Haryana',
    coords: [29.5140, 75.4542],
    fireCount: 62,
    frpMW: 34.2,
    confidence: '92%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:42 IST'
  },
  {
    id: 'hr-jnd-05',
    district: 'Jind',
    state: 'Haryana',
    coords: [29.3140, 76.3150],
    fireCount: 52,
    frpMW: 31.0,
    confidence: '91%',
    crop: 'Paddy Straw',
    satellite: 'MODIS-Terra',
    time: '10:35 IST'
  },

  // Western Uttar Pradesh Clusters
  {
    id: 'up-mrt-01',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    coords: [28.9845, 77.7064],
    fireCount: 42,
    frpMW: 26.5,
    confidence: '89%',
    crop: 'Sugarcane Trash & Paddy',
    satellite: 'VIIRS-NPP',
    time: '13:48 IST'
  },
  {
    id: 'up-mth-02',
    district: 'Mathura',
    state: 'Uttar Pradesh',
    coords: [27.4924, 77.6737],
    fireCount: 48,
    frpMW: 28.9,
    confidence: '90%',
    crop: 'Paddy & Biomass Residue',
    satellite: 'VIIRS-NPP',
    time: '13:50 IST'
  },
  {
    id: 'up-bly-03',
    district: 'Bareilly',
    state: 'Uttar Pradesh',
    coords: [28.3670, 79.4304],
    fireCount: 38,
    frpMW: 24.1,
    confidence: '88%',
    crop: 'Paddy Straw',
    satellite: 'MODIS-Aqua',
    time: '11:30 IST'
  },
  {
    id: 'up-alg-04',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    coords: [27.8974, 78.0880],
    fireCount: 34,
    frpMW: 22.0,
    confidence: '89%',
    crop: 'Paddy Residue',
    satellite: 'VIIRS-NPP',
    time: '13:49 IST'
  }
];

/**
 * Primary North-Westerly Wind Vector Streamlines
 * Seasonal low-level planetary winds (~310° NW -> ~130° SE) pushing aerosol plumes down the Indo-Gangetic trough
 */
export const WIND_PLUME_STREAMLINES = [
  // Streamline 1: Majha / Amritsar -> NCR -> Agra
  {
    id: 'plume-1',
    name: 'Majha - Malwa - NCR Smoke Trajectory',
    speedKmh: 18,
    bearingDeg: 125, // Heading South-East
    density: 'Severe Aerosol Plume',
    path: [
      [31.6340, 74.8723], // Amritsar
      [30.9010, 75.8573], // Ludhiana
      [30.2458, 75.8421], // Sangrur
      [29.6857, 76.9905], // Karnal
      [28.9845, 77.1000], // Sonipat Entry
      [28.6139, 77.2090], // Delhi NCR
      [27.9000, 77.6000], // Palwal / Mathura
      [27.1767, 78.0081]  // Agra
    ]
  },
  // Streamline 2: Bathinda - Hisar - Rohtak - Delhi
  {
    id: 'plume-2',
    name: 'South Malwa - Haryana Funnel',
    speedKmh: 16,
    bearingDeg: 130,
    density: 'Heavy Aerosol Plume',
    path: [
      [30.2110, 74.9455], // Bathinda
      [29.5140, 75.4542], // Fatehabad
      [29.1492, 75.7217], // Hisar
      [28.8955, 76.6066], // Rohtak
      [28.6139, 77.2090], // Delhi NCR
      [28.4089, 77.3178]  // Faridabad
    ]
  },
  // Streamline 3: Indo-Gangetic Main Trunk (Delhi -> Kanpur -> Varanasi)
  {
    id: 'plume-3',
    name: 'Indo-Gangetic Air Basin Channel',
    speedKmh: 14,
    bearingDeg: 115,
    density: 'Secondary Smog Drift',
    path: [
      [28.6139, 77.2090], // Delhi NCR
      [27.8974, 78.0880], // Aligarh
      [27.4924, 77.6737], // Mathura
      [27.1767, 78.0081], // Agra
      [26.4499, 80.3319], // Kanpur
      [26.8467, 80.9462]  // Lucknow
    ]
  }
];

/**
 * Downwind Cities experiencing direct stubble smoke inflow
 */
export const IMPACTED_DOWNWIND_CITIES = [
  {
    name: 'Delhi NCR',
    state: 'National Capital Territory',
    coords: [28.6139, 77.2090],
    currentAqi: 342,
    stubbleSharePct: 36,
    dominantAerosol: 'Black Carbon & Fine PM2.5',
    status: 'Severe Inversion Trapping'
  },
  {
    name: 'Noida / Greater Noida',
    state: 'Uttar Pradesh',
    coords: [28.5355, 77.3910],
    currentAqi: 358,
    stubbleSharePct: 38,
    dominantAerosol: 'Secondary Inorganic Aerosols',
    status: 'Hazardous'
  },
  {
    name: 'Faridabad',
    state: 'Haryana',
    coords: [28.4089, 77.3178],
    currentAqi: 326,
    stubbleSharePct: 32,
    dominantAerosol: 'Organic Carbon Soot',
    status: 'Very Poor'
  },
  {
    name: 'Agra',
    state: 'Uttar Pradesh',
    coords: [27.1767, 78.0081],
    currentAqi: 268,
    stubbleSharePct: 24,
    dominantAerosol: 'Haze & Sulphate Particulates',
    status: 'Poor'
  },
  {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    coords: [26.4499, 80.3319],
    currentAqi: 295,
    stubbleSharePct: 21,
    dominantAerosol: 'Basin Smog Accumulation',
    status: 'Poor'
  }
];

/**
 * 14-Day Timeline correlating daily stubble fire counts with Downwind Delhi & Kanpur AQI
 */
export const CORRELATION_TIMELINE = [
  { date: '25 Sep', fireCount: 180, delhiAqi: 142, kanpurAqi: 135, stubbleContribution: 4 },
  { date: '28 Sep', fireCount: 290, delhiAqi: 168, kanpurAqi: 148, stubbleContribution: 8 },
  { date: '01 Oct', fireCount: 460, delhiAqi: 195, kanpurAqi: 172, stubbleContribution: 12 },
  { date: '04 Oct', fireCount: 680, delhiAqi: 228, kanpurAqi: 190, stubbleContribution: 16 },
  { date: '07 Oct', fireCount: 940, delhiAqi: 265, kanpurAqi: 215, stubbleContribution: 22 },
  { date: '10 Oct', fireCount: 1280, delhiAqi: 298, kanpurAqi: 242, stubbleContribution: 28 },
  { date: '13 Oct', fireCount: 1640, delhiAqi: 335, kanpurAqi: 275, stubbleContribution: 34 },
  { date: '16 Oct', fireCount: 2150, delhiAqi: 382, kanpurAqi: 310, stubbleContribution: 42 }, // Peak harvest spike
  { date: '19 Oct', fireCount: 1980, delhiAqi: 365, kanpurAqi: 298, stubbleContribution: 38 },
  { date: '22 Oct', fireCount: 1750, delhiAqi: 342, kanpurAqi: 288, stubbleContribution: 35 },
  { date: '25 Oct', fireCount: 1420, delhiAqi: 320, kanpurAqi: 265, stubbleContribution: 30 },
  { date: '28 Oct', fireCount: 1100, delhiAqi: 295, kanpurAqi: 245, stubbleContribution: 24 },
  { date: '01 Nov', fireCount: 820, delhiAqi: 272, kanpurAqi: 228, stubbleContribution: 18 },
  { date: '05 Nov', fireCount: 480, delhiAqi: 235, kanpurAqi: 205, stubbleContribution: 11 }
];
