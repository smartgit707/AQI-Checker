import { IMAGES } from './images';

/**
 * Standard mock/demonstration environmental data for AeroSense.
 * Structured cleanly so real sensor APIs / CPCB telemetry can plug in seamlessly.
 */

export const CITIES_DATA = [
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    aqi: 54,
    status: 'Moderate',
    dominantPollutant: 'PM2.5',
    trend: '-4%',
    temperature: '31°C',
    humidity: '74%',
    wind: '16 km/h ENE',
    pressure: '1011 hPa',
    visibility: '7.5 km',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    image: IMAGES.cities.chennai.url,
    imageAlt: IMAGES.cities.chennai.alt,
    station: 'Alandur & Marina Coastline CPCB Monitoring Station',
    updatedAt: '12 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 24.1, unit: 'ppb', limit: 80, status: 'Good', trend: 'down', desc: 'Vehicular exhaust and thermal power station emissions' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 11.5, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Industrial refinery emissions and fuel oil burning' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.7, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Incomplete fossil fuel combustion in heavy transit' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 38.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Photochemical reaction of VOCs and sunlight' }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'National Capital Territory',
    aqi: 284,
    status: 'Unhealthy',
    dominantPollutant: 'PM2.5',
    trend: '+12%',
    temperature: '26°C',
    humidity: '58%',
    wind: '5 km/h NW',
    pressure: '1014 hPa',
    visibility: '2.1 km',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    image: IMAGES.cities.delhi.url,
    imageAlt: IMAGES.cities.delhi.alt,
    station: 'Anand Vihar & RK Puram Continuous Station',
    updatedAt: '8 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 68.3, unit: 'ppb', limit: 80, status: 'Moderate', trend: 'up', desc: 'High density vehicular congestion' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 28.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Peripheral industrial cluster discharges' },
      { code: 'CO', name: 'Carbon Monoxide', value: 2.8, unit: 'mg/m³', limit: 4.0, status: 'Moderate', trend: 'up', desc: 'Idling traffic queues across arterial ring roads' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 42.1, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Diminished solar irradiance due to haze layer' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    aqi: 112,
    status: 'Poor',
    dominantPollutant: 'PM10',
    trend: '+3%',
    temperature: '32°C',
    humidity: '72%',
    wind: '14 km/h W',
    pressure: '1012 hPa',
    visibility: '5.0 km',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    image: IMAGES.cities.mumbai.url,
    imageAlt: IMAGES.cities.mumbai.alt,
    station: 'Bandra Kurla Complex Ambient Air Station',
    updatedAt: '15 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 34.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Western Express Highway vehicular flow' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 14.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Harbour thermal and industrial zones' },
      { code: 'CO', name: 'Carbon Monoxide', value: 1.1, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Dense commercial transport fleet' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 29.5, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Maritime cloud cover shielding photochemical action' }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    aqi: 42,
    status: 'Good',
    dominantPollutant: 'PM2.5',
    trend: '-8%',
    temperature: '25°C',
    humidity: '61%',
    wind: '11 km/h ESE',
    pressure: '1015 hPa',
    visibility: '10.0 km',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: IMAGES.cities.bengaluru.url,
    imageAlt: IMAGES.cities.bengaluru.alt,
    station: 'BTM Layout & Saneguruvanahalli Station',
    updatedAt: '5 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 19.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'down', desc: 'Tech corridor commuter movement' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 7.2, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Low heavy industry in municipal boundary' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.5, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Efficient light commercial traffic' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 25.1, unit: 'ppb', limit: 100, status: 'Good', trend: 'stable', desc: 'Stable atmospheric equilibrium' }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    aqi: 78,
    status: 'Moderate',
    dominantPollutant: 'PM2.5',
    trend: '+1%',
    temperature: '29°C',
    humidity: '55%',
    wind: '9 km/h NE',
    pressure: '1013 hPa',
    visibility: '8.0 km',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    image: IMAGES.cities.hyderabad.url,
    imageAlt: IMAGES.cities.hyderabad.alt,
    station: 'Zoo Park & Sanathnagar Monitoring Point',
    updatedAt: '20 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 28.7, unit: 'ppb', limit: 80, status: 'Good', trend: 'up', desc: 'Commuter density along Hitec City axis' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 12.3, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Industrial estate peripheral operations' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.9, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Moderate vehicular emissions' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 33.4, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Clear sky photochemical generation' }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    aqi: 165,
    status: 'Poor',
    dominantPollutant: 'PM2.5',
    trend: '+7%',
    temperature: '28°C',
    humidity: '79%',
    wind: '7 km/h N',
    pressure: '1013 hPa',
    visibility: '4.0 km',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    image: IMAGES.cities.kolkata.url,
    imageAlt: IMAGES.cities.kolkata.alt,
    station: 'Victoria Memorial & Rabindra Bharati Station',
    updatedAt: '18 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 46.2, unit: 'ppb', limit: 80, status: 'Moderate', trend: 'up', desc: 'Heavy bus and diesel taxi fleets' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 18.0, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Howrah industrial belt processes' },
      { code: 'CO', name: 'Carbon Monoxide', value: 1.6, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'up', desc: 'Narrow street canyons slowing exhaust dispersion' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 22.8, unit: 'ppb', limit: 100, status: 'Good', trend: 'down', desc: 'Moist air dampening ozone concentration' }
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    aqi: 68,
    status: 'Moderate',
    dominantPollutant: 'PM10',
    trend: '-2%',
    temperature: '27°C',
    humidity: '64%',
    wind: '10 km/h WNW',
    pressure: '1013 hPa',
    visibility: '9.0 km',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    image: IMAGES.cities.pune.url,
    imageAlt: IMAGES.cities.pune.alt,
    station: 'Shivajinagar & Katraj Environmental Point',
    updatedAt: '10 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 26.4, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Pimpri-Chinchwad arterial road traffic' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 9.8, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Controlled industrial manufacturing zones' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.8, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Smooth highway bypass distribution' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 31.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'up', desc: 'Moderate solar radiance conditions' }
    ]
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    aqi: 22,
    status: 'Good',
    dominantPollutant: 'PM2.5',
    trend: '-5%',
    temperature: '16°C',
    humidity: '48%',
    wind: '8 km/h NNW',
    pressure: '1018 hPa',
    visibility: '15.0 km',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    image: IMAGES.cities.shimla.url,
    imageAlt: IMAGES.cities.shimla.alt,
    station: 'The Mall & Ridge Clean Mountain Station',
    updatedAt: '30 mins ago (Demo Telemetry)',
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
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 6.5, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'Pedestrianized ridge area with zero vehicular traffic' },
      { code: 'SO₂', name: 'Sulfur Dioxide', value: 2.1, unit: 'ppb', limit: 80, status: 'Good', trend: 'stable', desc: 'No industrial combustion within 60km' },
      { code: 'CO', name: 'Carbon Monoxide', value: 0.2, unit: 'mg/m³', limit: 4.0, status: 'Good', trend: 'stable', desc: 'Near baseline atmospheric levels' },
      { code: 'O₃', name: 'Ground-level Ozone', value: 18.0, unit: 'ppb', limit: 100, status: 'Good', trend: 'stable', desc: 'Pristine mountain troposphere' }
    ]
  }
];

export const TOP_POLLUTED = [
  { city: 'Delhi NCR', state: 'NCT', aqi: 284, category: 'Unhealthy' },
  { city: 'Noida', state: 'Uttar Pradesh', aqi: 276, category: 'Unhealthy' },
  { city: 'Faridabad', state: 'Haryana', aqi: 268, category: 'Unhealthy' },
  { city: 'Patna', state: 'Bihar', aqi: 245, category: 'Unhealthy' },
  { city: 'Muzaffarpur', state: 'Bihar', aqi: 231, category: 'Unhealthy' }
];

export const CLEANEST_CITIES = [
  { city: 'Shimla', state: 'Himachal Pradesh', aqi: 22, category: 'Good' },
  { city: 'Aizawl', state: 'Mizoram', aqi: 26, category: 'Good' },
  { city: 'Gangtok', state: 'Sikkim', aqi: 28, category: 'Good' },
  { city: 'Mysuru', state: 'Karnataka', aqi: 34, category: 'Good' },
  { city: 'Bengaluru', state: 'Karnataka', aqi: 42, category: 'Good' }
];
