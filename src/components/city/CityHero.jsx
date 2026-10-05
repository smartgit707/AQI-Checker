import React, { useState } from 'react';
import { MapPin, Clock, Radio, ShieldCheck, Share2, ArrowLeft, GitCompare, Heart, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { getAQILevel } from '../../design-system/aqiTokens';
import { useAuth } from '../../context/AuthContext';

export default function CityHero({ city, airQuality, weather, onOpenAlertModal }) {
  const level = getAQILevel(airQuality?.aqi || 50);
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [favoriteNotice, setFavoriteNotice] = useState('');

  const citySlug = (city.slug || city.id || '').toLowerCase();
  const favorited = isFavorite(citySlug);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/city/${citySlug}`);
      return;
    }
    const res = await toggleFavorite(citySlug);
    if (res.success) {
      setFavoriteNotice(res.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
      setTimeout(() => setFavoriteNotice(''), 2500);
    } else if (res.error) {
      setFavoriteNotice(res.error);
      setTimeout(() => setFavoriteNotice(''), 3500);
    }
  };

  const handleAlertClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/city/${citySlug}`);
      return;
    }
    if (onOpenAlertModal) {
      onOpenAlertModal();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${city.name} Air Quality & Environmental Intelligence — AeroSense`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Background Ambience Image with Heavy Gradient */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <OptimizedImage
          src={city.image}
          alt={city.imageAlt || `${city.name} skyline`}
          aspectRatio="h-full w-full"
          className="h-full w-full"
          priority={true}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>National Overview</span>
            </Link>
            <span>/</span>
            <span>India</span>
            <span>/</span>
            <span>{city.state}</span>
            <span>/</span>
            <span className="text-emerald-400">{city.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {favoriteNotice && (
              <span className="text-2xs font-bold px-2 py-1 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 animate-fadeIn">
                {favoriteNotice}
              </span>
            )}

            <button
              type="button"
              onClick={handleFavoriteClick}
              title={favorited ? 'Remove from favorites' : 'Save city to favorites'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                favorited
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  favorited ? 'fill-rose-400 text-rose-400' : 'text-white'
                }`}
              />
              <span>{favorited ? 'Favorited ♥' : 'Save to Favorites'}</span>
            </button>

            <button
              type="button"
              onClick={handleAlertClick}
              title="Set AQI threshold alert"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Set Alert</span>
            </button>

            <Link
              to={`/compare?cities=${city.slug || city.id},mumbai`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare This City</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Hero Content Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{airQuality?.isLive ? 'Continuous CAAQMS Telemetry' : 'Standard Station Monitoring'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white">
              {city.name}
            </h1>
            <p className="mt-2 text-lg text-slate-300 font-medium">
              {city.state}, {city.country}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {city.station || 'CPCB Central Station'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Retrieved: {airQuality?.retrievedAt ? new Date(airQuality.retrievedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                India NAQI Scale
              </span>
            </div>

            {city.description && (
              <p className="mt-4 text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
                {city.description}
              </p>
            )}
          </div>

          {/* Quick Score Highlight Box */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-3 border-b border-white/10">
              <span className="font-bold uppercase tracking-wider">Air Quality Index</span>
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-black"
                style={{ backgroundColor: level.color, color: '#ffffff' }}
              >
                {level.category}
              </span>
            </div>

            <div className="my-4 flex items-baseline gap-3">
              <span 
                className="text-6xl sm:text-7xl font-black font-display tracking-tight"
                style={{ color: level.color }}
              >
                {airQuality?.aqi ?? 50}
              </span>
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block">NAQI Score</span>
                <span className="text-xs text-slate-300">
                  Dominant: <strong className="text-white">{airQuality?.dominantPollutant || 'PM2.5'}</strong>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Surface Temp: <strong className="text-white">{weather?.temperature || '28°C'}</strong></span>
              <span>Humidity: <strong className="text-white">{weather?.humidity || '65%'}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
