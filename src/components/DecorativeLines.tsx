const COLOR = '#91A0C6';
const STROKE_WIDTH = 5;

export function ToothFlourish({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main heart/tooth outer shape */}
      <path
        d="M100 30 C100 30, 70 8, 48 28 C20 54, 45 95, 100 165 C155 95, 180 54, 152 28 C130 8, 100 30, 100 30Z"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner teardrop loop */}
      <path
        d="M100 18 C92 50, 85 75, 100 100 C115 75, 108 50, 100 18Z"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Left flowing swoosh */}
      <path
        d="M48 55 C28 68, 8 95, 2 120"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
      {/* Right flowing swoosh */}
      <path
        d="M152 55 C172 68, 192 95, 198 120"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function FlowingWave({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 60 C60 20, 120 100, 180 60 C240 20, 300 100, 360 60 C420 20, 460 80, 500 60"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0 75 C60 35, 120 115, 180 75 C240 35, 300 115, 360 75 C420 35, 460 95, 500 75"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH - 1.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function SpiralAccent({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70 15 C95 15, 120 38, 120 65 C120 95, 95 120, 70 120 C42 120, 22 95, 22 70 C22 48, 40 30, 60 30 C78 30, 90 44, 90 60 C90 76, 78 88, 65 88 C52 88, 45 78, 45 68 C45 58, 52 52, 60 52"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function InfinityLoop({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M150 50 C150 20, 190 10, 220 20 C260 35, 270 65, 240 80 C210 95, 170 70, 150 50 C130 30, 90 5, 60 20 C30 35, 40 75, 70 85 C100 95, 140 70, 150 50Z"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PetalCurl({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main petal curve */}
      <path
        d="M80 20 C40 20, 15 50, 15 85 C15 120, 45 145, 80 145 C115 145, 145 120, 145 85 C145 60, 125 40, 105 40"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner curl */}
      <path
        d="M105 40 C85 40, 55 55, 55 80 C55 100, 70 110, 85 110 C100 110, 110 98, 110 85"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
      {/* Top tendril */}
      <path
        d="M80 20 C80 5, 95 0, 105 10"
        stroke={COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
