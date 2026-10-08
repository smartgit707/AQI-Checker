/**
 * Pre-calibrated urban commuting corridors across major Indian metros.
 * Models microclimate exposure differences between high-emission transit highways
 * and greenway / arterial parkway corridors with tree canopies and oceanic/lake buffers.
 */

export const COMMUTE_CORRIDORS = [
  {
    id: 'delhi-cp-gurgaon',
    city: 'Delhi NCR',
    name: 'Connaught Place ➔ Cyber City Gurgaon',
    origin: {
      name: 'Connaught Place, New Delhi',
      coords: [28.6315, 77.2167],
    },
    destination: {
      name: 'DLF Cyber City, Gurugram',
      coords: [28.4952, 77.0894],
    },
    highwayRoute: {
      name: 'NH48 & Dhaula Kuan Highway Corridor',
      description: 'Heavy diesel commercial vehicle transit, Mahipalpur bottleneck, enclosed vehicular canyon.',
      distanceKm: 26.5,
      durationMin: 52,
      aqi: 318,
      category: 'Very Poor',
      color: '#e11d48',
      pm25: 185, // µg/m³
      checkpoints: [
        { name: 'Dhaula Kuan Junction', aqi: 305, coords: [28.5925, 77.1615] },
        { name: 'Mahipalpur Underpass', aqi: 345, coords: [28.5442, 77.1245] },
        { name: 'Sirhol Border Toll Plaza', aqi: 330, coords: [28.5085, 77.0980] }
      ],
      polyline: [
        [28.6315, 77.2167],
        [28.6180, 77.1950],
        [28.5925, 77.1615],
        [28.5680, 77.1420],
        [28.5442, 77.1245],
        [28.5210, 77.1120],
        [28.5085, 77.0980],
        [28.4952, 77.0894]
      ]
    },
    cleanRoute: {
      name: 'Southern Ridge & Vasant Kunj Greenway',
      description: 'Central Ridge green forest canopy, buffered parkways, significantly lower diesel soot.',
      distanceKm: 28.8,
      durationMin: 56,
      aqi: 188,
      category: 'Moderate',
      color: '#059669',
      pm25: 96, // µg/m³
      exposureReductionPct: 48,
      checkpoints: [
        { name: 'Chanakyapuri Embassy Green Belt', aqi: 175, coords: [28.5980, 77.1850] },
        { name: 'Vasant Kunj Forest Buffer', aqi: 160, coords: [28.5290, 77.1510] },
        { name: 'Aravalli Biodiversity Trail', aqi: 152, coords: [28.5020, 77.1150] }
      ],
      polyline: [
        [28.6315, 77.2167],
        [28.6110, 77.2020],
        [28.5980, 77.1850],
        [28.5650, 77.1700],
        [28.5290, 77.1510],
        [28.5110, 77.1320],
        [28.5020, 77.1150],
        [28.4952, 77.0894]
      ]
    }
  },
  {
    id: 'delhi-noida-indiagate',
    city: 'Delhi NCR',
    name: 'Noida Sec 62 ➔ India Gate',
    origin: {
      name: 'Electronic City, Sector 62 Noida',
      coords: [28.6280, 77.3649],
    },
    destination: {
      name: 'India Gate, New Delhi',
      coords: [28.6129, 77.2295],
    },
    highwayRoute: {
      name: 'Vikas Marg & ITO Flyover',
      description: 'Continuous idling traffic at Laxmi Nagar and ITO intersection, high NOx concentration.',
      distanceKm: 18.2,
      durationMin: 48,
      aqi: 295,
      category: 'Poor',
      color: '#e11d48',
      pm25: 165,
      checkpoints: [
        { name: 'Anand Vihar Transit Junction', aqi: 360, coords: [28.6470, 77.3160] },
        { name: 'ITO Signal Corridor', aqi: 310, coords: [28.6290, 77.2420] }
      ],
      polyline: [
        [28.6280, 77.3649],
        [28.6350, 77.3400],
        [28.6470, 77.3160],
        [28.6380, 77.2750],
        [28.6290, 77.2420],
        [28.6129, 77.2295]
      ]
    },
    cleanRoute: {
      name: 'DND Flyway & Barapullah Greenway',
      description: 'Yamuna river breeze dispersion, elevated corridor above ground smog layer.',
      distanceKm: 20.4,
      durationMin: 42,
      aqi: 192,
      category: 'Moderate',
      color: '#059669',
      pm25: 104,
      exposureReductionPct: 37,
      checkpoints: [
        { name: 'Noida Entry Greens', aqi: 198, coords: [28.5820, 77.3200] },
        { name: 'Yamuna River Bridge Aeration', aqi: 170, coords: [28.5860, 77.2800] },
        { name: 'Barapullah Elevated Deck', aqi: 185, coords: [28.5880, 77.2500] }
      ],
      polyline: [
        [28.6280, 77.3649],
        [28.5950, 77.3450],
        [28.5820, 77.3200],
        [28.5860, 77.2800],
        [28.5880, 77.2500],
        [28.6010, 77.2380],
        [28.6129, 77.2295]
      ]
    }
  },
  {
    id: 'mumbai-andheri-bkc',
    city: 'Mumbai',
    name: 'Andheri West ➔ BKC (Bandra Kurla)',
    origin: {
      name: 'Andheri West Metro',
      coords: [19.1197, 72.8464],
    },
    destination: {
      name: 'BKC Financial District',
      coords: [19.0657, 72.8687],
    },
    highwayRoute: {
      name: 'Western Express Highway (WEH)',
      description: 'Bumper-to-bumper peak hour traffic, heavy auto-rickshaw & bus exhaust accumulation.',
      distanceKm: 12.4,
      durationMin: 42,
      aqi: 220,
      category: 'Poor',
      color: '#e11d48',
      pm25: 125,
      checkpoints: [
        { name: 'Santacruz WEH Flyover', aqi: 235, coords: [19.0880, 72.8520] },
        { name: 'Kalanagar Junction', aqi: 215, coords: [19.0590, 72.8480] }
      ],
      polyline: [
        [19.1197, 72.8464],
        [19.1080, 72.8510],
        [19.0880, 72.8520],
        [19.0720, 72.8530],
        [19.0657, 72.8687]
      ]
    },
    cleanRoute: {
      name: 'Juhu Coastal Buffer & Bandra Greenway',
      description: 'Arabian sea breeze ventilation, tree-lined residential corridors, low commercial transit.',
      distanceKm: 14.1,
      durationMin: 39,
      aqi: 128,
      category: 'Moderate',
      color: '#059669',
      pm25: 68,
      exposureReductionPct: 45,
      checkpoints: [
        { name: 'Juhu Sea Breeze Boulevard', aqi: 110, coords: [19.0980, 72.8280] },
        { name: 'Bandra Reclamation Greens', aqi: 122, coords: [19.0490, 72.8250] }
      ],
      polyline: [
        [19.1197, 72.8464],
        [19.1050, 72.8290],
        [19.0980, 72.8280],
        [19.0750, 72.8330],
        [19.0550, 72.8390],
        [19.0657, 72.8687]
      ]
    }
  },
  {
    id: 'bangalore-whitefield-indiranagar',
    city: 'Bengaluru',
    name: 'ITPL Whitefield ➔ 100ft Indiranagar',
    origin: {
      name: 'ITPL Tech Park, Whitefield',
      coords: [12.9856, 77.7314],
    },
    destination: {
      name: '100 Feet Road, Indiranagar',
      coords: [12.9719, 77.6412],
    },
    highwayRoute: {
      name: 'Marathahalli Outer Ring Road',
      description: 'Heavy construction dust, tech park bus congestion, severe particulate entrapment.',
      distanceKm: 14.2,
      durationMin: 50,
      aqi: 175,
      category: 'Moderate',
      color: '#f59e0b',
      pm25: 98,
      checkpoints: [
        { name: 'Marathahalli Multiplex Signal', aqi: 195, coords: [12.9560, 77.7010] },
        { name: 'HAL Engine Division Choke', aqi: 170, coords: [12.9600, 77.6650] }
      ],
      polyline: [
        [12.9856, 77.7314],
        [12.9720, 77.7200],
        [12.9560, 77.7010],
        [12.9530, 77.6780],
        [12.9600, 77.6650],
        [12.9719, 77.6412]
      ]
    },
    cleanRoute: {
      name: 'HAL Old Airport & Wind Tunnel Greenway',
      description: 'Lush tree canopy along defense airstrip, reduced vehicular volume, optimal air intake.',
      distanceKm: 15.6,
      durationMin: 44,
      aqi: 95,
      category: 'Satisfactory',
      color: '#059669',
      pm25: 48,
      exposureReductionPct: 51,
      checkpoints: [
        { name: 'Varthur Lake Eco Buffer', aqi: 102, coords: [12.9490, 77.7120] },
        { name: 'HAL Heritage Canopied Road', aqi: 88, coords: [12.9550, 77.6720] }
      ],
      polyline: [
        [12.9856, 77.7314],
        [12.9620, 77.7250],
        [12.9490, 77.7120],
        [12.9500, 77.6850],
        [12.9550, 77.6720],
        [12.9719, 77.6412]
      ]
    }
  },
  {
    id: 'hyderabad-hitec-banjara',
    city: 'Hyderabad',
    name: 'HITEC City ➔ Banjara Hills',
    origin: {
      name: 'Cyber Towers, HITEC City',
      coords: [17.4504, 78.3808],
    },
    destination: {
      name: 'Road No. 1, Banjara Hills',
      coords: [17.4156, 78.4354],
    },
    highwayRoute: {
      name: 'Madhapur Main Road & Jubilee Checkpost',
      description: 'High auto-emission junction, stop-and-go commercial congestion.',
      distanceKm: 10.2,
      durationMin: 35,
      aqi: 165,
      category: 'Moderate',
      color: '#f59e0b',
      pm25: 88,
      checkpoints: [
        { name: 'Jubilee Hills Checkpost', aqi: 180, coords: [17.4320, 78.4070] }
      ],
      polyline: [
        [17.4504, 78.3808],
        [17.4410, 78.3950],
        [17.4320, 78.4070],
        [17.4240, 78.4190],
        [17.4156, 78.4354]
      ]
    },
    cleanRoute: {
      name: 'Durgam Cheruvu & KBR National Park Perimeter',
      description: 'Lake breeze dispersion and extensive dense forest cover of Kasu Brahmananda Reddy Park.',
      distanceKm: 11.5,
      durationMin: 32,
      aqi: 88,
      category: 'Satisfactory',
      color: '#059669',
      pm25: 42,
      exposureReductionPct: 52,
      checkpoints: [
        { name: 'Durgam Cheruvu Cable Bridge', aqi: 82, coords: [17.4350, 78.3880] },
        { name: 'KBR Forest Trail Perimeter', aqi: 75, coords: [17.4210, 78.4210] }
      ],
      polyline: [
        [17.4504, 78.3808],
        [17.4350, 78.3880],
        [17.4290, 78.4020],
        [17.4210, 78.4210],
        [17.4156, 78.4354]
      ]
    }
  },
  {
    id: 'chennai-srm-airport',
    city: 'Chennai',
    name: 'SRM Kattankulathur ➔ Chennai Airport (MAA)',
    origin: {
      name: 'SRM IST Campus, Kattankulathur',
      coords: [12.8231, 80.0416],
    },
    destination: {
      name: 'Chennai International Airport (MAA)',
      coords: [12.9900, 80.1693],
    },
    highwayRoute: {
      name: 'NH32 / GST Road Highway Corridor',
      description: 'Heavy intercity buses, Perungalathur & Tambaram congestion canyon, high roadside diesel particulate exhaust.',
      distanceKm: 26.8,
      durationMin: 52,
      aqi: 195,
      category: 'Moderate',
      color: '#e11d48',
      pm25: 118,
      checkpoints: [
        { name: 'Guduvanchery Junction', aqi: 178, coords: [12.8440, 80.0630] },
        { name: 'Perungalathur Diesel Bus Choke', aqi: 220, coords: [12.9050, 80.0880] },
        { name: 'Tambaram Sanatorium Flyover', aqi: 198, coords: [12.9380, 80.1230] },
        { name: 'Chromepet - Pallavaram Highway', aqi: 184, coords: [12.9680, 80.1450] }
      ],
      polyline: [
        [12.8231, 80.0416],
        [12.8440, 80.0630],
        [12.8710, 80.0760],
        [12.9050, 80.0880],
        [12.9240, 80.1100],
        [12.9380, 80.1230],
        [12.9550, 80.1380],
        [12.9680, 80.1450],
        [12.9900, 80.1693]
      ]
    },
    cleanRoute: {
      name: 'Vandalur Forest & Outer Ring Road (ORR) Greenway',
      description: 'Dense green tree canopy of Vandalur Zoological Reserve Forest, free-flowing arterial bypass with ~61% lower particulate intake.',
      distanceKm: 29.5,
      durationMin: 44,
      aqi: 88,
      category: 'Satisfactory',
      color: '#059669',
      pm25: 46,
      exposureReductionPct: 61,
      checkpoints: [
        { name: 'SRM Potheri Green Exit', aqi: 95, coords: [12.8310, 80.0520] },
        { name: 'Vandalur Zoo Biosphere Boundary', aqi: 82, coords: [12.8850, 80.0750] },
        { name: 'Kishkinta Greenway Bypass', aqi: 86, coords: [12.9250, 80.0950] },
        { name: 'Pallavaram Radial Lake Corridor', aqi: 89, coords: [12.9580, 80.1580] }
      ],
      polyline: [
        [12.8231, 80.0416],
        [12.8310, 80.0520],
        [12.8620, 80.0690],
        [12.8850, 80.0750],
        [12.9120, 80.0840],
        [12.9250, 80.0950],
        [12.9420, 80.1280],
        [12.9580, 80.1580],
        [12.9810, 80.1650],
        [12.9900, 80.1693]
      ]
    }
  }
];

/**
 * Transport mode inhalation factors based on medical respiratory research
 * Ventilation rate (Liters of air inhaled per minute) and vehicle barrier filtration efficiency
 */
export const TRANSPORT_MODES = [
  {
    id: 'walking',
    name: 'Walking',
    icon: 'Footprints',
    ventilationRateLpm: 24, // Liter/min during moderate walking
    barrierFiltrationPct: 0, // No cabin filter
    description: 'Active respiratory intake; maximum direct exposure to roadside particulate plume.',
    maskRecommendation: 'Wear N95/FFP2 respirator along highway corridors.'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'Bike',
    ventilationRateLpm: 38, // High pulmonary ventilation under physical exertion
    barrierFiltrationPct: 0,
    description: 'High exertion multiplies lung air exchange by 3x. Highly sensitive to PM2.5 spikes.',
    maskRecommendation: 'Strongly recommended: N95 sports valved mask.'
  },
  {
    id: 'two_wheeler',
    name: 'Two-Wheeler / Auto',
    icon: 'Motorcycle',
    ventilationRateLpm: 18,
    barrierFiltrationPct: 5,
    description: 'Open to direct diesel exhaust, brake dust, and tailpipe micro-particles.',
    maskRecommendation: 'N95 mask advised during stop-and-go signals.'
  },
  {
    id: 'metro',
    name: 'Metro / Air-Conditioned Rail',
    icon: 'Train',
    ventilationRateLpm: 12,
    barrierFiltrationPct: 65, // Commercial HVAC central filtration
    description: 'Enclosed cabins with continuous industrial particulate filtration.',
    maskRecommendation: 'Standard cloth or surgical mask sufficient.'
  },
  {
    id: 'car_ac',
    name: 'Car (AC Recirculation)',
    icon: 'Car',
    ventilationRateLpm: 12,
    barrierFiltrationPct: 78, // High-efficiency cabin air filter in recirculation mode
    description: 'Cabin air filter actively blocks ~80% of outdoor PM2.5 when set to Recirculate.',
    maskRecommendation: 'Keep windows up; set AC to internal recirculation.'
  }
];

/**
 * Diurnal atmospheric dispersion windows throughout the day
 */
export const DEPARTURE_WINDOWS = [
  {
    time: '07:00 AM',
    hour: 7,
    status: 'High Smog',
    rating: 'Poor',
    color: '#e11d48',
    dispersion: 'Low (Night Inversion Trap)',
    note: 'Cool air traps overnight traffic soot close to street level.'
  },
  {
    time: '09:00 AM',
    hour: 9,
    status: 'Peak Traffic',
    rating: 'Poor',
    color: '#e11d48',
    dispersion: 'Moderate',
    note: 'Morning rush hour peak emissions combined with lingering ground haze.'
  },
  {
    time: '12:00 PM',
    hour: 12,
    status: 'Optimal Dispersion',
    rating: 'Cleanest',
    color: '#059669',
    dispersion: 'High (Solar Convection)',
    note: 'Sunlight raises planetary boundary layer; wind cleans surface air.'
  },
  {
    time: '03:00 PM',
    hour: 15,
    status: 'Optimal Dispersion',
    rating: 'Good',
    color: '#059669',
    dispersion: 'High',
    note: 'Strongest atmospheric mixing; optimal time for outdoor commuting.'
  },
  {
    time: '06:30 PM',
    hour: 18,
    status: 'Evening Rush',
    rating: 'Poor',
    color: '#e11d48',
    dispersion: 'Declining',
    note: 'Heavy office exit traffic with falling temperatures condensing smog.'
  },
  {
    time: '09:30 PM',
    hour: 21,
    status: 'Commercial Truck Plume',
    rating: 'Moderate',
    color: '#f59e0b',
    dispersion: 'Low',
    note: 'Heavy commercial diesel trucks enter city limits.'
  }
];

/**
 * Calculates PM2.5 inhaled in micrograms (µg) during a commute
 * Formula: PM2.5 (µg/m³) * Inhaled Volume (m³) * (1 - Barrier Efficiency)
 * Inhaled Volume = (Ventilation Rate L/min * Duration min) / 1000
 */
export function calculateInhaledPM25(pm25Concentration, durationMinutes, transportMode) {
  const inhaledVolumeCubicMeters = (transportMode.ventilationRateLpm * durationMinutes) / 1000;
  const effectiveConcentration = pm25Concentration * (1 - transportMode.barrierFiltrationPct / 100);
  const totalMicrograms = Math.round(effectiveConcentration * inhaledVolumeCubicMeters * 10) / 10;
  
  // Berkeley Earth Cigarette equivalent: 22 µg/m³ for 24h (~316 µg inhaled) = 1 cigarette
  const cigaretteFraction = Math.round((totalMicrograms / 316) * 100) / 100;

  return {
    micrograms: totalMicrograms,
    cigarettes: cigaretteFraction,
    volumeLiters: transportMode.ventilationRateLpm * durationMinutes
  };
}
