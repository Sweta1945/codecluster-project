import React from 'react';
import Plot from 'react-plotly.js';

const BarChart = ({ selectedRows }) => {
  const chartData = [{
    x: selectedRows.map(row => row.title),
    y: selectedRows.map(row => row.price),
    type: 'bar'
  }];

  return (
    <div>
      <Plot
        data={chartData}
        layout={{ width: 800, height: 400, title: 'Product Prices' }}
      />
    </div>
  );
};

export default BarChart;