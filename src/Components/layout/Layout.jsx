import PropTypes from 'prop-types';
import { Header } from './Header';

/**
 * Main layout component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-alice-cream)]">
      <Header currentPage="calendar" />
      <main>{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
