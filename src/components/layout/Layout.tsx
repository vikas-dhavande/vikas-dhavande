import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-300 font-sans selection:bg-gray-200 dark:selection:bg-gray-800 selection:text-black dark:selection:text-white flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
