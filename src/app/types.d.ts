
declare namespace Chart {

  interface ChartPluginsOptions {
    crosshair?: CrossHairPlugin
    zoom?: any
  }
  interface CrossHairPlugin {
    line?: {
      color: ChartColor,  // crosshair line color
      width: number       // crosshair line width
    },
    sync?: {
      enabled: boolean,            // enable trace line syncing with other charts
      group: number,                 // chart group
      suppressTooltips: boolean   // suppress tooltips when showing a synced tracer
    },
    zoom?: {
      enabled: boolean,
      zoomboxBackgroundColor: ChartColor,
      zoomboxBorderColor: ChartColor,
      zoomButtonText: string,
      zoomButtonClass: string,
    },
    snap?: {
      enabled: boolean,
    },
    callbacks?: {
      beforeZoom?: (start: any, end: any) => boolean
      afterZoom?: (start: any, end: any) => boolean
    }
  }
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
