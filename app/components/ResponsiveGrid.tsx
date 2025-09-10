// app/components/ResponsiveGrid.tsx
import React, { useEffect, useState } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';

interface GridProps {
  columns: string; // e.g., "1fr 1fr" or "150 300 150"
  rows: string; // e.g., "auto" or "80 200 80"
  gap?: number;
  isMobile?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const ResponsiveGrid: React.FC<GridProps> = ({
  columns,
  rows,
  gap = 16,
  isMobile = false,
  className = '',
  children,
  style = {},
}) => {
  const [isClient, setIsClient] = useState(false);
  const { fs, fluidStyle } = useUniversalFluid();

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  const gridStyles = isClient
    ? {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : columns,
        gridTemplateRows: rows,
        ...fluidStyle({ gap }), // Use fluidStyle for responsive gap
      }
    : {
        display: 'grid',
        gridTemplateColumns: '1fr', // Fallback for SSR
        gridTemplateRows: rows,
        gap: fs(gap), // Static fallback for SSR
      };

  return (
    <div
      className={className}
      style={{
        ...gridStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface GridItemProps {
  column: number;
  row: number;
  columnSpan?: number;
  rowSpan?: number;
  zIndex?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * グリッドアイテムコンポーネント
 * 使用例:
 * <GridItem column={1} row={1} columnSpan={2} zIndex={10}>
 *   コンテンツ
 * </GridItem>
 */
export const GridItem: React.FC<GridItemProps> = ({
  column,
  row,
  columnSpan = 1,
  rowSpan = 1,
  zIndex,
  className = '',
  children,
  style = {},
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  const itemStyles = isClient
    ? {
        gridColumn: `span ${columnSpan} / span ${columnSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        zIndex: zIndex ?? undefined,
      }
    : {
        gridColumn: `span ${columnSpan} / span ${columnSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        zIndex: zIndex ?? undefined,
      };

  return (
    <div
      className={className}
      style={{
        ...itemStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};