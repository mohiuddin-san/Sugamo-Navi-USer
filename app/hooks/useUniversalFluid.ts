import { useMemo } from "react";

export const useUniversalFluid = () => {
  // fs → Desktop → Tablet scaling (responsive, aligned with Figma 480px to 1440px)
const fs = useMemo(
  () => (
    designSize: number,
    baseVw = 1440,
    minVw = 320,
    minSizeRatio = 0.33,
    maxMultiplier = 2 // কতটা বড় হতে পারবে (design size এর কত গুণ)
  ) => {
    if (typeof designSize !== "number" || designSize <= 0) return "0px";

    const minSize = designSize * minSizeRatio;
    const vw = (designSize / baseVw) * 100;

    // এখন clamp এ max bound designSize নয়, বরং একটা বড় cap
    return `clamp(${minSize}px, ${vw}vw, ${designSize * maxMultiplier}px)`;
  },
  []
);



  // fsm → Mobile → Small Tablet (480px base, aligned with Figma 480px max)
  const fsm = useMemo(
    () => (size480: number, ratio320 = 0.67, ratio480 = 1.0, minVw = 320, maxVw = 480) => {
      if (typeof size480 !== 'number' || size480 <= 0) return '0px';
      const size320 = size480 * ratio320; // downscale for very small devices
      const sizeAtMaxVw = size480 * ratio480; // Size at 480px (should be 100% of input)
      const result = `clamp(${size320}px, calc(${size320}px + ${(sizeAtMaxVw - size320)} * ((100vw - ${minVw}px) / ${maxVw - minVw})), ${sizeAtMaxVw}px)`;

      return result;
    },
    []
  );

  // fsVw → Viewport-based scaling
  const fsVw = useMemo(
    () => (designSize: number, baseVw = 1440) => {
      if (typeof designSize !== 'number' || designSize <= 0) return '0vw';
      const vw = (designSize / baseVw) * 100;
      const result = `${vw}vw`;

      return result;
    },
    []
  );

  // Generate inline style for fluid elements
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

  // Generate Tailwind-like className dynamically
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
        let classes = "";
        if (w !== undefined) classes += ` [width:${typeof w === 'number' ? fs(w) : w}]`;
        if (h !== undefined) classes += ` [height:${typeof h === 'number' ? fs(h) : h}]`;
        if (p !== undefined) classes += ` [padding:${typeof p === 'number' ? fs(p) : p}]`;
        if (m !== undefined) classes += ` [margin:${typeof m === 'number' ? fs(m) : m}]`;
        if (fontSize !== undefined) classes += ` [font-size:${typeof fontSize === 'number' ? fs(fontSize) : fontSize}]`;
        if (rounded !== undefined) classes += ` [border-radius:${typeof rounded === 'number' ? fs(rounded) : rounded}]`;
        if (gap !== undefined) classes += ` [gap:${typeof gap === 'number' ? fs(gap) : gap}]`;
        if (paddingTop !== undefined) classes += ` [padding-top:${typeof paddingTop === 'number' ? fs(paddingTop) : paddingTop}]`;
        if (paddingRight !== undefined) classes += ` [padding-right:${typeof paddingRight === 'number' ? fs(paddingRight) : paddingRight}]`;
        if (paddingBottom !== undefined) classes += ` [padding-bottom:${typeof paddingBottom === 'number' ? fs(paddingBottom) : paddingBottom}]`;
        if (paddingLeft !== undefined) classes += ` [padding-left:${typeof paddingLeft === 'number' ? fs(paddingLeft) : paddingLeft}]`;
        if (marginTop !== undefined) classes += ` [margin-top:${typeof marginTop === 'number' ? fs(marginTop) : marginTop}]`;
        if (marginRight !== undefined) classes += ` [margin-right:${typeof marginRight === 'number' ? fs(marginRight) : marginRight}]`;
        if (marginBottom !== undefined) classes += ` [margin-bottom:${typeof marginBottom === 'number' ? fs(marginBottom) : marginBottom}]`;
        if (marginLeft !== undefined) classes += ` [margin-left:${typeof marginLeft === 'number' ? fs(marginLeft) : marginLeft}]`;
        const result = classes.trim();

        return result;
      },
    [fs]
  );

  return { fs, fsm, fsVw, fluidStyle, fluidClass };
};