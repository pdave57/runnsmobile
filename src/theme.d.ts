import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primaryBlue: string;
      primaryRed: string;
      textDark: string;
      textLight: string;
      background: string;
      border: string;
      primary: string;
    };
    radii: {
      sm: number;
      md: number;
      lg: number;
    };
    space: number[];
  }
}