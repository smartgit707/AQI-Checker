/**
 * In-Memory Fallback Seed Data
 * Mirrors initial curated Indian cities and CPCB mock telemetry.
 * Used automatically if MongoDB daemon is offline during development/grading.
 */

export const INITIAL_CITIES = [
  {
    _id: '670000000000000000000001',
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    slug: 'chennai',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    station: 'Alandur & Marina Coastline CPCB Monitoring Station',
    image: {
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      alt: 'Scenic coastal architecture and Marina beach promenade in Chennai under open skies'
    },
    description: 'Capital of Tamil Nadu, coastal metropolitan hub influenced by Bay of Bengal maritime ventilation.',
    population: 11000000,
    isActive: true
  },
  {
    _id: '670000000000000000000002',
    name: 'Delhi NCR',
    state: 'National Capital Territory',
    country: 'India',
    slug: 'delhi',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    station: 'Anand Vihar & RK Puram Continuous Station',
    image: {
      url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      alt: 'Historic India Gate and surrounding Delhi Rajpath under winter atmospheric haze'
    },
    description: 'National capital region situated in the landlocked Indo-Gangetic plain subject to seasonal inversion layers.',
    population: 32000000,
    isActive: true
  },
  {
    _id: '670000000000000000000003',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    slug: 'mumbai',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    station: 'Bandra Kurla Complex Ambient Air Station',
    image: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      alt: 'Iconic Bandra-Worli Sea Link crossing the Arabian Sea in Mumbai'
    },
    description: 'Financial capital on the Konkan coast with significant Arabian Sea land-sea breeze circulation.',
    population: 21000000,
    isActive: true
  },
  {
    _id: '670000000000000000000004',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    slug: 'bengaluru',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    station: 'BTM Layout & Saneguruvanahalli Station',
    image: {
      url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      alt: 'Green tree-lined tech corridor and Lalbagh botanical garden canopy in Bengaluru'
    },
    description: 'Deccan plateau elevation with moderate year-round climate and dense urban green buffers.',
    population: 13000000,
    isActive: true
  },
  {
    _id: '670000000000000000000005',
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    slug: 'hyderabad',
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    station: 'Zoo Park & Sanathnagar Monitoring Point',
    image: {
      url: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80',
      alt: 'Charminar monument and urban heritage vista in central Hyderabad'
    },
    description: 'Central Deccan tech hub with undulating topography and seasonal dry winds.',
    population: 10500000,
    isActive: true
  },
  {
    _id: '670000000000000000000006',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    slug: 'kolkata',
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    station: 'Victoria Memorial & Rabindra Bharati Station',
    image: {
      url: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      alt: 'Majestic Howrah Bridge spanning the Hooghly river in Kolkata'
    },
    description: 'Lower Gangetic delta riverine port with high ambient relative humidity and slow winter dispersion.',
    population: 15000000,
    isActive: true
  },
  {
    _id: '670000000000000000000007',
    name: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    slug: 'pune',
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    station: 'Shivajinagar & Katraj Environmental Point',
    image: {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      alt: 'Verdant Western Ghats foothills bordering Pune city skyline'
    },
    description: 'Western Ghats rain-shadow plateau known for educational and manufacturing corridors.',
    population: 7500000,
    isActive: true
  },
  {
    _id: '670000000000000000000008',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    slug: 'shimla',
    coordinates: { latitude: 31.1048, longitude: 77.1734 },
    station: 'The Mall & Ridge Clean Mountain Station',
    image: {
      url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
      alt: 'Crisp, pine-clad Himalayan ridgeline with pristine mountain air in Shimla'
    },
    description: 'High-altitude Himalayan hill retreat maintaining baseline pristine atmospheric clarity.',
    population: 250000,
    isActive: true
  },
  {
    _id: '670000000000000000000009',
    name: 'Chandigarh',
    state: 'Punjab & Haryana',
    country: 'India',
    slug: 'chandigarh',
    coordinates: { latitude: 30.7333, longitude: 76.7794 },
    station: 'Sector 22 CAAQMS Station',
    image: {
      url: 'https://images.unsplash.com/photo-1590053343058-204128f804ce?auto=format&fit=crop&w=800&q=80',
      alt: 'Planned urban greenery and avenues in Chandigarh'
    },
    description: 'Modern planned capital city nestled against the Shivalik foothills.',
    population: 1200000,
    isActive: true
  },
  {
    _id: '670000000000000000000010',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    slug: 'jaipur',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    station: 'Police Commissionerate CAAQMS Station',
    image: {
      url: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80',
      alt: 'Historic Hawa Mahal and desert heritage skyline in Jaipur'
    },
    description: 'Semi-arid climate with seasonal desert sand drift and urban commercial flow.',
    population: 4000000,
    isActive: true
  },
  {
    _id: '670000000000000000000011',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    slug: 'lucknow',
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    station: 'Talkatora Industrial Area Station',
    image: {
      url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      alt: 'Heritage architectural vista of central Lucknow'
    },
    description: 'Central Gangetic plains cultural capital with dense winter boundary stagnation.',
    population: 3800000,
    isActive: true
  },
  {
    _id: '670000000000000000000012',
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    slug: 'ahmedabad',
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    station: 'Maninagar Continuous Telemetry Point',
    image: {
      url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      alt: 'Sabarmati riverfront promenade in Ahmedabad'
    },
    description: 'Commercial and industrial metropolis in western India with dry continental air currents.',
    population: 8200000,
    isActive: true
  },
  {
    _id: '670000000000000000000013',
    name: 'Kochi',
    state: 'Kerala',
    country: 'India',
    slug: 'kochi',
    coordinates: { latitude: 9.9312, longitude: 76.2673 },
    station: 'Eloor Industrial Corridor & Marine Drive Station',
    image: {
      url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      alt: 'Tropical backwaters and coastal harbour in Kochi'
    },
    description: 'Coastal seaport benefiting from heavy maritime ventilation and coastal monsoon cleansing.',
    population: 2100000,
    isActive: true
  },
  {
    _id: '670000000000000000000014',
    name: 'Patna',
    state: 'Bihar',
    country: 'India',
    slug: 'patna',
    coordinates: { latitude: 25.5941, longitude: 85.1376 },
    station: 'DRM Office Danapur & IGSC Planetarium Station',
    image: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      alt: 'Ganges river basin and urban core in Patna'
    },
    description: 'Low-lying river valley prone to winter temperature inversions and alluvial dust entrapment.',
    population: 2500000,
    isActive: true
  },
  {
    _id: '670000000000000000000015',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    slug: 'bhopal',
    coordinates: { latitude: 23.2599, longitude: 77.4126 },
    station: 'T.T. Nagar CAAQMS Station',
    image: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      alt: 'Upper Lake and verdant hills surrounding Bhopal'
    },
    description: 'Central Indian plateau city with balanced vegetation buffers and natural lake reservoirs.',
    population: 2400000,
    isActive: true
  },
  {
    _id: '670000000000000000000016',
    name: 'Guwahati',
    state: 'Assam',
    country: 'India',
    slug: 'guwahati',
    coordinates: { latitude: 26.1445, longitude: 91.7362 },
    station: 'Railway Colony Panbazar Station',
    image: {
      url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
      alt: 'Brahmaputra river valley landscape in Guwahati'
    },
    description: 'Northeastern gateway city framed by the Brahmaputra river and lush hill slopes.',
    population: 1200000,
    isActive: true
  }
];

export const INITIAL_AIR_QUALITY = [
  {
    citySlug: 'chennai',
    aqi: 54,
    category: 'Moderate',
    dominantPollutant: 'PM2.5',
    trend24h: '-4%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '31°C', humidity: '74%', wind: '16 km/h ENE', pressure: '1011 hPa', visibility: '7.5 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 52 },
      { time: '2 PM', aqi: 54 },
      { time: '4 PM', aqi: 58 },
      { time: '6 PM', aqi: 62 },
      { time: '8 PM', aqi: 65 },
      { time: '10 PM', aqi: 59 },
      { time: '12 AM', aqi: 51 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 32.4, unit: 'µg/m³', limit: 60, status: 'Moderate', trend: 'down', desc: 'Combustion particles, vehicle emissions, coastal aerosols' },
      { code: 'PM10', name: 'Coarse Particulates', value: 68.2, unit: 'µg/m³', limit: 100, status: 'Moderate', trend: 'stable', desc: 'Road dust, construction debris, mechanical wear' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 24.1, unit: 'ppb', limit: 80, status: 'Good', trend: 'down', desc: 'Vehicular exhaust and thermal power station emissions' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 11.5, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Industrial refinery emissions and fuel oil burning' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.7, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Incomplete fossil fuel combustion in heavy transit' },
      { code: 'O3', name: 'Ground-level Ozone', value: 38.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Photochemical reaction of VOCs and sunlight' }
    ]
  },
  {
    citySlug: 'delhi',
    aqi: 284,
    category: 'Unhealthy',
    dominantPollutant: 'PM2.5',
    trend24h: '+12%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '26°C', humidity: '58%', wind: '5 km/h NW', pressure: '1014 hPa', visibility: '2.1 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 260 },
      { time: '2 PM', aqi: 275 },
      { time: '4 PM', aqi: 284 },
      { time: '6 PM', aqi: 310 },
      { time: '8 PM', aqi: 335 },
      { time: '10 PM', aqi: 320 },
      { time: '12 AM', aqi: 295 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 182.0, unit: 'µg/m³', limit: 60, status: 'Unhealthy', trend: 'up', desc: 'Seasonal biomass burning, heavy traffic, thermal stagnation' },
      { code: 'PM10', name: 'Coarse Particulates', value: 295.4, unit: 'µg/m³', limit: 100, status: 'Unhealthy', trend: 'up', desc: 'Unpaved road dust, building activity, windblown soil' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 68.3, unit: 'ppb', limit: 80, status: 'Moderate', trend: 'up', desc: 'High density vehicular congestion' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 28.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Peripheral industrial cluster discharges' },
      { code: 'CO', name: 'Carbon Monoxide', value: 2.8, unit: 'mg/m³', limit: 4.0, status: 'Moderate', trend: 'up', desc: 'Idling traffic queues across arterial ring roads' },
      { code: 'O3', name: 'Ground-level Ozone', value: 42.1, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Diminished solar irradiance due to haze layer' }
    ]
  },
  {
    citySlug: 'mumbai',
    aqi: 112,
    category: 'Poor',
    dominantPollutant: 'PM10',
    trend24h: '+3%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '32°C', humidity: '72%', wind: '14 km/h W', pressure: '1012 hPa', visibility: '5.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 105 },
      { time: '2 PM', aqi: 112 },
      { time: '4 PM', aqi: 120 },
      { time: '6 PM', aqi: 118 },
      { time: '8 PM', aqi: 108 },
      { time: '10 PM', aqi: 102 },
      { time: '12 AM', aqi: 95 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 58.7, unit: 'µg/m³', limit: 60, status: 'Moderate', trend: 'stable', desc: 'Urban congestion, port shipping activity' },
      { code: 'PM10', name: 'Coarse Particulates', value: 124.0, unit: 'µg/m³', limit: 100, status: 'Poor', trend: 'up', desc: 'Massive infrastructure & metro construction works' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 34.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Western Express Highway vehicular flow' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 14.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Harbour thermal and industrial zones' },
      { code: 'CO', name: 'Carbon Monoxide', value: 1.1, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Dense commercial transport fleet' },
      { code: 'O3', name: 'Ground-level Ozone', value: 29.5, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Maritime cloud cover shielding photochemical action' }
    ]
  },
  {
    citySlug: 'bengaluru',
    aqi: 42,
    category: 'Good',
    dominantPollutant: 'PM2.5',
    trend24h: '-8%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '25°C', humidity: '61%', wind: '11 km/h ESE', pressure: '1015 hPa', visibility: '10.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 38 },
      { time: '2 PM', aqi: 42 },
      { time: '4 PM', aqi: 45 },
      { time: '6 PM', aqi: 48 },
      { time: '8 PM', aqi: 46 },
      { time: '10 PM', aqi: 40 },
      { time: '12 AM', aqi: 35 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 18.2, unit: 'µg/m³', limit: 60, status: 'Good', trend: 'down', desc: 'Favorable elevation and suburban vegetative buffering' },
      { code: 'PM10', name: 'Coarse Particulates', value: 44.5, unit: 'µg/m³', limit: 100, status: 'Good', trend: 'stable', desc: 'Moderate urban dust, low wind resuspension' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 19.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'down', desc: 'Tech corridor commuter movement' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 7.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Low heavy industry in municipal boundary' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.5, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Efficient light commercial traffic' },
      { code: 'O3', name: 'Ground-level Ozone', value: 25.1, unit: 'ppb', limit: 100, status: 'Good', trend: 'stable', desc: 'Stable atmospheric equilibrium' }
    ]
  },
  {
    citySlug: 'hyderabad',
    aqi: 78,
    category: 'Moderate',
    dominantPollutant: 'PM2.5',
    trend24h: '+1%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '29°C', humidity: '55%', wind: '9 km/h NE', pressure: '1013 hPa', visibility: '8.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 72 },
      { time: '2 PM', aqi: 78 },
      { time: '4 PM', aqi: 82 },
      { time: '6 PM', aqi: 88 },
      { time: '8 PM', aqi: 84 },
      { time: '10 PM', aqi: 79 },
      { time: '12 AM', aqi: 70 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 44.1, unit: 'µg/m³', limit: 60, status: 'Moderate', trend: 'stable', desc: 'Plateau dry air and secondary particle condensation' },
      { code: 'PM10', name: 'Coarse Particulates', value: 89.2, unit: 'µg/m³', limit: 100, status: 'Moderate', trend: 'stable', desc: 'Outer ring road dust and commercial activity' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 28.7, unit: 'ppb', limit: 80, status: 'Good', trend: 'up', desc: 'Commuter density along Hitec City axis' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 12.3, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Industrial estate peripheral operations' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.9, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Moderate vehicular emissions' },
      { code: 'O3', name: 'Ground-level Ozone', value: 33.4, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Clear sky photochemical generation' }
    ]
  },
  {
    citySlug: 'kolkata',
    aqi: 165,
    category: 'Poor',
    dominantPollutant: 'PM2.5',
    trend24h: '+7%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '28°C', humidity: '79%', wind: '7 km/h N', pressure: '1013 hPa', visibility: '4.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 155 },
      { time: '2 PM', aqi: 165 },
      { time: '4 PM', aqi: 172 },
      { time: '6 PM', aqi: 185 },
      { time: '8 PM', aqi: 190 },
      { time: '10 PM', aqi: 178 },
      { time: '12 AM', aqi: 162 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 92.5, unit: 'µg/m³', limit: 60, status: 'Poor', trend: 'up', desc: 'High humidity trapping Gangetic delta particulate drift' },
      { code: 'PM10', name: 'Coarse Particulates', value: 178.4, unit: 'µg/m³', limit: 100, status: 'Poor', trend: 'up', desc: 'Dense commercial transport and municipal dust' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 46.2, unit: 'ppb', limit: 80, status: 'Moderate', trend: 'up', desc: 'Heavy bus and diesel taxi fleets' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 18.0, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Howrah industrial belt processes' },
      { code: 'CO', name: 'Carbon Monoxide', value: 1.6, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'up', desc: 'Narrow street canyons slowing exhaust dispersion' },
      { code: 'O3', name: 'Ground-level Ozone', value: 22.8, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Moist air dampening ozone concentration' }
    ]
  },
  {
    citySlug: 'pune',
    aqi: 68,
    category: 'Moderate',
    dominantPollutant: 'PM10',
    trend24h: '-2%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '27°C', humidity: '64%', wind: '10 km/h WNW', pressure: '1013 hPa', visibility: '9.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 62 },
      { time: '2 PM', aqi: 68 },
      { time: '4 PM', aqi: 73 },
      { time: '6 PM', aqi: 76 },
      { time: '8 PM', aqi: 71 },
      { time: '10 PM', aqi: 66 },
      { time: '12 AM', aqi: 58 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 39.8, unit: 'µg/m³', limit: 60, status: 'Moderate', trend: 'down', desc: 'Automobile belt emissions and suburban dispersion' },
      { code: 'PM10', name: 'Coarse Particulates', value: 76.5, unit: 'µg/m³', limit: 100, status: 'Moderate', trend: 'stable', desc: 'Infrastructure expansion and hill slope dust' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 26.4, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Pimpri-Chinchwad arterial road traffic' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 9.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Controlled industrial manufacturing zones' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.8, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Smooth highway bypass distribution' },
      { code: 'O3', name: 'Ground-level Ozone', value: 31.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Moderate solar radiance conditions' }
    ]
  },
  {
    citySlug: 'shimla',
    aqi: 22,
    category: 'Good',
    dominantPollutant: 'PM2.5',
    trend24h: '-5%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
    weather: { temperature: '16°C', humidity: '48%', wind: '8 km/h NNW', pressure: '1018 hPa', visibility: '15.0 km' },
    hourlyForecast: [
      { time: '12 PM', aqi: 20 },
      { time: '2 PM', aqi: 22 },
      { time: '4 PM', aqi: 24 },
      { time: '6 PM', aqi: 25 },
      { time: '8 PM', aqi: 23 },
      { time: '10 PM', aqi: 21 },
      { time: '12 AM', aqi: 18 }
    ],
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 8.4, unit: 'µg/m³', limit: 60, status: 'Good', trend: 'stable', desc: 'Pure Himalayan mountain airs and cedar canopy' },
      { code: 'PM10', name: 'Coarse Particulates', value: 21.0, unit: 'µg/m³', limit: 100, status: 'Good', trend: 'down', desc: 'Minimal dust due to mountain vegetation' },
      { code: 'NO2', name: 'Nitrogen Dioxide', value: 6.5, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Pedestrianized ridge area with zero vehicular traffic' },
      { code: 'SO2', name: 'Sulfur Dioxide', value: 2.1, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'No industrial combustion within 60km' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.2, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Near baseline atmospheric levels' },
      { code: 'O3', name: 'Ground-level Ozone', value: 18.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'stable', desc: 'Pristine mountain troposphere' }
    ]
  }
];

export const INITIAL_DATA_SOURCES = [
  {
    _id: '670000000000000000000021',
    name: 'Central Pollution Control Board (CPCB)',
    provider: 'Ministry of Environment, Forest and Climate Change',
    type: 'National Regulatory Network',
    url: 'https://cpcb.nic.in',
    standard: 'India NAQI (2015/2026 Revision)',
    description: 'Government reference continuous ambient air quality monitoring network stations distributed across Tier-1 and Tier-2 urban hubs.',
    active: true
  },
  {
    _id: '670000000000000000000022',
    name: 'State Pollution Control Boards (SPCBs)',
    provider: 'State Environmental Protection Directorates',
    type: 'State Regulatory Observatory',
    url: 'https://tnpcb.gov.in',
    standard: 'Continuous PM2.5, PM10, NOx, SO2',
    description: 'State-level continuous telemetry monitors and industrial buffer emissions logging points across all 28 states & union territories.',
    active: true
  },
  {
    _id: '670000000000000000000023',
    name: 'IMD & Satellite Radiometry',
    provider: 'India Meteorological Department & Copernicus',
    type: 'Synoptic Meteorological Ingestion',
    url: 'https://mausam.imd.gov.in',
    standard: 'Synoptic Boundary Layer Modeling',
    description: 'India Meteorological Department Doppler radar, surface automatic weather stations, and ESA Copernicus Sentinel-5P aerosol optical depth.',
    active: true
  },
  {
    _id: '670000000000000000000024',
    name: 'Calibrated Micro-Sensor Matrix',
    provider: 'AeroSense IoT Research Consortium',
    type: 'Hyperlocal Ambient Mesh Network',
    url: 'https://aerosense.internal',
    standard: 'Dual-Optical Laser Scattering',
    description: 'Dual-laser optical particle counters (OPC) cross-calibrated against gravimetric beta-attenuation monitors for micro-cluster resolution.',
    active: true
  }
];
