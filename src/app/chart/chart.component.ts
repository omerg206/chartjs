import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChartType, Chart, ChartDataSets, ScaleType } from 'chart.js';
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-streaming';
// import './chart-plugins/chartjs-plugin-crosshair';
// import './chart-plugins/streaming/chartjs-plugin-streaming.min';

import { ChartJsSingleGraphData } from '../app.component';
import { forEach } from 'lodash';
import { ChartsService } from '../charts.service';


const defaultDataSetOptions: Pick<ChartDataSets, "hoverBorderWidth" | "borderJoinStyle" | "label"> = {
  hoverBorderWidth: 2,
  borderJoinStyle: 'round',
  label: "Dataset"
}

const COLORS: Pick<ChartDataSets, 'backgroundColor' | "hoverBackgroundColor" | "borderColor" | "hoverBorderColor">[] = [{
  backgroundColor: "rgba(54, 162, 235,0.9)",
  hoverBackgroundColor: "rgba(54, 162, 235, 1)",
  borderColor: "rgba(54, 162, 235,0.9)",
  hoverBorderColor: "yellow",
},
{
  backgroundColor: "rgba(75, 192, 192, 0.8)",
  hoverBackgroundColor: "rgba(75, 192, 192, 1)",
  borderColor: "rgba(75, 192, 192, 0.8)",
  hoverBorderColor: "red",
},
{
  backgroundColor: "rgba(204, 102, 153, 0.8)",
  hoverBackgroundColor: "rgba(204, 102, 153, 1)",
  borderColor: "rgba(204, 102, 153, 0.8)",
  hoverBorderColor: "brown",
}]



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  ctx: CanvasRenderingContext2D | null = null;
  myChart: Chart | null = null;
  config: Chart.ChartConfiguration | null = null;

  @Input() isSyncGraphs: boolean


  @Input() set isPause(val: boolean) {
    if (this.myChart) {
      this.myChart.options.scales.xAxes[0].realtime.pause = val;
      this.myChart.update();
    }
  }

  @Input() set isZoomBox(val: boolean) {
    if (this.myChart) {
      if (val) {
        this.myChart.options.plugins.zoom.pan.enabled = false;
        this.myChart.options.plugins.zoom.zoom.drag = {
              borderColor: 'rgba(225,225,225,0.3)',
              borderWidth: 5,
              backgroundColor: 'rgb(225,225,225)',
              animationDuration: 0
            };
      } else {
        this.myChart.options.plugins.zoom.pan.enabled = true;
        this.myChart.options.plugins.zoom.zoom.drag = false;
      }
    }
  }


  @Input() set chartType(val: ChartType) {
    if (this.myChart) {
      this.changeGraphType(val)
    }
  }

  @Input() title: string | null = null;
  @Input() graphIdx: number;



  @Input() data: ChartJsSingleGraphData;

  @ViewChild('graph', { static: true, read: ElementRef }) graph!: ElementRef;



  constructor(private cd: ChangeDetectorRef, private chartsService: ChartsService) { }


  ngOnInit(): void {
    this.cd.detach();
    this.cd.checkNoChanges();

    // setTimeout(() => {
    //   // this.myChart.options.scales.yAxes[0].ticks.suggestedMax= 300;
    //   // this.myChart.options.scales.yAxes[0].ticks.suggestedMin= 0;
    //   // this.myChart.options.scales.xAxes[0].ticks.max= 300;
    //   // this.myChart.options.scales.xAxes[0].ticks.min= 0;
    //   //@ts-ignore
    //   this.myChart.scales["x-axis-0"]._table[0].time = 5000;
    //   //@ts-ignore
    //   this.myChart.scales["x-axis-0"].ticks = ["11:50:45", "11:51 am"];
    //   //@ts-ignore
    //   this.myChart.scales["x-axis-0"]._table[1].time = 10000;
    //   //@ts-ignore
    //   console.log(this.myChart, this.myChart.scales["x-axis-0"]._table[1].time)
    //   this.myChart.update();
    // }, 3000)

    // setInterval(() => {
    //   // this.myChart.options.scales.yAxes[0].ticks.suggestedMax= 300;
    //   // this.myChart.options.scales.yAxes[0].ticks.suggestedMin= 0;
    //   this.myChart.options.scales.yAxes[0].ticks.max= undefined;
    //   this.myChart.options.scales.yAxes[0].ticks.min= undefined;
    //   this.myChart.update();
    // }, 6000)
  }

  ngAfterViewInit(): void {
    if (!this.myChart) {
      this.initChart();
    }

    // setTimeout(() => {
    //   this.myChart.options.scales.xAxes[0].realtime.pause = true;
    //   this.myChart.options.plugins.crosshair.zoom.enable =true;

    // }, 3000)
  }


  initChart() {
    this.ctx = this.graph.nativeElement.getContext('2d');
    this.config = {
      type: 'bar',
      data: {
        datasets: [

        ]
      },
      options: {
        elements: {
          line: {
            fill: false
          }
        },
        legend: {
          fullWidth: false,
          labels: {
            boxWidth: 10
          },
          position: 'left'
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.title,
          position: 'left'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 0 // general animation time
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0,// animation duration after a resize

        scales: {

          xAxes: [{
            stacked: true,
            display: true,
            offset: true,

            // distribution: 'series',
            type: "realtime",
            realtime: {
              duration: 60000,
              // ttl: 70000,
              // refresh: 3500,
              //  delay: 2000,
              //  frameRate: 1,
              onRefresh: (e) => {
                this.updateDate(this.data)
                this.data = null;
              }

            },
            time: {
              unit: 'second',
              // round: 'second',
              stepSize: 15,
              unitStepSize: 15,
              displayFormats: {
                second: "HH:mm:ss"
              },
              // parser: "ss",
              scaleLabel: {
                display: true,
                labelString: "Date"
              },
              ticks: {
                // autoSkip: true,
                // maxRotation: 0,
                // minRotation: 0
              }

            }
          }],
          yAxes: [{
            stacked: true,
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'value'
            },
            ticks: {
              suggestedMax: 100,
              suggestedMin: 0,
              // beginAtZero: true
            }

          }]
        },
        plugins: {
          // crosshair: {
          //   line: {
          //     color: 'rgba(0,0,0,0)',  // crosshair line color
          //     width: 0        // crosshair line width
          //   },
          //   sync: {
          //     enabled: true,            // enable trace line syncing with other charts
          //     group: this.graphIdx,                 // chart group
          //     suppressTooltips: false   // suppress tooltips when showing a synced tracer
          //   }
          // },
          zoom: {
            // Container for pan options
            pan: {
              // Boolean to enable panning
              enabled: true,

              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              mode: 'xy',
              rangeMax: {
                x: 60000,
              },
              rangeMin: {
                x: 1000,
              },
              onPan: () => this.onPanAndZoomSyncAllGraphs()
            },

            // Container for zoom options
            zoom: {
              // Boolean to enable zooming
              enabled: true,
              // drag: {
              //   // Drag-to-zoom effect can be customized
              //   drag: {
              //     borderColor: 'rgba(225,225,225,0.3)',
              //     borderWidth: 5,
              //     backgroundColor: 'rgb(225,225,225)',
              //     animationDuration: 0
              //   }
              // },

              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: 'xy',
              rangeMax: {
                x: 60000,
              },
              rangeMin: {
                x: 1000,
              },
              threshold: 10,
              onZoom: () => this.onPanAndZoomSyncAllGraphs()
            }
          }
        }
      }
    }

    this.myChart = new Chart(this.ctx, this.config);
  }


  changeGraphType(type: ChartType) {
    if (this.myChart) {
      const data = this.myChart.data;
      const options = this.myChart.options
      this.myChart.destroy();
      this.myChart = new Chart(this.ctx, { ...this.config, type, data, options });
    }
  }

  onPanAndZoomSyncAllGraphs() {
    if (this.isSyncGraphs) {
      //@ts-ignore
      const { max: maxY, min: minY } = this.myChart.scales['y-axis-0'];
      //@ts-ignore
      const { duration, delay } = this.myChart.scales['x-axis-0'].options.realtime;

      //@ts-ignore;
      this.chartsService.updateCharts({ maxY, minY, duration, delay, chartId: this.myChart.id });
    }
  }



  resetZoom() {
    this.myChart.options.scales.yAxes[0].ticks.max = undefined;
    this.myChart.options.scales.yAxes[0].ticks.min = undefined;

    (this.myChart as any).resetZoom();

    // this.myChart.update({ duration: 0, lazy: true });
  }


  updateDate(data: ChartJsSingleGraphData) {
    let dataSetIdx = 0;
    forEach(data, (ele: Chart.ChartPoint[], key: string) => {
      if (!this.myChart.data.datasets[dataSetIdx]) {
        this.myChart.data.datasets[dataSetIdx] = { ...COLORS[dataSetIdx], ...defaultDataSetOptions, label: `${defaultDataSetOptions.label} ${dataSetIdx + 1}` }
      }
      this.myChart.data.datasets[dataSetIdx].data = ele;
      ++dataSetIdx;
    })


    //  this.myChart.render({duration:0, lazy: true});
  }


  ngOnDestroy(): void {
    this.myChart.destroy()
  }

}
