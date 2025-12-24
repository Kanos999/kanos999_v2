import type { CSSProperties, JSX } from 'react';

export interface BackgroundProps {
  fps?: number;
  resolution?: number;
  chars?: string;
  className?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  overlayStyle?: CSSProperties;
  showOverlay?: boolean;
}

export default function Background(props: BackgroundProps): JSX.Element;
