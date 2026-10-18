// Lightweight high-fidelity SVG QR & Barcode generator utility for security tags

export function generateBarcodeSvg(code: string, width = 240, height = 60): string {
  // Deterministic 1D barcode pattern generation based on string hash
  const bars: boolean[] = [true, false, true]; // start guard
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = (charCode * 7919) % 256;
    for (let b = 0; b < 7; b++) {
      bars.push(((pattern >> b) & 1) === 1);
    }
    bars.push(false);
  }
  bars.push(true, false, true); // stop guard

  const barWidth = width / bars.length;
  const rects = bars
    .map((isBlack, idx) =>
      isBlack
        ? `<rect x="${(idx * barWidth).toFixed(1)}" y="0" width="${barWidth.toFixed(1)}" height="${height - 14}" fill="currentColor" />`
        : ''
    )
    .filter(Boolean)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto text-slate-900 dark:text-slate-100">
    ${rects}
    <text x="${width / 2}" y="${height - 2}" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle" fill="currentColor" letter-spacing="2">${code}</text>
  </svg>`;
}

export function generateQrMatrix(data: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw QR finder pattern (7x7 square)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  // Top-left, top-right, bottom-left finder patterns
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic data encoding based on string characters
  let seed = 0;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 31 + data.charCodeAt(i)) & 0xffffffff;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Avoid finder areas
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTL && !inTR && !inBL && !inTiming) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        matrix[r][c] = (seed % 3) === 0;
      }
    }
  }

  return matrix;
}
