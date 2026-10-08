import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wind, 
  Search, 
  MapPin, 
  Menu, 
  X, 
  Bell, 
  Sliders, 
  ChevronDown, 
  Globe2,
  Compass,
  User,
  Heart,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  ShieldAlert,
  Home,
  Navigation
} from 'lucide-react';

export default function Navbar({ onSelectCity, selectedCity }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const dashboardMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (dashboardMenuRef.current && !dashboardMenuRef.current.contains(event.target)) {
        setDashboardMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setDashboardMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Analytics', href: '/analytics' },
    { name: 'Compare', href: '/compare' },
    { name: 'Rankings', href: '/rankings' },
    { name: 'Clean Route', href: '/clean-commute', isNew: true },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800 py-3' 
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <Wind className="w-4.5 h-4.5 text-emerald-100" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-1">
                AeroSense
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="block text-[9px] uppercase tracking-wider font-semibold text-slate-500 -mt-0.5">
                Environmental Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>{link.name}</span>
                {link.isNew && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    New
                  </span>
                )}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                to="/methodology"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
              >
                {t('nav.methodology', 'Methodology')}
              </Link>
            )}

            {/* Consolidated Dashboards Dropdown */}
            {isAuthenticated && (
              <div className="relative" ref={dashboardMenuRef}>
                <button
                  type="button"
                  onClick={() => setDashboardMenuOpen(!dashboardMenuOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    dashboardMenuOpen
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.dashboards', 'Dashboards')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dashboardMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {dashboardMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('nav.workspaces', 'Workspaces')}
                    </div>

                    <Link
                      to="/citizen-dashboard"
                      onClick={() => setDashboardMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t('nav.citizenDashboard', 'Citizen & Family')}</div>
                        <div className="text-3xs text-slate-500">{t('nav.citizenSubtitle', '24h Golden Window & advisory')}</div>
                      </div>
                    </Link>

                    <Link
                      to="/clean-commute"
                      onClick={() => setDashboardMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Clean Route Planner</div>
                        <div className="text-3xs text-slate-500">Eco-commute & inhaled PM2.5</div>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setDashboardMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t('nav.scientificDashboard', 'Scientific Dashboard')}</div>
                        <div className="text-3xs text-slate-500">{t('nav.scientificSubtitle', 'Telemetry & station sensors')}</div>
                      </div>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDashboardMenuOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors border-t border-slate-100 mt-1"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-purple-900">{t('nav.adminConsole', 'Admin Console')}</div>
                          <div className="text-3xs text-purple-500">{t('nav.adminSubtitle', 'System operations & controls')}</div>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Favorites Quick Icon */}
                <Link
                  to="/favorites"
                  title={`Saved Favorites (${user?.favoriteCities?.length || 0})`}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {user?.favoriteCities?.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </Link>

                {/* Notification Bell */}
                <NotificationBell />

                {/* Compact User Menu Avatar */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all"
                    title={user?.name || 'Account menu'}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('nav.signedInAs', 'Signed in as')}</p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        {user?.role === 'admin' ? (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-2xs font-bold bg-purple-100 text-purple-800">
                            System Administrator
                          </span>
                        ) : user?.role === 'citizen' ? (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-2xs font-bold bg-emerald-100 text-emerald-800">
                            🏡 Citizen & Household
                          </span>
                        ) : (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-2xs font-bold bg-teal-100 text-teal-800">
                            🔬 Environmental Researcher
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50/50 hover:bg-purple-100/70 transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4 text-purple-600" />
                            <span>Administrative Console</span>
                          </Link>
                        )}

                        <Link
                          to={user?.role === 'citizen' ? '/citizen-dashboard' : '/dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {user?.role === 'citizen' ? (
                            <>
                              <Home className="w-4 h-4 text-emerald-600" />
                              <span>{t('nav.citizenDashboard', 'Citizen & Family Dashboard')}</span>
                            </>
                          ) : (
                            <>
                              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                              <span>{t('nav.scientificDashboard', 'Scientific Dashboard')}</span>
                            </>
                          )}
                        </Link>

                        <Link
                          to="/citizen-dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <Home className="w-4 h-4 text-teal-600" />
                          <span>Citizen & Family Health Advisory</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Monitored Favorites ({user?.favoriteCities?.length || 0})</span>
                        </Link>

                        <Link
                          to="/alerts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Bell className="w-4 h-4 text-amber-500" />
                          <span>Threshold Alert Rules</span>
                        </Link>

                        <Link
                          to="/notifications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-teal-500" />
                          <span>Notifications Inbox</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile Overview</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Settings & Security</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Public Visitor Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  {t('nav.getStarted', 'Get Started')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {isAuthenticated && (
            <div className="p-3 mb-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                  <div className="text-2xs text-slate-500">{user?.email}</div>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                Dashboard
              </Link>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith('/') && !link.href.includes('#');
              return isInternal ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
                >
                  {link.name}
                </a>
              );
            })}

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-base font-bold text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Administrative Console</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Scientific Dashboard</span>
                </Link>
                <Link
                  to="/citizen-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-teal-600" />
                  <span>Citizen & Family Health</span>
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Monitored Favorites</span>
                </Link>
                <Link
                  to="/alerts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Threshold Alert Rules</span>
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>Notifications Inbox</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile Overview</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings & Security</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-center font-semibold text-sm text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-center font-semibold text-sm text-white"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
