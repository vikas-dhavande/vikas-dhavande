import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube, Mail, MapPin } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/vikasdhavande', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/vikasdhavande', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/vikasdhavande', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@vikasdhavande', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-black dark:text-white font-mono font-bold group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                V
              </div>
              <span className="text-xl font-bold tracking-tight text-black dark:text-white">
                Vikas<span className="text-gray-500 dark:text-gray-400">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              Building Intelligent Embedded & Industrial Systems. Transitioning towards Advanced Electronics & Semiconductor Systems.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/projects" className="hover:text-black dark:hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/blogs" className="hover:text-black dark:hover:text-white transition-colors">Blogs</Link></li>
              <li><Link to="/skills" className="hover:text-black dark:hover:text-white transition-colors">Skills Map</Link></li>
              <li><Link to="/docs" className="hover:text-black dark:hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <a href="mailto:vikasndhavande@gmail.com" className="hover:text-black dark:hover:text-white transition-colors">
                  vikasndhavande@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>Bengaluru, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Vikas Dhavande. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-black dark:text-white font-medium">React</span> & <span className="text-black dark:text-white font-medium">Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
