import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendChart = ({ data, title }) => {
  const chartData = {
    labels: ['FY22', 'FY23', 'FY24'], // Mock fiscal years
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue,
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(88, 166, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Net Profit',
        data: data.netProfit,
        borderColor: '#3fb950',
        backgroundColor: 'rgba(63, 185, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Cash Flow',
        data: data.operatingCashFlow,
        borderColor: '#d29922',
        backgroundColor: 'rgba(210, 153, 34, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#c9d1d9', font: { size: 10 } }
      },
      tooltip: {
        backgroundColor: '#161b22',
        titleColor: '#fff',
        bodyColor: '#c9d1d9',
        borderColor: '#30363d',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(48, 54, 61, 0.5)' },
        ticks: { color: '#8b949e', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#8b949e', font: { size: 10 } }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default TrendChart;
