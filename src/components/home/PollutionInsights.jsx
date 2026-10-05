import React from 'react';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';

export default function PollutionInsights() {
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
              className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all duration-300"
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
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
