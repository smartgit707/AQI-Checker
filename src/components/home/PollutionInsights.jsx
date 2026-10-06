import React, { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Calendar, X, Share2, Check, Bookmark } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';

const ARTICLE_CONTENT = {
  'understanding-pm25': {
    author: 'Dr. Neha Sen, Aerosol Biophysics Research Fellow',
    readTime: '4 min read',
    date: 'October 2026',
    sections: [
      {
        heading: 'The Aerodynamic Diameter Dilemma',
        content: 'Particulate Matter 2.5 (PM2.5) refers to microscopic solid particles and liquid droplets suspended in ambient air that measure 2.5 micrometers or smaller in aerodynamic diameter. To put this in perspective, an average strand of human hair measures roughly 70 micrometers in cross-section—making PM2.5 particles more than 28 times smaller.'
      },
      {
        heading: 'Why Upper Airway Defenses Fail',
        content: 'The human upper respiratory tract relies on mechanical filtration: coarse particles (PM10) are predominantly trapped by nasal cilia and mucous membranes in the nasopharynx. PM2.5, however, is light enough to remain entrained in laminar airflow. It effortlessly bypasses the trachea, navigates the primary bronchi, and penetrates deeply into the terminal bronchioles and alveoli where gas exchange takes place.'
      },
      {
        heading: 'Cellular Translocation and Systemic Toxicity',
        content: 'Once deposited in the alveoli, ultrafine components of PM2.5 can cross the thin 0.2-micrometer alveolar-capillary barrier directly into arterial blood vessels. These particles carry heavy metals, polycyclic aromatic hydrocarbons (PAHs), and sulfates on their porous surface. In the bloodstream, they induce systemic endothelial inflammation, arterial plaque destabilization, and autonomic nervous system dysfunction, linking chronic ambient exposure to heart attacks, strokes, and reduced life expectancy.'
      }
    ],
    takeaways: [
      'PM2.5 particles are under 2.5 µm and invisible to the human eye.',
      'Unlike PM10, PM2.5 bypasses nasal cilia and enters lung alveoli directly.',
      'Chemical adsorbates on PM2.5 particles translocate into the bloodstream, triggering vascular inflammation.',
      'Certified N95/FFP2 respirators or mechanical True HEPA H13 filtration are required to capture particles of this scale.'
    ]
  },
  'winter-temperature-inversion': {
    author: 'Prof. K. Ramanathan, Synoptic Meteorology Lab',
    readTime: '6 min read',
    date: 'September 2026',
    sections: [
      {
        heading: 'Normal Atmospheric Lapse Rate vs. Inversion',
        content: 'Under normal daylight atmospheric conditions, sunlight warms the Earth’s surface, which in turn heats the lowest layers of air. Because warm air is less dense, it ascends rapidly, allowing vehicular and industrial pollutants to disperse vertically thousands of meters into the troposphere through turbulent convection.'
      },
      {
        heading: 'The Mechanics of Nocturnal Radiative Cooling',
        content: 'During winter months across the Indo-Gangetic Plains, clear nights with calm winds cause the ground to lose heat rapidly through longwave infrared terrestrial radiation. The cold ground chills the air layer resting directly above it, while the air a few hundred meters higher remains comparatively warm. This creates a "thermal inversion"—a dense layer of cold air trapped beneath an impenetrable lid of warmer air.'
      },
      {
        heading: 'The Planetary Boundary Layer (PBL) Compression',
        content: 'In summer, the planetary boundary layer expands up to 2,000–3,000 meters high. In northern winter inversions, this boundary layer compresses down to as little as 100 to 250 meters. The same volume of daily emissions that previously dispersed into cubic kilometers of air is suddenly squeezed into a narrow boundary zone, multiplying particulate concentrations by 500% to 800% overnight.'
      }
    ],
    takeaways: [
      'Normal daytime convection allows vertical dispersal of ground-level air pollution.',
      'Winter nocturnal cooling creates a warm thermal ceiling that traps cold, dense surface air.',
      'The planetary boundary layer compresses from ~2,000m to under 200m in December and January.',
      'Pollutants accumulate near ground level until solar heating breaks the inversion lid around midday.'
    ]
  },
  'urban-ventilation-corridors': {
    author: 'Arjun Mehta, Urban Climatologist & GIS Specialist',
    readTime: '5 min read',
    date: 'August 2026',
    sections: [
      {
        heading: 'The Maritime Diurnal Breeze Engine',
        content: 'Coastal metropolitan hubs like Chennai, Mumbai, and Kochi benefit from the diurnal land-sea breeze phenomenon. Differential heating between the ocean and land surfaces creates reliable pressure gradients: sea breezes rush inland by day, while land breezes return at night. This continuous horizontal flux flushes accumulated aerosols into the marine boundary layer.'
      },
      {
        heading: 'Landlocked Basins and Topographic Trapping',
        content: 'In contrast, northern inland cities in the Indo-Gangetic basin are bounded by the Himalayan wall to the north and elevated plateau formations to the south. This geographical trough creates a wind shadow effect where calm wind speeds (< 1.5 m/s) dominate for weeks during post-monsoon transitions, preventing horizontal ventilation.'
      },
      {
        heading: 'Designing Urban Ventilation Buffers',
        content: 'Modern urban planning can exploit natural microclimatic winds by establishing linear green corridors aligned with prevailing wind axes. High-density high-rise developments along coastlines must maintain aerodynamic permeability rather than creating monolithic continuous wall barriers that choke airflow into interior neighborhoods.'
      }
    ],
    takeaways: [
      'Coastal cities leverage natural diurnal maritime wind recirculation to disperse surface particulates.',
      'Landlocked river valleys suffer from geographic basin trapping and prolonged calm wind stagnation.',
      'Dense skyscraper shorefront developments must leave aerodynamic wind channels to ventilate inner city zones.',
      'Tree-lined arterial avenues aligned with prevailing airflow significantly enhance microclimate ventilation.'
    ]
  },
  'cleanest-regions-india': {
    author: 'Environmental Field Telemetry Group',
    readTime: '3 min read',
    date: 'July 2026',
    sections: [
      {
        heading: 'Pristine Baselines in High Elevation',
        content: 'Monitoring stations located in high-altitude Himalayan retreats like Shimla, Manali, and Leh consistently record baseline AQI indices between 15 and 35. These pristine values reflect both low local emissions density and dynamic katabatic mountain wind circulation that prevents particulate buildup.'
      },
      {
        heading: 'Natural Vegetative Bio-Filters',
        content: 'Extensive coniferous and broadleaf forest canopies act as active electrostatic particle precipitators. Tree needle structures and broadleaf stomata intercept dry deposition of PM10 and PM2.5, capturing up to 15% of suspended aerosol mass during non-rainy periods.'
      },
      {
        heading: 'Lessons for Urban Industrial Policy',
        content: 'Pristine monitoring zones demonstrate the necessity of maintaining regional buffer zones free of heavy fossil fuel combustion and stone-crushing operations within a 50 km radius of residential clusters, serving as reference benchmarks for the National Clean Air Programme (NCAP).'
      }
    ],
    takeaways: [
      'Himalayan and Western Ghats stations maintain baseline sub-30 AQI due to altitude and katabatic winds.',
      'Dense forest canopies serve as natural biological electrostatic air scrubbers.',
      'Strict zoning prohibiting heavy industrial combustion within buffer perimeters preserves regional air purity.',
      'Establishing pristine regional baseline monitors provides vital ground-truth calibration for satellite radiometry.'
    ]
  }
};

export default function PollutionInsights() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articleData = selectedArticle ? ARTICLE_CONTENT[selectedArticle.id] || null : null;

  return (
    <section id="insights" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Scientific Journalism"
          title="Environmental Insights & Field Reports"
          subtitle="In-depth analysis of aerosol thermodynamics, microclimate patterns, and air purification methodologies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {IMAGES.insights.map((article) => (
            <article 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedArticle(article); }}
              className="group cursor-pointer flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <div>
                {/* Article Card Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <OptimizedImage
                    src={article.imageUrl}
                    alt={article.alt}
                    className="group-hover:scale-105 transition-transform duration-500"
                    overlay={
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    }
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Card Metadata & Body */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Read Article link */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Interactive Article Reader Modal */}
      {selectedArticle && articleData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-left overflow-hidden relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Hero Image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100">
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.alt} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/20 focus:outline-none"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="text-slate-300 text-xs font-medium">
                    {articleData.date} • {articleData.readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight drop-shadow-sm">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  By {articleData.author}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Article Sections */}
              {articleData.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                    {sec.heading}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">
                    {sec.content}
                  </p>
                </div>
              ))}

              {/* Key Scientific Takeaways Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Key Scientific Takeaways
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                  {articleData.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Attribution */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Published by AeroSense Environmental Intelligence Network</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
