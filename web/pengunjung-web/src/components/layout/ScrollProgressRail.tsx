import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollProgressRail
 *
 * Pengganti scrollbar bawaan browser dengan desain Neubrutalism (design.md):
 * - Lencana Persentase Space Mono (000% – 100%)
 * - Mistar Progres Baca vertikal dengan skala teknis & tuas geser (thumb)
 * - Mendukung klik langsung maupun tarik/geser (drag & scrub) seperti scrollbar penuh
 * - Sudut siku 0px, border hitam tegas, hard shadow tanpa blur, warna datar solid
 */
export function ScrollProgressRail() {
  const [percent, setPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      rafId = null;
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop || 0;
      const maxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight);

      if (maxScroll <= 4) {
        setPercent(0);
        return;
      }

      const raw = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
      setPercent(raw);
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrollProgress);
      }
    };

    updateScrollProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const resizeObserver = new ResizeObserver(onScrollOrResize);
    resizeObserver.observe(document.body);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  const formattedPercent = `${String(percent).padStart(3, '0')}%`;
  const isComplete = percent >= 99;
  const isAtTop = percent <= 1;

  const scrollToClientY = (clientY: number, smooth: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: clickRatio * maxScroll,
      behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto',
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    scrollToClientY(event.clientY, false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    scrollToClientY(event.clientY, false);
  };

  const handlePointerUpOrCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const handleBadgeClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({
      top: isAtTop ? Math.min(window.innerHeight * 0.85, maxScroll) : 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const badgeState = isDragging
    ? 'dragging'
    : isComplete
      ? 'complete'
      : isAtTop
        ? 'idle'
        : 'active';

  return (
    <aside
      className="nb-scroll-rail-wrapper"
      aria-label="Scroll Neubrutalist Lencana Persentase dan Mistar Progres Baca"
    >
      {/* Lencana Cap Persentase Space Mono */}
      <button
        type="button"
        onClick={handleBadgeClick}
        className="nb-scroll-percent-badge"
        data-state={badgeState}
        title={isAtTop ? 'Gulir ke bawah' : 'Kembali ke puncak halaman'}
        aria-label={`Posisi baca halaman ${percent} persen. Klik untuk ${
          isAtTop ? 'menggulir ke bawah' : 'kembali ke atas'
        }.`}
      >
        <span className="nb-scroll-percent-label">BACA</span>
        <span className="nb-scroll-percent-value">{formattedPercent}</span>
      </button>

      {/* Mistar Progres Baca Vertikal (Pengganti Scrollbar Bawaan — Bisa Diklik & Ditarik) */}
      <div
        ref={trackRef}
        className="nb-scroll-ruler-track"
        data-dragging={isDragging ? 'true' : 'false'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        role="scrollbar"
        aria-controls="main-content"
        aria-orientation="vertical"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Mistar scroll progres baca vertikal"
        title="Klik atau tarik mistar untuk menggulir halaman"
      >
        {/* Pengisi warna datar sesuai progres */}
        <div
          className="nb-scroll-ruler-fill"
          data-state={badgeState}
          style={{ height: `${percent}%` }}
        />

        {/* Garis skala mistar teknis (12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%) */}
        <span className="nb-scroll-ruler-tick nb-scroll-ruler-tick-sm" style={{ top: '12.5%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick" style={{ top: '25%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick nb-scroll-ruler-tick-sm" style={{ top: '37.5%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick nb-scroll-ruler-tick-mid" style={{ top: '50%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick nb-scroll-ruler-tick-sm" style={{ top: '62.5%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick" style={{ top: '75%' }} aria-hidden="true" />
        <span className="nb-scroll-ruler-tick nb-scroll-ruler-tick-sm" style={{ top: '87.5%' }} aria-hidden="true" />

        {/* Tuas Geser (Thumb) Neubrutalist */}
        <div
          className="nb-scroll-ruler-thumb"
          style={{ top: `clamp(5px, ${percent}%, calc(100% - 5px))` }}
          aria-hidden="true"
        />
      </div>
    </aside>
  );
}
