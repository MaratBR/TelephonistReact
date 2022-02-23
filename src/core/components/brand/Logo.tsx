import LogoSVG from 'assets/logo.svg';

function Logo({ scale }: { scale?: number }) {
  return <LogoSVG scale={scale ?? 0.1} />;
}

export default Logo;
