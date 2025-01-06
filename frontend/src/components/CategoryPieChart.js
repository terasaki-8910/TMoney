import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import './CategoryPieChart.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 必要な要素を登録
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CategoryPieChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [categories, setCategories] = useState([]); // カテゴリ一覧の状態
  const [maxCategory, setMaxCategory] = useState(null); // 最大カテゴリ用の状態
  const [monthFilter, setMonthFilter] = useState(''); // 月ごとのフィルタ
  const [since, setSince] = useState('2000-01-01'); // フィルタの開始日
  const [until, setUntil] = useState(new Date().toISOString().split('T')[0]); // フィルタの終了日

  useEffect(() => {
    axios.get('http://localhost:5000/category-summary')
      .then((response) => {
        const data = response.data;

        // totalsを数値型に変換
        const numericData = data.map((item) => ({
          ...item,
          total: parseFloat(item.total),
          date: item.date, // 各カテゴリに日付を追加
        }));

        setCategories(
          numericData.map((item, index) => ({
            label: item.category,
            total: item.total,
            date: item.date,
            color: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            ][index % 6],
            disabled: false, // 初期状態は有効
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching category summary:', error);
      });
  }, []);

  // 月ごとのフィルタ処理
  const handleMonthFilterChange = (event) => {
    const selectedMonth = event.target.value;
    setMonthFilter(selectedMonth);

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).toISOString().split('T')[0];
      setSince(firstDay);
      setUntil(lastDay);
    }
  };

  // フィルタの適用処理
  useEffect(() => {
    const filteredCategories = categories.filter((category) => {
      const categoryDate = new Date(category.date);
      const sinceDate = new Date(since);
      const untilDate = new Date(until);
      return categoryDate >= sinceDate && categoryDate <= untilDate && !category.disabled;
    });

    const labels = filteredCategories.map((category) => category.label);
    const totals = filteredCategories.map((category) => category.total);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'カテゴリ別支出',
          data: totals,
          backgroundColor: filteredCategories.map((category) => category.color),
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 2,
          hoverBorderWidth: 4,
          cutout: '60%', // 中央をくり抜き
        },
      ],
    });

    if (totals.length > 0) {
      const maxIndex = totals.indexOf(Math.max(...totals));
      setMaxCategory({
        label: labels[maxIndex],
        total: totals[maxIndex],
      });
    } else {
      setMaxCategory(null);
    }
  }, [since, until, categories]);

  // カテゴリを排除または復活する関数
  const handleCategoryClick = (categoryLabel) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.label === categoryLabel
          ? { ...category, disabled: !category.disabled } // 無効化を切り替える
          : category
      )
    );
  };

  return (
    <div style={{ width: '50%', margin: 'auto', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#333' }}>
        {maxCategory
          ? `最も多いカテゴリ: ${maxCategory.label} (${maxCategory.total.toLocaleString()}円)`
          : 'カテゴリ別支出'}
      </h3>

      {/* フィルタ */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
          月ごとのフィルタ:
          <select
            value={monthFilter}
            onChange={handleMonthFilterChange}
            style={{ marginLeft: '10px' }}
          >
            <option value="">全期間</option>
            {Array.from({ length: 24 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              return (
                <option key={`${year}-${month}`} value={`${year}-${month}`}>
                  {`${year}年${month}月`}
                </option>
              );
            })}
          </select>
        </label>

        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
          自由フィルタ:
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px', marginRight: '10px' }}>~</span>
          <input
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </label>
      </div>

      {/* カテゴリ一覧 */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              background: category.disabled ? '#e0e0e0' : '#f1f1f1',
              padding: '5px 10px',
              borderRadius: '5px',
              border: `2px solid ${category.color}`,
              color: '#333',
              opacity: category.disabled ? 0.5 : 1, // 無効化されたカテゴリは透明度を下げる
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: category.color,
                marginRight: '5px',
              }}
            ></div>
            {category.label}
          </div>
        ))}
      </div>

      {chartData.labels.length > 0 ? (
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: { display: false },
            },
          }}
        />
      ) : (
        <p>データがありません</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
