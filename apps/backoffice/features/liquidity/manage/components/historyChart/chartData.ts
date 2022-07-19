export type DataPoint = Array<number>;

export const chartData = (data: DataPoint[]) => ({
  type: "area",
  height: 172,
  series: [{ data }],
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
});
