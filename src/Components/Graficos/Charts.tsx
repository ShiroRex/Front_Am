"use client"

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

// Opciones mejoradas para los gráficos de línea y barras
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
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 6,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value.toFixed(1)}`;
        }
      }
    },
    datalabels: {
      display: false,
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6c757d",
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 10,
        },
        autoSkip: true,
        maxTicksLimit: 10,
      },
      border: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
        drawBorder: false,
      },
      ticks: {
        color: "#6c757d",
        font: {
          size: 11,
        },
        padding: 8,
      },
      border: {
        dash: [4, 4],
        color: "rgba(0, 0, 0, 0.1)",
      },
      beginAtZero: true,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'index',
    intersect: false,
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 3,
      hoverRadius: 6,
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
  },
}

// Opciones específicas para el gráfico de radar
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
        font: {
          size: 11,
          weight: "500" as const,
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
      cornerRadius: 8,
    },
    datalabels: {
      display: false,
    }
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
          weight: "500" as const,
        },
      },
      ticks: {
        backdropColor: "transparent",
        color: "#6c757d",
        font: {
          size: 10,
        },
      },
      min: 0,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 3,
      hoverRadius: 6,
      borderWidth: 2,
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
  },
}

// Opciones específicas para el gráfico de área polar
const polarAreaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
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
      cornerRadius: 8,
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
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
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
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      pointLabels: {
        color: "#495057",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart',
  },
}

export const LineChart = ({ data }: { data: any }) => (
  <Line options={chartOptions} data={data} />
)

export const BarChart = ({ data }: { data: any }) => (
  <Bar options={chartOptions} data={data} />
)

export const RadarChart = ({ data }: { data: any }) => (
  <Radar options={radarOptions} data={data} />
)

export const PolarAreaChart = ({ data }: { data: any }) => (
  <PolarArea options={polarAreaOptions} data={data} />
)

const CombinedCharts = { Line: LineChart, Bar: BarChart, Radar: RadarChart, PolarArea: PolarAreaChart }
export default CombinedCharts
