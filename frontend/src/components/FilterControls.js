// 作成日: 20245/01/02
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const FilterControls = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState(Cookies.get('dateRange') || 'all');
  const [category, setCategory] = useState(Cookies.get('category') || '');

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    Cookies.set('dateRange', value, { expires: 7 }); // Cookieに保存（7日間有効）
    onFilterChange({ dateRange: value, category });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    Cookies.set('category', value, { expires: 7 }); // Cookieに保存
    onFilterChange({ dateRange, category: value });
  };

  useEffect(() => {
    // 初期フィルタの設定
    onFilterChange({ dateRange, category });
  }, []);

  return (
    <div>
      <h2>フィルタ</h2>
      <label>
        日付範囲:
        <select value={dateRange} onChange={handleDateRangeChange}>
          <option value="all">すべて</option>
          <option value="last7days">過去7日間</option>
          <option value="last30days">過去30日間</option>
        </select>
      </label>
      <label>
        カテゴリ:
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          placeholder="カテゴリを入力"
        />
      </label>
    </div>
  );
};

export default FilterControls;
