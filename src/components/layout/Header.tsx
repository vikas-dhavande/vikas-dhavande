import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, ChevronDown, Home as HomeIcon, Moon, Sun, Github, Linkedin, Twitter, Youtube, LogOut, ChevronDown as DropIcon, X, FileText, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../AuthModal';

// ─── Static searchable data ───────────────────────────────────────────────────
const SEARCH_DATA = [
  // Projects
  { type: 'project' as const, id: '1', title: 'Arduino Custom Board', subtitle: 'Embedded Systems', path: '/projects/1', tags: ['C++', 'Altium', 'AVR'] },
  { type: 'project' as const, id: '2', title: 'Industrial Machine Monitoring System', subtitle: 'Industrial Automation', path: '/projects/2', tags: ['Node.js', 'Modbus', 'React'] },
  { type: 'project' as const, id: '3', title: 'SMT Machine Error Log Standardization', subtitle: 'Data Engineering', path: '/projects/3', tags: ['Kafka', 'Python'] },
  { type: 'project' as const, id: '4', title: 'Medical Device Evaluation Study', subtitle: 'Medical Electronics', path: '/projects/4', tags: ['MATLAB', 'Python'] },
  // Blogs
  { type: 'blog' as const, id: '1', title: 'Understanding Modbus TCP in Industrial Automation', subtitle: 'Industrial Automation · 5 min', path: '/blogs/understanding-modbus-tcp', tags: ['Modbus', 'Networking'] },
  { type: 'blog' as const, id: '2', title: 'Best Practices for High-Speed PCB Routing', subtitle: 'PCB Design · 8 min', path: '/blogs/high-speed-pcb-routing', tags: ['Altium', 'Signal Integrity'] },
  { type: 'blog' as const, id: '3', title: 'Transitioning from Embedded to Semiconductor Systems', subtitle: 'Career · 6 min', path: '/blogs/embedded-to-semiconductor', tags: ['Career', 'VLSI'] },
  { type: 'blog' as const, id: '4', title: 'Building a Custom Arduino Board from Scratch', subtitle: 'Embedded Systems · 10 min', path: '/blogs/custom-arduino-board', tags: ['Arduino', 'PCB'] },
  { type: 'blog' as const, id: '5', title: 'Data Pipelines for SMT Machine Logs', subtitle: 'Industrial Automation · 7 min', path: '/blogs/smt-machine-logs-pipeline', tags: ['Kafka', 'Python'] },
  // Pages
  { type: 'page' as const, id: 'skills', title: 'Skills', subtitle: 'Technical skills overview', path: '/skills', tags: ['skills'] },
  { type: 'page' as const, id: 'contact', title: 'Contact', subtitle: 'Get in touch', path: '/contact', tags: ['contact'] },
];

type SearchItem = typeof SEARCH_DATA[number];

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-300/40 dark:bg-yellow-500/30 text-black dark:text-white rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Search Panel ──────────────────────────────────────────────────────────────
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results: SearchItem[] = q.length < 2 ? [] : SEARCH_DATA.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.subtitle.toLowerCase().includes(q) ||
    item.tags.some(t => t.toLowerCase().includes(q))
  );

  const projects = results.filter(r => r.type === 'project');
  const blogs = results.filter(r => r.type === 'blog');
  const pages = results.filter(r => r.type === 'page');

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-2xl z-40">
      {/* Search input bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search projects, blogs, skills..."
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 transition-colors font-mono ml-2"
        >
          Esc
        </button>
      </div>

      {/* Results */}
      <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
        {q.length < 2 ? (
          <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            Type at least 2 characters to search…
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            No results for <span className="text-black dark:text-white font-medium">"{query}"</span>
          </div>
        ) : (
          <>
            {projects.length > 0 && (
              <ResultGroup label="Projects" items={projects} query={query} onSelect={handleSelect} icon={<Cpu className="w-3.5 h-3.5" />} />
            )}
            {blogs.length > 0 && (
              <ResultGroup label="Blogs" items={blogs} query={query} onSelect={handleSelect} icon={<FileText className="w-3.5 h-3.5" />} />
            )}
            {pages.length > 0 && (
              <ResultGroup label="Pages" items={pages} query={query} onSelect={handleSelect} icon={<Search className="w-3.5 h-3.5" />} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResultGroup({ label, items, query, onSelect, icon }: {
  label: string;
  items: SearchItem[];
  query: string;
  onSelect: (path: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        {icon} {label}
      </div>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.path)}
          className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {highlight(item.title, query)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {item.subtitle}
            </p>
          </div>
          <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 mt-0.5 shrink-0 transition-colors">↵</span>
        </button>
      ))}
    </div>
  );
}

// ─── Nav & Social data ────────────────────────────────────────────────────────
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Experience', path: '/#experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/vikasdhavande', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/vikasdhavande', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/vikasdhavande', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@vikasdhavande', label: 'YouTube' },
];

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold select-none">
      {initials}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname, location.hash]);

  // Close search when navigating
  useEffect(() => { setIsSearchOpen(false); }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTab = navLinks.find(l =>
    (location.pathname + location.hash) === l.path ||
    (location.pathname === l.path && !location.hash)
  )?.name || 'Home';

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    await logout();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black text-black dark:text-white border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 h-14 md:h-16">

          {/* Left: Home & Tabs */}
          <div className="flex items-center gap-4 md:gap-6 h-full">
            <Link to="/" aria-label="Home" className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <HomeIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>

            {/* Desktop Tabs */}
            <nav className="hidden md:flex items-center h-full">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors px-4 h-full flex items-center border-b-2',
                    (location.pathname + location.hash) === link.path ||
                      (location.pathname === link.path && !location.hash)
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Tab Dropdown trigger */}
            <div
              className="md:hidden flex items-center gap-1 cursor-pointer text-black dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="text-base font-medium">{currentTab}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Center: spacer */}
          <div className="hidden lg:flex flex-1" />

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(s => !s)}
                aria-label="Toggle search"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isSearchOpen
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                )}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Login button */}
              {!user && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center px-5 py-1.5 text-sm font-semibold rounded-full border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  Login
                </button>
              )}

              <div className="flex items-center gap-2 ml-2">
                {socialLinks.slice(0, 2).map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mobile: search + menu buttons */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle search"
              onClick={() => setIsSearchOpen(s => !s)}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MoreHorizontal className="w-6 h-6" />
            </button>

            {/* User dropdown (authenticated) */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <UserAvatar name={user.name || user.email} />
                  <span className="hidden md:block text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                  <DropIcon className="hidden md:block w-3.5 h-3.5 text-gray-400" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-black dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden ml-1 md:hidden" />
            )}
          </div>
        </div>

        {/* ── Search Panel ── */}
        {isSearchOpen && <SearchPanel onClose={() => setIsSearchOpen(false)} />}

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-lg py-2 px-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'block py-3 px-2 text-base font-medium transition-colors border-b border-gray-100 dark:border-gray-900 last:border-0',
                  (location.pathname + location.hash) === link.path ||
                    (location.pathname === link.path && !location.hash)
                    ? 'text-black dark:text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between py-4 mt-2 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name || user.email} />
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                  className="flex items-center justify-center px-6 py-2 text-sm font-semibold rounded-full border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  Login
                </button>
              )}
              <div className="flex gap-3">
                {socialLinks.slice(0, 2).map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
