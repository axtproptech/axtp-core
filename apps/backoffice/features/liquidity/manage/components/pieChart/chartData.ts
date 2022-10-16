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
