import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
  [stack: string]: Chart.ChartPoint[]

}

export interface ChartJsDataCollection {
  [title: string]: ChartJsSingleGraphData

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  graphs: { title: string, stackNumber?: number }[] = [
    { title: "chart 1", stackNumber: 3 },
    { title: "chart 2" },
    { title: "chart 3" },
    { title: "chart 4" },
    { title: "chart 5" },
    { title: "chart 6" },
    { title: "chart 7" },

  ]
  intervalId: any;
  rawData: rawChartData[] = [];
  chartJsData: ChartJsDataCollection = {};
  timeFrameMilliSec: number = 1 * 20 * 1000;


  ngOnInit(): void {
    this.intervalId = setInterval(() => { this.updateDate() }, 1000)
  }
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
    this.chartJsData = rawData.reduce((acc: ChartJsDataCollection, ele: rawChartData) => {
      if (!acc[ele.title]) {
        acc[ele.title] = {};
      }

      if (!acc[ele.title][ele.stack]) {
        acc[ele.title][ele.stack] = [];
      }

      acc[ele.title][ele.stack].push({ x: ele.date, y: ele.value })
      return acc;
    }, {})
  }

  trackByFn(index, item: KeyValue<string, ChartJsSingleGraphData>) {

    return item.key
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
