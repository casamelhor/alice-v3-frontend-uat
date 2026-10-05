import { Layout } from '@/components/layout';
import { CalendarPage } from '@/pages/CalendarPage';
import { ToastContainer } from '@/components/ui';

/**
 * Main App component
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Layout>
      <CalendarPage />
      <ToastContainer />
    </Layout>
  );
}

export default App;
