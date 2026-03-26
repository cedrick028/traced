import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, ChartOptions, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  // ngAfterViewInit(): void {
  //   const ctx: any = document.getElementById('myChart');

  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //       datasets: [{
  //         label: '',
  //         data: [1200, 1800, 1500, 1000, 1100, 2100],
  //         borderWidth: 1,
  //         tension: 0.4,
  //         fill: false,
  //         backgroundColor: '#86efac',
  //         pointBackgroundColor: ['red', 'blue', 'green', 'orange', 'purple'],
  //         pointBorderColor: ['darkred', 'darkblue', 'darkgreen', 'darkorange', 'indigo'],
  //         pointRadius: 3,
  //         borderColor: ['#fde047']
  //       }]
  //     },
  //     options: {
  //       plugins: {
  //         legend: {
  //           display: false
  //         },
  //         datalabels: {
  //           display: false,
  //           color: '#333',
  //           anchor: 'center',
  //           align: 'right',
  //           font: {
  //             size: 12
  //           },
  //         }
  //       },
  //       scales: {
  //         x: {
  //           // offset: true,
  //           grid: {
  //             color: '#e5e7eb'
  //           }
  //         },
  //         y: {
  //           grid: {
  //             color: '#e5e7eb'
  //           },
  //           ticks: {
  //             display: false
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  // Chart type
  public doughnutChartType: ChartType = 'doughnut';

  // Chart data
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
      {
        data: [300, 150, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // segment colors
        borderColor: ['#fff', '#fff', '#fff', '#fff'], // border colors
        borderWidth: 1, // border width
        hoverOffset: 1, // offset when hovering
        borderRadius: 60,
        spacing: 5,
      }
    ]
  };

  // Chart options for styling
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
        labels: {
          color: '#333', // legend text color
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.formattedValue + ' units';
          }
        }
      }
    },
    cutout: '70%', // inner radius (creates doughnut hole)
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

}
