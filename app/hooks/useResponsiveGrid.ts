import { useMemo } from "react";

/**
 * fs function for responsive size calculation
 * @param maxSize - Size at 1440px
 * @param ratio - Scaling ratio (default 0.75)
 */
export const fs = (maxSize: number, ratio = 0.75): string => {
  const minVw = 768;
  const baseVw = 1440;
  const minSize = maxSize * ratio;

  return `calc(${minSize}px + ${maxSize - minSize} * ((100vw - ${minVw}px) / ${baseVw - minVw}))`;
};

/**
 * fsm function for mobile size calculation
 * @param size360 - Size at 360px
 * @param ratio320 - Ratio at 320px (default 0.89)
 * @param ratio767 - Ratio at 767px (default 1.7)
 */
export const fsm = (size360: number, ratio320 = 0.89, ratio767 = 1.7): string => {
  const minVw = 320;
  const maxVw = 767;
  const size320 = size360 * ratio320;
  const size767 = size360 * ratio767;

  return `calc(${size320}px + ${size767 - size320} * ((100vw - ${minVw}px) / ${maxVw - minVw}))`;
};

/**
 * fsVw function for viewport-based size
 * @param designSize - Design size at 1440px
 */
export const fsVw = (designSize: number): string => {
  const vwValue = (designSize / 1440) * 100;
  return `${vwValue}vw`;
};

/**
 * Hook to generate responsive grid styles
 */
export const useResponsiveGrid = () => {
  /**
   * Generate grid template
   * @param columns - Array of column sizes
   * @param rows - Array of row sizes
   * @param gap - Gap size
   * @param isMobile - Whether to use mobile sizing
   */
  const createGridTemplate = useMemo(() => {
    return (columns: number[], rows: number[], gap: number, isMobile = false) => {
      const generateSize = isMobile ? fsm : fs;

      return {
        display: "grid",
        gridTemplateColumns: columns.map((col) => generateSize(col)).join(" "),
        gridTemplateRows: rows.map((row) => generateSize(row)).join(" "),
        gap: generateSize(gap),
      };
    };
  }, []);

  /**
   * Generate grid item placement
   * @param column - Column position (1-based)
   * @param row - Row position (1-based)
   * @param columnSpan - Number of columns to span
   * @param rowSpan - Number of rows to span
   */
  const createGridItem = useMemo(() => {
    return (column: number, row: number, columnSpan = 1, rowSpan = 1, zIndex?: number) => {
      return {
        gridColumn: `${column} / span ${columnSpan}`,
        gridRow: `${row} / span ${rowSpan}`,
        ...(zIndex !== undefined && { zIndex }),
      };
    };
  }, []);

  /**
   * Simplified grid definition
   * Example: grid('48 200 500', '100 500', 20)
   */
  const grid = useMemo(() => {
    return (columns: string, rows: string, gap = 16, isMobile = false) => {
      const colSizes = columns.split(" ").map(Number);
      const rowSizes = rows.split(" ").map(Number);
      return createGridTemplate(colSizes, rowSizes, gap, isMobile);
    };
  }, [createGridTemplate]);

  /**
   * Simplified item placement
   * Example: item(1, 1, 2, 1, 10)
   */
  const item = useMemo(() => {
    return createGridItem;
  }, [createGridItem]);

  return {
    fs,
    fsm,
    fsVw,
    createGridTemplate,
    createGridItem,
    grid,
    item,
  };
};