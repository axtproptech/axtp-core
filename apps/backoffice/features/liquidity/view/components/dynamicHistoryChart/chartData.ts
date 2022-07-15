export const chartData = {
  type: "area",
  height: 172,
  series: [
    {
      data: [
        [1657920381000, 250000],
        [1658352381000, 300000],
        [1658784381000, 500000],
        [1659216381000, 450000],
        [1659648381000, 525000],
        [1660080381000, 600000],
        [1660512381000, 590000],
        [1660944381000, 710000],
        [1661376381000, 900000],
        [1661808381000, 1250000],
        [1662240381000, 1100000],
        [1662672381000, 1310000],
        [1663104381000, 950000],
        [1663536381000, 900000],
        [1663968381000, 990000],
      ],
    },
  ],
  options: {
    chart: {
      id: "area-datetime",
      zoom: {
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    yaxis: {
      // show: false,
      tickAmount: 2,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy",
      },
    },
    colors: ["#673ab7"],
    fill: {
      colors: ["#673ab7", "#b39ddb"],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  },
};
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
