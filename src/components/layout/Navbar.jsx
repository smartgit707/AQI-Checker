import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import ThemeToggle from '../common/ThemeToggle';
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
  Home
} from 'lucide-react';

export default function Navbar({ onSelectCity, selectedCity }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Overview', href: '/' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Compare', href: '/compare' },
    { name: 'Rankings', href: '/rankings' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Live Map', href: '/#live-map' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800 py-3' 
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <Wind className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-1">
                AeroSense
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Environmental Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith('/') && !link.href.includes('#');
              return isInternal ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
                >
                  {link.name}
                </a>
              );
            })}

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/citizen-dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50/80 hover:bg-teal-100/80 transition-colors flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5 text-teal-600" />
                  <span>Family Health</span>
                </Link>
                <Link
                  to="/favorites"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Favorites</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50/80 hover:bg-purple-100/80 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="flex items-center gap-2">
                {/* Part 7: Notification Bell with Badge & Dropdown */}
                <NotificationBell />

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden xl:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate">
                        {user?.name || 'Account'}
                      </div>
                      <div className="text-2xs text-slate-400 leading-tight">
                        {user?.role === 'admin' ? 'Administrator' : 'Environmentalist'}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        {user?.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-2xs font-bold bg-purple-100 text-purple-800">
                            System Administrator
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
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>Scientific Dashboard</span>
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
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
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
