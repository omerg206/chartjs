import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ChartType, Chart } from 'chart.js';
import 'chartjs-plugin-zoom';
import { ChartJsSingleGraphData } from '../app.component';
import { forEach } from 'lodash';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements AfterViewInit {
  ctx: CanvasRenderingContext2D | null = null;
  myChart: Chart | null = null;
  config: Chart.ChartConfiguration | null = null;

  @Input() set data(val: ChartJsSingleGraphData) {
    this.updateDate(val);

  };

  @ViewChild('graph', { static: true, read: ElementRef }) graph!: ElementRef;



  constructor() { }



  ngAfterViewInit(): void {
    this.ctx = this.graph.nativeElement.getContext('2d');
    this.config = {
      type: 'bar',
      data: {
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgba(54, 162, 235,0.9)",
            hoverBackgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235,0.9)",
            hoverBorderWidth: 2,
            hoverBorderColor: "yellow",
            borderJoinStyle: 'round',
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            hoverBackgroundColor: "rgba(75, 192, 192, 1)",
            borderColor: "rgba(75, 192, 192, 0.8)",
            hoverBorderWidth: 2,
            hoverBorderColor: "red",
          },
          {
            label: "Dataset 3",
            backgroundColor: "rgba(204, 102, 153, 0.8)",
            hoverBackgroundColor: "rgba(204, 102, 153, 1)",
            borderColor: "rgba(204, 102, 153, 0.8)",
            hoverBorderWidth: 2,
            hoverBorderColor: "brown",
          }
        ]
      },
      options: {
        elements: {
          line: {
            fill: false
          }
        },
        responsive: true,
        title: {
          display: true,
          text: "my chart"
        },
        tooltips: {
          mode: "index",
          intersect: false
        },
        scales: {

          xAxes: [{
            stacked: true,
            display: true,
            offset: true,
            // distribution: 'series',
            type: "time",
            time: {
              unit: 'second',
              // round: 'second',
              stepSize: 5,
              displayFormats: {
                second: "HH:mm:ss"
              },
              // parser: "ss",
              scaleLabel: {
                display: true,
                labelString: "Date"
              }

            }
          }],
          yAxes: [{
            stacked: true,
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            },
            // ticks: {
            //   // beginAtZero: true
            // }

          }]
        },
        plugins: {
          zoom: {
            // Container for pan options
            pan: {
              // Boolean to enable panning
              enabled: true,

              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              mode: 'xy',
              // rangeMax: {
              //   x: 4000
              // },
              // rangeMin: {
              //   x: 0
              // }
            },

            // Container for zoom options
            zoom: {
              // Boolean to enable zooming
              enabled: true,
              // drag: true,

              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: 'xy',
              // rangeMax: {
              //   x: 20000
              // },
              // rangeMin: {
              //   x: 1000
              // },
              threshold: 10
            }
          }
        }
      }
    }


    this.myChart = new Chart(this.ctx, this.config);
    // console.log(  (myChart).resetZoom);

  }


  changeGraphType(graphType: ChartType) {
    this.myChart.destroy();
    this.myChart = new Chart(this.ctx, { ...this.config, type: graphType });
  }

  resetZoom() {
    (this.myChart as any).resetZoom();
  }


  updateDate(data: ChartJsSingleGraphData) {
    let dataSetIdx = 0;
    forEach(data, (ele: Chart.ChartPoint[], key: string) => {
      this.myChart.data.datasets[dataSetIdx].data = ele;
      ++dataSetIdx;
    })
    console.log(this.myChart);
    if (this.myChart) {
      this.myChart.update();
    }

  }


  randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
  }

}