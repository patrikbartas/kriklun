/*
  Pixelove ikony (Streamline). Zdrojove .svg maju farbu zapecatenu na cierno,
  tak ich nesieme ako cesty vo "currentColor" - inak by v tmavom mode zmizli.
  Mriezka je 32 x 32 a kreslime ju bez vyhladenia, nech ostane pixel pixelom.
*/

type Props = { size?: number; className?: string };

// Ikony su ozdoba. Meno nesie text pri nich alebo aria-label na odkaze.
function Pixel({
  size,
  className,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      height={size}
      shapeRendering="crispEdges"
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function CameraPixel({ size = 26, className }: Props) {
  return (
    <Pixel className={className} size={size}>
      <path d="M30.48 12.19H32v7.62h-1.52Z" />
      <path d="M28.96 19.81h1.52v3.05h-1.52Z" />
      <path d="M28.96 9.15h1.52v3.04h-1.52Z" />
      <path d="M27.43 22.86h1.53v3.05h-1.53Z" />
      <path d="M27.43 6.1h1.53v3.05h-1.53Z" />
      <path d="M25.91 25.91h1.52v1.52h-1.52Z" />
      <path d="M25.91 4.58h1.52V6.1h-1.52Z" />
      <path d="M24.39 12.19h1.52v10.67h-1.52Z" />
      <path d="M22.86 27.43h3.05v1.53h-3.05Z" />
      <path d="M22.86 3.05h3.05v1.53h-3.05Z" />
      <path d="M7.62 22.86h16.77v1.52H7.62Z" />
      <path d="M21.34 13.72h1.52v1.52h-1.52Z" />
      <path d="M19.81 28.96h3.05v1.52h-3.05Z" />
      <path d="M19.81 10.67h4.58v1.52h-4.58Z" />
      <path d="M19.81 1.53h3.05v1.52h-3.05Z" />
      <path d="m18.29 18.29 -1.52 0 0 -1.52 -1.53 0 0 -1.53 3.05 0 0 -1.52 -4.57 0 0 1.52 -1.52 0 0 4.57 1.52 0 0 1.53 4.57 0 0 -1.53 1.52 0 0 -4.57 -1.52 0 0 3.05z" />
      <path d="M18.29 9.15h1.52v1.52h-1.52Z" />
      <path d="M12.2 30.48h7.61V32H12.2Z" />
      <path d="M13.72 7.62h4.57v1.53h-4.57Z" />
      <path d="M12.2 0h7.61v1.53H12.2Z" />
      <path d="M12.2 9.15h1.52v1.52H12.2Z" />
      <path d="M9.15 28.96h3.05v1.52H9.15Z" />
      <path d="M9.15 1.53h3.05v1.52H9.15Z" />
      <path d="M7.62 10.67h4.58v1.52H7.62Z" />
      <path d="M6.1 27.43h3.05v1.53H6.1Z" />
      <path d="M6.1 3.05h3.05v1.53H6.1Z" />
      <path d="M6.1 12.19h1.52v10.67H6.1Z" />
      <path d="M4.58 25.91H6.1v1.52H4.58Z" />
      <path d="M4.58 4.58H6.1V6.1H4.58Z" />
      <path d="M3.05 22.86h1.53v3.05H3.05Z" />
      <path d="M3.05 6.1h1.53v3.05H3.05Z" />
      <path d="M1.53 19.81h1.52v3.05H1.53Z" />
      <path d="M1.53 9.15h1.52v3.04H1.53Z" />
      <path d="M0 12.19h1.53v7.62H0Z" />
    </Pixel>
  );
}

export function MePixel({ size = 22, className }: Props) {
  return (
    <Pixel className={className} size={size}>
      <path d="M30.475 12.19h-1.52v3.05h-1.53v-1.52h-1.52v-1.53h3.05v-1.52h-3.05V9.14h-1.52v6.1h-1.53v1.52H9.145v-1.52h-1.53v-6.1H6.1v1.53H3.045v1.52H6.1v1.53H4.575v1.52h-1.53v-3.05h-1.52v4.57h1.52v1.53H6.1v10.66h1.52v1.53h1.53V32h13.71v-1.52h1.53v-1.53h1.52V18.29h3.05v-1.53h1.52Zm-6.09 9.15H7.615v-1.53h16.77Z" />
      <path d="M22.855 7.62h1.53v1.52h-1.53Z" />
      <path d="M22.855 1.53h1.53v3.04h-1.53Z" />
      <path d="M21.335 4.57h1.52v3.05h-1.52Z" />
      <path d="M19.805 0h3.05v1.53h-3.05Z" />
      <path d="M19.805 10.67h1.53v1.52h-1.53Z" />
      <path d="M18.285 1.53h1.52v3.04h-1.52Z" />
      <path d="M16.765 4.57h1.52V6.1h-1.52Z" />
      <path d="m15.235 15.24 1.53 0 0 -1.52 1.52 0 0 -1.53 -4.57 0 0 1.53 1.52 0 0 1.52z" />
      <path d="M15.235 6.1h1.53v1.52h-1.53Z" />
      <path d="M13.715 4.57h1.52V6.1h-1.52Z" />
      <path d="M12.185 1.53h1.53v3.04h-1.53Z" />
      <path d="M10.665 10.67h1.52v1.52h-1.52Z" />
      <path d="M9.145 0h3.04v1.53h-3.04Z" />
      <path d="M9.145 4.57h1.52v3.05h-1.52Z" />
      <path d="M7.615 7.62h1.53v1.52h-1.53Z" />
      <path d="M7.615 1.53h1.53v3.04h-1.53Z" />
    </Pixel>
  );
}

export function WrenchPixel({ size = 22, className }: Props) {
  return (
    <Pixel className={className} size={size}>
      <path d="m30.48 25.9 -1.53 0 0 1.53 3.05 0 0 -6.1 -1.52 0 0 4.57z" />
      <path d="M28.95 19.81h1.53v1.52h-1.53Z" />
      <path d="M27.43 24.38h1.52v1.52h-1.52Z" />
      <path d="m22.86 22.86 0 4.57 1.52 0 0 1.52 1.53 0 0 1.53 -4.57 0 0 1.52 6.09 0 0 -4.57 -1.52 0 0 -3.05 1.52 0 0 -1.52 -4.57 0z" />
      <path d="M19.81 28.95h1.53v1.53h-1.53Z" />
      <path d="M19.81 19.81h1.53v1.52h-1.53Z" />
      <path d="M18.29 22.86h1.52v6.09h-1.52Z" />
      <path d="M18.29 18.28h1.52v1.53h-1.52Z" />
      <path d="M16.76 21.33h1.53v1.53h-1.53Z" />
      <path d="M16.76 16.76h1.53v1.52h-1.53Z" />
      <path d="M15.24 19.81h1.52v1.52h-1.52Z" />
      <path d="M15.24 15.24h1.52v1.52h-1.52Z" />
      <path d="M13.72 18.28h1.52v1.53h-1.52Z" />
      <path d="M13.72 13.71h1.52v1.53h-1.52Z" />
      <path d="M12.19 16.76h1.53v1.52h-1.53Z" />
      <path d="M12.19 12.19h1.53v1.52h-1.53Z" />
      <path d="M10.67 15.24h1.52v1.52h-1.52Z" />
      <path d="M10.67 10.67h1.52v1.52h-1.52Z" />
      <path d="M9.15 13.71h1.52v1.53H9.15Z" />
      <path d="M3.05 12.19h6.1v1.52h-6.1Z" />
      <path d="M6.1 3.05h1.52v1.52H6.1Z" />
      <path d="m10.67 1.52 0 1.53 1.52 0 0 6.09 1.53 0 0 1.53 1.52 0 0 1.52 1.52 0 0 1.52 1.53 0 0 1.53 1.52 0 0 1.52 1.53 0 0 1.52 1.52 0 0 1.53 6.09 0 0 -1.53 -4.57 0 0 -1.52 -1.52 0 0 -1.52 -1.52 0 0 -1.53 -1.53 0 0 -1.52 -1.52 0 0 -1.52 -1.53 0 0 -1.53 -1.52 0 0 -6.09 -1.52 0 0 -1.53 -1.53 0 0 -1.52 -7.62 0 0 3.05 1.53 0 0 -1.53 4.57 0z" />
      <path d="M1.53 10.67h1.52v1.52H1.53Z" />
      <path d="m1.53 6.09 1.52 0 0 1.53 1.52 0 0 1.52 4.58 0 0 -4.57 -1.53 0 0 3.05 -1.52 0 0 -1.53 -1.53 0 0 -1.52 -4.57 0 0 6.1 1.53 0 0 -4.58z" />
    </Pixel>
  );
}
