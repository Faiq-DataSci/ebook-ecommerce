import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgressRail } from './ScrollProgressRail';

export function MainLayout() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <a href="#main-content" className="nb-skip-link">
        Lewati ke konten utama
      </a>
      <Navbar />
      <ScrollProgressRail />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
