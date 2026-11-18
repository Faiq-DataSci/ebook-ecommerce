import { useEffect, useRef, type CSSProperties } from 'react';

export interface AnimatedSpiralCanvasProps {
  className?: string;
  style?: CSSProperties;
  /** Pengali opasitas garis (default 1) */
  intensity?: number;
}

const TWO_PI = Math.PI * 2;
// Satu putaran penuh ~52 detik (design brief: 30–60 detik)
const ROTATION_SPEED = 0.12;
// Interval perpindahan lengan aksen (detik)
const ACCENT_INTERVAL = 6;
// Frame acuan untuk mode prefers-reduced-motion
const STATIC_TIMESTAMP = 0;
// Durasi efek mekar saat halaman pertama kali dibuka (detik) — diperlambat agar lebih anggun
const INTRO_BLOOM_DURATION = 3.2;
// Parameter riak gelombang halus yang merambat keluar dari pusat ke tepi
const RIPPLE_AMPLITUDE = 0.048;
const RIPPLE_CYCLES = 2.2;
const RIPPLE_SPEED = 1.6;
// 6 warna aksen lengkap design.md (bagian 2.1) yang mengalir berurutan di seluruh lengan
const ACCENT_PALETTE = [
  '#FFD23F', // nb-yellow (Kuning)
  '#74B9FF', // nb-blue (Biru)
  '#B8A9FA', // nb-lavender (Lavender)
  '#FF6B6B', // nb-pink (Merah Muda / Koral)
  '#88D498', // nb-green (Hijau)
  '#FFA552', // nb-orange (Oranye)
] as const;

/**
 * Background spiral dekoratif untuk Hero Section (zona A, design.md).
 * Lengan spiral simetris berpusat tepat di tengah container, garis solid
 * tanpa putus-putus, warna datar tanpa gradien/blur/glow.
 */
export function AnimatedSpiralCanvas({
  className = '',
  style,
  intensity = 1,
}: AnimatedSpiralCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let introStartTime: number | null = null;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let width = 0;
    let height = 0;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    // #B3B1AC setara nb-black opasitas 30% di atas nb-paper (#FFFDF5), dibuat opak.
    const blackAlpha = Math.min(0.3 * intensity, 0.6);
    const mix = (paper: number) => Math.round(paper * (1 - blackAlpha));
    const COLOR_BLACK = `rgb(${mix(255)}, ${mix(253)}, ${mix(245)})`;

    const renderFrame = (timestamp: number) => {
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 640;

      // Pusat presisi di tengah container
      const cx = width / 2;
      const cy = height / 2;

      // Lengan menjangkau sudut terjauh agar pola memenuhi area tanpa celah
      const outerRadius = Math.hypot(cx, cy) * 1.05;
      const innerRadius = isMobile ? 14 : 20;

      // Jumlah lengan sedikit agar komposisi lega
      const armCount = isMobile ? 4 : 6;
      const steps = isMobile ? 96 : 144;

      // Ketebalan seragam di sepanjang lengan dan sama untuk semua lengan
      const lineWidth = isMobile ? 2 : 2.5;

      const t = timestamp * 0.001;
      if (introStartTime === null && !prefersReducedMotion) {
        introStartTime = t;
      }
      const bloomElapsed = introStartTime !== null ? Math.max(0, t - introStartTime) : INTRO_BLOOM_DURATION;

      // Rotasi berlawanan arah lilitan: pada sudut tetap, posisi lengan
      // bergerak menjauhi pusat sehingga spiral tampak mengalir keluar.
      const rotation = -t * ROTATION_SPEED;
      // Variasi lengkung sangat halus dan seragam agar simetri tetap terjaga
      const turns = 1.15 + 0.06 * Math.sin(t * 0.25);
      const sweep = turns * TWO_PI;
      const radiusSpan = outerRadius - innerRadius;

      // Hitung rentang denyut warna mengalir dari pusat (0) menuju tepi luar (1)
      const computePulseRange = (progress: number): [number, number] => {
        if (prefersReducedMotion) return [0, 1];
        if (progress <= 0.65) {
          // Fase 1: warna merambat keluar dari pusat hingga menyentuh tepi luar
          const grow = progress / 0.65;
          return [0, 1 - Math.pow(1 - grow, 1.6)];
        }
        // Fase 2: ekor warna bergerak meninggalkan pusat menuju tepi luar sebelum mulai siklus baru
        const tail = (progress - 0.65) / 0.35;
        return [Math.pow(tail, 1.5), 1];
      };

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.lineWidth = lineWidth;

      const traceArmSegment = (baseAngle: number, pFrom: number, pTo: number, segSteps: number) => {
        const span = pTo - pFrom;
        if (span <= 0.002) return;
        ctx.beginPath();
        for (let i = 0; i <= segSteps; i++) {
          const p = pFrom + span * (i / segSteps);
          const r = innerRadius + radiusSpan * Math.pow(p, 1.35);
          // Riak gelombang halus yang berjalan keluar dari pusat menuju tepi
          const ripple = prefersReducedMotion
            ? 0
            : RIPPLE_AMPLITUDE *
              Math.sin(p * Math.PI) *
              Math.sin(p * RIPPLE_CYCLES * TWO_PI - t * RIPPLE_SPEED);
          const theta = baseAngle + p * sweep + ripple;
          const x = cx + r * Math.cos(theta);
          const y = cy + r * Math.sin(theta);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };

      // Full 6-Color Cascade + Intro Spiral Bloom (mekar perlahan keluar dari pusat selama 3,2 detik pertama)
      for (let arm = 0; arm < armCount; arm++) {
        const baseAngle = rotation + (arm * TWO_PI) / armCount;

        // Efek mekar awal (Intro Spiral Bloom) selama 3,2 detik pertama saat halaman dibuka
        let bloomLimit = 1;
        if (!prefersReducedMotion && bloomElapsed < INTRO_BLOOM_DURATION) {
          const armDelay = (arm / armCount) * 0.55;
          const armDuration = INTRO_BLOOM_DURATION - 0.55;
          const rawBloom = Math.min(1, Math.max(0, (bloomElapsed - armDelay) / armDuration));
          // Ease-out lembut (pangkat 2): merambat tenang dari titik tengah menuju tepi layar
          bloomLimit = 1 - Math.pow(1 - rawBloom, 2);
        }

        // Setiap lengan memiliki selisih fase teratur (arm / armCount) agar warna mengalir berurutan
        const armTimeline = t / ACCENT_INTERVAL + arm / armCount;
        const armCycle = Math.floor(armTimeline);
        const armProgress = armTimeline - armCycle;
        const [pulseStart, pulseEnd] = computePulseRange(armProgress);

        // Urutan warna berotasi melalui 6 token: Kuning -> Biru -> Lavender -> Pink -> Hijau -> Oranye
        const armAccent = ACCENT_PALETTE[(arm + armCycle) % ACCENT_PALETTE.length];

        // 1. Gambar garis dasar dari pusat hingga batas mekar (bloomLimit)
        ctx.strokeStyle = COLOR_BLACK;
        traceArmSegment(baseAngle, 0, bloomLimit, steps);

        // 2. Alirkan denyut warna aksen dari pusat ke tepi mengikuti batas mekar
        const clampedStart = Math.min(pulseStart, bloomLimit);
        const clampedEnd = Math.min(pulseEnd, bloomLimit);
        ctx.strokeStyle = armAccent;
        traceArmSegment(baseAngle, clampedStart, clampedEnd, steps);
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prefersReducedMotion || animationFrameId === null) {
        renderFrame(prefersReducedMotion ? STATIC_TIMESTAMP : performance.now());
      }
    };

    const animate = (timestamp: number) => {
      if (!isVisible || !isDocumentVisible) {
        animationFrameId = null;
        return;
      }
      renderFrame(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const startAnimation = () => {
      if (prefersReducedMotion) {
        stopAnimation();
        renderFrame(STATIC_TIMESTAMP);
        return;
      }
      if (animationFrameId === null && isVisible && isDocumentVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    resize();
    startAnimation();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisible = entry.isIntersecting;
        if (isVisible) startAnimation();
        else stopAnimation();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible && isVisible) startAnimation();
      else stopAnimation();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      startAnimation();
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`nb-animated-spiral-container ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none', ...style }}
      />
    </div>
  );
}
