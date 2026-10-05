/**
 * Centralized Image Asset Catalog for AeroSense
 * Legitimate, high-resolution Unsplash curated URLs with webp/compressed query parameters.
 * Encapsulated here so images can easily be swapped or connected to a CDN.
 */

export const IMAGES = {
  hero: {
    atmosphericCity: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80',
    delhiSkylineHaze: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85',
    cleanMorningAtmosphere: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    alt: 'Panoramic atmospheric horizon showing urban skyline and morning sunlight piercing gentle haze'
  },
  cities: {
    chennai: {
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      alt: 'Scenic coastal architecture and Marina beach promenade in Chennai under open skies'
    },
    delhi: {
      url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      alt: 'Historic India Gate and surrounding Delhi Rajpath under winter atmospheric haze'
    },
    mumbai: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      alt: 'Iconic Bandra-Worli Sea Link crossing the Arabian Sea in Mumbai'
    },
    bengaluru: {
      url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      alt: 'Green tree-lined tech corridor and Lalbagh botanical garden canopy in Bengaluru'
    },
    hyderabad: {
      url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=800&q=80',
      alt: 'Charminar monument and urban heritage vista in central Hyderabad'
    },
    kolkata: {
      url: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      alt: 'Majestic Howrah Bridge spanning the Hooghly river in Kolkata'
    },
    pune: {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      alt: 'Verdant Western Ghats foothills bordering Pune city skyline'
    },
    shimla: {
      url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
      alt: 'Crisp, pine-clad Himalayan ridgeline with pristine mountain air in Shimla'
    }
  },
  editorial: {
    atmosphericLayers: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
    atmosphericLayersAlt: 'Sun rays illuminating dynamic cloud and aerosol layers over mountain landscape',
    
    respiratoryHealth: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    respiratoryHealthAlt: 'Runner enjoying an outdoor jog during optimal morning air conditions',
    
    weatherWindClouds: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1000&q=80',
    weatherWindCloudsAlt: 'Dynamic meteorological clouds and wind currents over open terrain',
    
    sensorHardware: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    sensorHardwareAlt: 'High-precision environmental sensor equipment deployed in ambient monitoring field'
  },
  insights: [
    {
      id: 'understanding-pm25',
      category: 'Science & Physics',
      title: 'Understanding PM2.5: The Microscopic Threat You Can’t See',
      description: 'Why particles less than 2.5 micrometers in diameter bypass the respiratory defense system and penetrate deep into lung tissue.',
      readTime: '4 min read',
      date: 'Oct 2026',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      alt: 'Abstract microscopy representation of microscopic ambient particulates and fluid dynamics'
    },
    {
      id: 'winter-temperature-inversion',
      category: 'Meteorology',
      title: 'Why Winter Traps North India Under an Inversion Lid',
      description: 'Thermal inversion layers act like meteorological atmospheric ceilings, trapping surface particulate matter for days.',
      readTime: '6 min read',
      date: 'Sep 2026',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
      alt: 'Dense misty thermal inversion layer enveloping illuminated city skyscrapers at dawn'
    },
    {
      id: 'urban-ventilation-corridors',
      category: 'Urban Ecology',
      title: 'Coastal Breezes vs Landlocked Basins: The Geography of AQI',
      description: 'How maritime wind recirculation keeps peninsular cities like Chennai and Mumbai ventilated compared to northern valleys.',
      readTime: '5 min read',
      date: 'Aug 2026',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      alt: 'Dynamic ocean waves and coastal wind currents meeting coastline'
    },
    {
      id: 'cleanest-regions-india',
      category: 'Field Report',
      title: 'Which Indian Cities Consistently Maintain Sub-30 AQI?',
      description: 'An analysis of high-altitude Himalayan retreats and coastal enclaves with consistent pristine baseline air quality.',
      readTime: '3 min read',
      date: 'Jul 2026',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      alt: 'Snow-capped peaks and pristine mountain air above dense evergreen forests'
    }
  ],
  healthActivities: [
    {
      id: 'outdoor',
      title: 'Outdoor Exercise & Sports',
      advice: 'Safe when AQI < 100. Shift intense workouts indoors during peak traffic hours.',
      imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
      alt: 'Runner exercising outdoors in clean fresh air environment',
      category: 'Physical Activity'
    },
    {
      id: 'children',
      title: 'Children & Sensitive Groups',
      advice: 'Children inhale more air per body weight unit. Restrict outdoor recess if AQI > 150.',
      imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
      alt: 'Child playing outdoors in park sunshine',
      category: 'Vulnerable Groups'
    },
    {
      id: 'indoor',
      title: 'Indoor Air Quality & Filtration',
      advice: 'Run HEPA purifiers with doors sealed. Ventilate briefly only during lowest AQI windows.',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      alt: 'Clean, serene modern living space with potted plants and natural daylight',
      category: 'Home & Office'
    },
    {
      id: 'respiratory',
      title: 'Respiratory & Heart Health',
      advice: 'Keep bronchodilator medication handy. Monitor sudden dips in ambient oxygen & NO2 spikes.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      alt: 'Woman practicing mindful breathing meditation outdoors',
      category: 'Preventative Wellness'
    }
  ]
};
