
declare namespace Chart {
  interface ZoomAndPan {
    enabled?: boolean;
    mode?: 'x' | 'y' | 'xy';
    rangeMax?: {
      x?: string | number;
      y?: string | number;
    },
    rangeMin?: {
      x?: string | number;
      y?: string | number;

    }
  }
  interface ChartOptions {
    pan?: ZoomAndPan
    zoom?: ZoomAndPan
  }
  interface CommonAxe {
    realtime?: {
      duration?: number
      ttl?: number,
      refresh?: number,
      delay?: number,
      frameRate?: number,
      pause?: boolean
      onRefresh?: Function
    }
  }
}
