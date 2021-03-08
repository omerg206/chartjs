import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import 'chartjs-plugin-zoom';
export interface rawChartData {
  title: string;
  stack: string;
  value: number;
  date: Date | number;
}


export interface ChartJsData {
  title: string;
  stack: string;
  value: number;
  date: Date | number;
}

export interface ChartJsSingleGraphData {
  [stack: string] :   Chart.ChartPoint[]

}

export interface ChartJsDataCollection {
  [title: string] :  ChartJsSingleGraphData

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.intervalId = setInterval(() => { this.updateDate() }, 2000)
  }
  graphs: { title: string, stackNumber?: number }[] = [{ title: "chart 1", stackNumber: 3 }, { title: "chart 2" }]
  intervalId: any;
  rawData: rawChartData[] = [];
  chartJsData: ChartJsDataCollection = {};
  timeFrameMilliSec: number = 2 * 60 * 1000;

  randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
  }

  updateDate() {
    const maxAllowedDate = Date.now() - this.timeFrameMilliSec;
    this.rawData = this.rawData.filter((ele: rawChartData) => ele.date >= maxAllowedDate)

    this.graphs.forEach((graph: { title: string, stackNumber?: number }) => {

      if (graph.stackNumber && graph.stackNumber > 1) {
        for (let i = 0; i < graph.stackNumber; ++i) {
          this.rawData.push(this.createNewChartData(graph.title, i + 1))
        }
      } else {
        this.rawData.push(this.createNewChartData(graph.title))
      }
    })


    this.convertChartDataToChartJs(this.rawData);


  }


  createNewChartData(title: string, stackNum: number = 1): rawChartData {
    return {
      date: Date.now(),
      title,
      value: this.randomScalingFactor(),
      stack: `data set ${stackNum}`
    }
  }


  convertChartDataToChartJs(rawData: rawChartData[]) {
    this.chartJsData = rawData.reduce((acc: ChartJsDataCollection, ele: rawChartData ) => {
      if (!acc[ele.title]) {
        acc[ele.title] = {};
      }

      if (!acc[ele.title][ele.stack]) {
        acc[ele.title][ele.stack] = [];
      }

      acc[ele.title][ele.stack].push({x: ele.date, y: ele.value})
      return acc;
    }, {})
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
