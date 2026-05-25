'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export function BeforeAfterSlider({
  beforeSrc = '/before.png',
  afterSrc = '/after.png',
  beforeAlt = 'Antes',
  afterAlt = 'Después',
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const update = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const onUp = () => setDragging(false);
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      update(clientX);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchmove', onMove as EventListener);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
    };
  }, [dragging]);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { setDragging(true); update(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); update(e.touches[0].clientX); }}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        aspectRatio: '16/9',
        overflow: 'hidden',
        cursor: 'ew-resize',
        userSelect: 'none',
        background: 'var(--lav-light)',
        borderRadius: '2px',
      }}
    >
      {/* BEFORE (bottom layer) */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src={beforeSrc} alt={beforeAlt} fill style={{ objectFit: 'cover' }} />
      </div>

      {/* AFTER (clipped top layer) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      >
        <Image src={afterSrc} alt={afterAlt} fill style={{ objectFit: 'cover' }} />
      </div>

      {/* Labels */}
      <span style={{
        position: 'absolute',
        top: '1.25rem',
        left: '1.25rem',
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '0.35rem 0.75rem',
        background: 'rgba(26,31,58,0.7)',
        color: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(4px)',
        borderRadius: '2px',
        fontFamily: 'var(--sans)',
        pointerEvents: 'none',
      }}>
        Antes
      </span>
      <span style={{
        position: 'absolute',
        top: '1.25rem',
        right: '1.25rem',
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '0.35rem 0.75rem',
        background: 'rgba(26,31,58,0.7)',
        color: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(4px)',
        borderRadius: '2px',
        fontFamily: 'var(--sans)',
        pointerEvents: 'none',
      }}>
        Después
      </span>

      {/* Divider + Handle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: '2px',
          background: 'var(--white)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          background: 'var(--white)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}>
          {/* Arrow icons */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <div style={{
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '6px solid var(--navy)',
            }} />
            <div style={{
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '6px solid var(--navy)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
