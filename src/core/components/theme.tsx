import React from 'react';
import {
  ThemeProvider as EmotionThemeProvider,
  Global,
  Interpolation,
  css,
  useTheme,
} from '@emotion/react';
import tc, { ColorInput, Instance } from 'tinycolor2';

export interface ThemeData {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  transition: Record<string, string>;
  borderRadius: Record<string, string>;
}

export function enumerateColors(baseName: string, colors: string[]): Record<string, string> {
  const colorsRecord: Record<string, string> = {};
  for (let i = 0; i < colors.length; i += 1) {
    colorsRecord[`${baseName}-${i + 1}`] = colors[i];
  }
  return colorsRecord;
}

export function enumerateLightness(baseName: string, color: string): Record<string, string> {
  const colorsRecord: Record<string, string> = { [baseName]: color };
  const { h, s } = tc(color).toHsl();
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((pt) => {
    colorsRecord[`${baseName}-${pt}`] = tc({
      h,
      s,
      l: (1000 - pt) / 1000,
    }).toHslString();
  });
  return colorsRecord;
}

export function enumerateLightnessAndTransparency(
  baseName: string,
  color: string
): Record<string, string> {
  const colorsRecord = enumerateLightness(baseName, color);
  const c = tc(color);
  for (let i = 10; i < 100; i += 10) {
    colorsRecord[`${baseName}-t${i}`] = c.setAlpha(i / 100).toString();
  }
  return colorsRecord;
}

export function primaryColors(colors: Record<string, string>) {
  let record: Record<string, string> = {};

  Object.keys(colors).forEach((name) => {
    record = {
      ...record,
      ...enumerateLightnessAndTransparency(name, colors[name]),
      [`on-${name}`]: tc(colors[name]).isLight() ? '#000' : '#fff',
    };
  });

  return record;
}

export const defaultTheme: ThemeData = {
  colors: {
    ...enumerateColors('neutral', [
      '#000',
      '#1a1a1a',
      '#3f3f3f',
      '#818181',
      '#a1a1a1',
      '#c0c0c0',
      '#d8d8d8',
      '#eee',
      '#fafafa',
      '#ffffff',
    ]),
    ...primaryColors({
      primary: '#166dd6',
      secondary: '#2e2e2f',
      success: '#22ac00',
      danger: '#ff0121',
      warning: '#ecb500',
    }),
    background: '#F7F8FC',
    paper: '#fff',
    fog: 'rgba(255, 255, 255, .3)',
    highlight: 'rgba(0, 0, 0, .05)',
    color: '#111',
    'color-2': '#444',
    'color-3': '#545454',
  },
  fonts: {
    main: 'Roboto',
    logo: '"Abril Fatface"',
    headers: '"Jost", Ubuntu, sans-serif',
    button: 'Inter',
  },
  transition: {
    xs: '.1s',
    sm: '.2s',
    md: '.3s',
    lg: '.8s',
    xl: '1.4s',
  },
  spacing: {
    xl: '2em',
    lg: '1.1em',
    md: '.8em',
    sm: '.3em',
    xs: '.15em',
  },
  borderRadius: {
    xl: '3em',
    lg: '1.3em',
    md: '.6em',
    sm: '.3em',
    xs: '.13em',
  },
};

interface ThemeProviderProps {
  theme?: ThemeData;
  children?: React.ReactNode;
}

const globalCSS = css`
  body {
    background-color: var(--t-background);
    font-family: var(--t-font-main);
    margin: 0;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;

export function DefaultCSS() {
  const theme = useTheme() as ThemeData;
  const rules: Interpolation<ThemeData> = {};

  for (const [name, v] of Object.entries(theme.colors ?? {})) {
    rules[`--t-${name}`] = v;
  }
  for (const [name, v] of Object.entries(theme.fonts ?? {})) {
    rules[`--t-font-${name}`] = v;
  }
  for (const [name, v] of Object.entries(theme.transition ?? {})) {
    rules[`--t-transition-${name}`] = v;
  }
  for (const [name, v] of Object.entries(theme.borderRadius ?? {})) {
    rules[`--t-radius-${name}`] = v;
  }
  for (const [name, v] of Object.entries(theme.spacing ?? {})) {
    rules[`--t-spacing-${name}`] = v;
  }

  return <Global styles={[{ ':root': rules }, globalCSS]} />;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <EmotionThemeProvider theme={theme ?? defaultTheme}>
      <DefaultCSS />
      {children}
    </EmotionThemeProvider>
  );
}

export function useThemePath<T>(path: string): T {
  const parts = path.split('.');
  let result = useTheme();
  try {
    for (const part of parts) {
      result = result[part];
    }
  } catch {
    result = undefined;
  }
  return result as T;
}

export function useNamedColor(name: string, defaultValue?: ColorInput): Instance | undefined {
  const value = useThemePath<ColorInput>(`colors.${name}`);
  if (value) return tc(value);
  if (defaultValue) return tc(defaultValue);
  return undefined;
}

export function useColor(color: ColorInput | undefined): Instance | undefined {
  if (typeof color === 'undefined') return undefined;
  if (typeof color === 'string') {
    return useNamedColor(color, color);
  }
  return tc(color);
}

export type VariantFunction<Props> = (props: Props) => Interpolation<ThemeData>;

export function useVariant<Props>(
  component: string,
  variant: string
): VariantFunction<Props> | undefined {
  return useThemePath(`components.${component}.${variant}`);
}

export function cssVar(type: string, bp: string) {
  if (['xl', 'lg', 'md', 'sm', 'xs'].includes(bp)) {
    return `var(--t-${type}-${bp})`;
  }
  return bp;
}
