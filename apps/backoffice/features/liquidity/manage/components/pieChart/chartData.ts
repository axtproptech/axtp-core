export const chartData = (series: number[], labels: string[]) => ({
  type: "donut",
  series,
  options: {
    legend: {
      position: "top",
    },
    labels,
    chart: {
      type: "donut",
      id: "liquidity-pie-chart",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 0,
        donut: {
          labels: {
            total: {
              showAlways: true,
            },
          },
        },
      },
    },
    grid: {
      padding: {
        bottom: -80,
      },
    },
    colors: ["#673ab7", "#b39ddb"],
    fill: {
      colors: ["#673ab7", "#b39ddb"],
    },
  },
});
//
// var chart = new ApexCharts(document.querySelector("#chart-timeline"), options);
// chart.render();
//
//
// var resetCssClasses = function(activeEl) {
//     var els = document.querySelectorAll('button')
//     Array.prototype.forEach.call(els, function(el) {
//         el.classList.remove('active')
//     })
//
//     activeEl.target.classList.add('active')
// }
//
// document
//     .querySelector('#one_month')
//     .addEventListener('click', function(e) {
//         resetCssClasses(e)
//
//         chart.zoomX(
//             new Date('28 Jan 2013').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document
//     .querySelector('#six_months')
//     .addEventListener('click', function(e) {
//         resetCssClasses(e)
//
//         chart.zoomX(
//             new Date('27 Sep 2012').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document
//     .querySelector('#one_year')
//     .addEventListener('click', function(e) {
//         resetCssClasses(e)
//         chart.zoomX(
//             new Date('27 Feb 2012').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document.querySelector('#ytd').addEventListener('click', function(e) {
//     resetCssClasses(e)
//
//     chart.zoomX(
//         new Date('01 Jan 2013').getTime(),
//         new Date('27 Feb 2013').getTime()
//     )
// })
//
// document.querySelector('#all').addEventListener('click', function(e) {
//     resetCssClasses(e)
//
//     chart.zoomX(
//         new Date('23 Jan 2012').getTime(),
//         new Date('27 Feb 2013').getTime()
//     )
// })
