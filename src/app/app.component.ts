import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import 'chartjs-plugin-zoom';
import 'hammerjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graph', { static: true, read: ElementRef }) graph!: ElementRef;
  ctx:  CanvasRenderingContext2D | null = null;
  myChart: Chart | null = null;
  config : Chart.ChartConfiguration | null = null;

  ngAfterViewInit(): void {
    this.ctx =  this.graph.nativeElement.getContext('2d');
    this.config = {
      type: 'bar',
      data: {
        datasets: [
          {
          label: "Dataset 1",
          data: [{
            x: new Date(Date.now()),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 1 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 2 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 3 *1000),
            y: Math.floor(100 *Math.random())
          }],
          backgroundColor: "rgba(54, 162, 235,0.9)",
          hoverBackgroundColor: "rgba(54, 162, 235, 1)",
          borderColor: "rgba(54, 162, 235,0.9)",
          hoverBorderWidth: 2,
          hoverBorderColor: "yellow",
          borderJoinStyle: 'round',
          fill: false
        },
        {
          label: "Dataset 2",
          data: [{
            x: new Date(Date.now()),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 1 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 2 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 3 *1000),
            y: Math.floor(100 *Math.random())
          }],
          backgroundColor: "rgba(75, 192, 192, 0.8)",
          hoverBackgroundColor: "rgba(75, 192, 192, 1)",
          borderColor: "rgba(75, 192, 192, 0.8)",
          hoverBorderWidth: 2,
          hoverBorderColor: "red",
          fill: false
        },
        {
          label: "Dataset 3",
          data: [{
            x: new Date(Date.now()),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 1 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 2 *1000),
            y: Math.floor(100 *Math.random())
          }, {
            x: new Date(Date.now() - 3 *1000),
            y: Math.floor(100 *Math.random())
          }],
          backgroundColor: "rgba(204, 102, 153, 0.8)",
          hoverBackgroundColor: "rgba(204, 102, 153, 1)",
          borderColor: "rgba(204, 102, 153, 0.8)",
          hoverBorderWidth: 2,
          hoverBorderColor: "brown",
          fill: false
        }
      ]
      },
      options: {
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
            type: "time",
            time: {
              unit: 'second',
              round: 'second',
              displayFormats: {
                second: "ss"
              },
              parser: "ss",
              // scaleLabel: {
              //   display: true,
              //   labelString: "Date"
              // },
            }
          }],
          yAxes: [{
              stacked: true,
          //    display: true,
          //    scaleLabel: {
          //     display:     true,
          //     labelString: 'value'
          // },
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
              mode: 'xy'
            },

            // Container for zoom options
            zoom: {
              // Boolean to enable zooming
              enabled: true,

              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: 'xy',
            }
          }
        }
      }
    }


    this.myChart = new Chart(this.ctx, this.config);

    // console.log(  (myChart).resetZoom);

  }


  changeGraphType(graphType: ChartType){
    this.myChart.destroy();
    this.myChart = new Chart(this.ctx, {...this.config, type: graphType});
  }

  resetZoom() {
    (this.myChart as any).resetZoom();
  }

}
