import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {


  constructor() { }

  updateCharts({maxY, minY, duration,delay,  chartId}){


    Chart.helpers.each(Chart.instances,  (instance) => {
      if (instance.id !== chartId) {
        instance.options.scales.yAxes[0].ticks.max= maxY;
        instance.options.scales.yAxes[0].ticks.min= minY;

        //@ts-ignore
        instance.scales["x-axis-0"].options.realtime= {duration, delay};
        instance.update();
      }

  });
  }
}
