import PropTypes from 'prop-types';
import { Bell, User } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'calendar', label: 'Calendar', href: '#', active: true },
  { id: 'bookings', label: 'Bookings', href: '#' },
  { id: 'people', label: 'People', href: '#' },
  { id: 'company', label: 'Company', href: '#' },
  { id: 'properties', label: 'Properties', href: '#' },
];

/**
 * Header component with navigation
 * @param {Object} props
 * @param {string} [props.currentPage='calendar'] - Current active page
 * @returns {JSX.Element}
 */
export function Header({ currentPage = 'calendar' }) {
  return (
    <header className="bg-white border-b border-[var(--color-alice-sand)]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-semibold text-[var(--color-alice-brown)] italic">
                Alice
              </span>
              <span className="text-xs text-[var(--color-alice-brown-light)]">
                A <span className="text-[var(--color-alice-brown)]">CasaMelhor</span> Company
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`
                    text-sm font-medium transition-colors relative py-2
                    ${
                      item.id === currentPage
                        ? 'text-[var(--color-alice-brown)]'
                        : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {item.label}
                  {item.id === currentPage && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-alice-brown)]" />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-alice-brown)] hover:bg-[var(--color-alice-cream)] rounded-lg transition-colors">
              Create Booking
            </button>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  currentPage: PropTypes.string,
};
