import { useColor } from '@coreui/theme';
import S from './Dot.module.css';
import { ColorInput } from 'tinycolor2';

interface DotProps {
  color?: ColorInput;
}

export default function Dot({ color }: DotProps) {
  const c = useColor(color ?? 'primary');
  return <span className={S.dot} style={{ backgroundColor: c.toString() }} />;
}
