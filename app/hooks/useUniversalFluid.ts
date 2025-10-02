import { useMemo } from "react";

export const useUniversalFluid = () => {
  // Desktop fluid scaling: 1440px design → responsive
  const fs = useMemo(
    () => (
      designSize: number,
      baseVw = 1440,
      minVw = 768,
      minSizeRatio = 0.75,
      maxMultiplier = 1.5
    ) => {
      if (typeof designSize !== "number" || designSize <= 0) return "0px";

      const minSize = designSize * minSizeRatio;
      const maxSize = designSize * maxMultiplier;
      const vw = (designSize / baseVw) * 100;

      return `clamp(${minSize}px, ${vw}vw, ${maxSize}px)`;
    },
    []
  );

  // Mobile fluid scaling: 480px base design
  const fsm = useMemo(
    () => (
      size480: number, 
      ratio320 = 0.67, 
      ratio767 = 1.0, 
      minVw = 320, 
      maxVw = 767
    ) => {
      if (typeof size480 !== 'number' || size480 <= 0) return '0px';
      
      const size320 = size480 * ratio320;
      const size767 = size480 * ratio767;
      
      return `clamp(${size320}px, calc(${size320}px + ${size767 - size320} * ((100vw - ${minVw}px) / ${maxVw - minVw})), ${size767}px)`;
    },
    []
  );

  // Viewport-based scaling
  const fsVw = useMemo(
    () => (designSize: number, baseVw = 1440) => {
      if (typeof designSize !== 'number' || designSize <= 0) return '0vw';
      const vw = (designSize / baseVw) * 100;
      return `${vw}vw`;
    },
    []
  );

  // Fluid style helper
  const fluidStyle = useMemo(
    () =>
      ({
        w,
        h,
        p,
        m,
        fontSize,
        rounded,
        gap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      }: {
        w?: number | string;
        h?: number | string;
        p?: number | string;
        m?: number | string;
        fontSize?: number | string;
        rounded?: number | string;
        gap?: number | string;
        paddingTop?: number | string;
        paddingRight?: number | string;
        paddingBottom?: number | string;
        paddingLeft?: number | string;
        marginTop?: number | string;
        marginRight?: number | string;
        marginBottom?: number | string;
        marginLeft?: number | string;
      }) => {
        const styles: Record<string, string> = {};
        if (w !== undefined) styles.width = typeof w === 'number' ? fs(w) : w;
        if (h !== undefined) styles.height = typeof h === 'number' ? fs(h) : h;
        if (p !== undefined) styles.padding = typeof p === 'number' ? fs(p) : p;
        if (m !== undefined) styles.margin = typeof m === 'number' ? fs(m) : m;
        if (fontSize !== undefined) styles.fontSize = typeof fontSize === 'number' ? fs(fontSize) : fontSize;
        if (rounded !== undefined) styles.borderRadius = typeof rounded === 'number' ? fs(rounded) : rounded;
        if (gap !== undefined) styles.gap = typeof gap === 'number' ? fs(gap) : gap;
        if (paddingTop !== undefined) styles.paddingTop = typeof paddingTop === 'number' ? fs(paddingTop) : paddingTop;
        if (paddingRight !== undefined) styles.paddingRight = typeof paddingRight === 'number' ? fs(paddingRight) : paddingRight;
        if (paddingBottom !== undefined) styles.paddingBottom = typeof paddingBottom === 'number' ? fs(paddingBottom) : paddingBottom;
        if (paddingLeft !== undefined) styles.paddingLeft = typeof paddingLeft === 'number' ? fs(paddingLeft) : paddingLeft;
        if (marginTop !== undefined) styles.marginTop = typeof marginTop === 'number' ? fs(marginTop) : marginTop;
        if (marginRight !== undefined) styles.marginRight = typeof marginRight === 'number' ? fs(marginRight) : marginRight;
        if (marginBottom !== undefined) styles.marginBottom = typeof marginBottom === 'number' ? fs(marginBottom) : marginBottom;
        if (marginLeft !== undefined) styles.marginLeft = typeof marginLeft === 'number' ? fs(marginLeft) : marginLeft;
    
        return styles;
      },
    [fs]
  );

  // Fluid class helper
  const fluidClass = useMemo(
    () =>
      ({
        w,
        h,
        p,
        m,
        fontSize,
        rounded,
        gap,
      }: {
        w?: number | string;
        h?: number | string;
        p?: number | string;
        m?: number | string;
        fontSize?: number | string;
        rounded?: number | string;
        gap?: number | string;
      }) => {
        let classes = "";
        if (w !== undefined) classes += ` [width:${typeof w === 'number' ? fs(w) : w}]`;
        if (h !== undefined) classes += ` [height:${typeof h === 'number' ? fs(h) : h}]`;
        if (p !== undefined) classes += ` [padding:${typeof p === 'number' ? fs(p) : p}]`;
        if (m !== undefined) classes += ` [margin:${typeof m === 'number' ? fs(m) : m}]`;
        if (fontSize !== undefined) classes += ` [font-size:${typeof fontSize === 'number' ? fs(fontSize) : fontSize}]`;
        if (rounded !== undefined) classes += ` [border-radius:${typeof rounded === 'number' ? fs(rounded) : rounded}]`;
        if (gap !== undefined) classes += ` [gap:${typeof gap === 'number' ? fs(gap) : gap}]`;
        
        return classes.trim();
      },
    [fs]
  );

  return { fs, fsm, fsVw, fluidStyle, fluidClass };
};