import { Line, Bar, Radar, PolarArea } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
      padding: 12,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6c757d",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        color: "#6c757d",
      },
    },
  },
}

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      display: true,
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        color: "#495057",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
      padding: 12,
      usePointStyle: true,
    },
  },
  scales: {
    r: {
      angleLines: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      pointLabels: {
        color: "#495057",
        font: {
          size: 12,
        },
      },
      ticks: {
        backdropColor: "transparent",
        color: "#6c757d",
      },
    },
  },
}

const polarAreaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      display: true,
      labels: {
        boxWidth: 15,
        padding: 20,
        usePointStyle: true,
        pointStyle: "rectRounded",
        color: "#495057",
        font: {
          size: 12,
          weight: "bold" as const,
        },
        generateLabels: (chart: any) => {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label: string, i: number) => {
              const meta = chart.getDatasetMeta(0)
              const style = meta.controller.getStyle(i)
              const value = data.datasets[0].originalValues[i]
              const maxValue = data.datasets[0].maxValues[i]
              const percentage = Math.round((value / maxValue) * 100)

              return {
                text: `${label}: ${value} / ${maxValue} (${percentage}%)`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                pointStyle: "rectRounded",
                hidden: false,
                index: i,
              }
            })
          }
          return []
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
      padding: 12,
      usePointStyle: true,
      callbacks: {
        label: (context: any) => {
          const value = context.dataset.originalValues[context.dataIndex]
          const maxValue = context.dataset.maxValues[context.dataIndex]
          const percentage = Math.round((value / maxValue) * 100)
          return `${context.label}: ${value} / ${maxValue} (${percentage}%)`
        },
      },
    },
    datalabels: {
      display: true,
      color: "#fff",
      font: {
        weight: "bold",
        size: 11,
      },
      formatter: (value: any, context: any) => {
        const originalValue = context.dataset.originalValues[context.dataIndex]
        const maxValue = context.dataset.maxValues[context.dataIndex]
        return `${originalValue}/${maxValue}`
      },
      align: "center",
      anchor: "center",
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100, // Usamos porcentajes para normalizar
      ticks: {
        backdropColor: "transparent",
        color: "#6c757d",
        stepSize: 20,
        callback: (value: number) => value + "%",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      pointLabels: {
        color: "#495057",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  },
}

export const LineChart = ({ data }: { data: any }) => <Line options={chartOptions} data={data} />

export const BarChart = ({ data }: { data: any }) => <Bar options={chartOptions} data={data} />

export const RadarChart = ({ data }: { data: any }) => <Radar options={radarOptions} data={data} />

export const PolarAreaChart = ({ data }: { data: any }) => <PolarArea options={polarAreaOptions} data={data} />

const CombinedCharts = { Line: LineChart, Bar: BarChart, Radar: RadarChart, PolarArea: PolarAreaChart }
export default CombinedCharts

