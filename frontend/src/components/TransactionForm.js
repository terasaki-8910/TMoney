// 作成2025/01/01
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TransactionForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    type: 'expense'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/transactions', formData)
      .then((response) => {
        toast.success('取引を追加しました！'); // 成功時の通知
        setFormData({
          date: '',
          category: '',
          description: '',
          amount: '',
          type: 'expense',
        });
      })
      .catch((error) => {
        toast.error('取引の追加に失敗しました。'); // エラー時の通知
        console.error('Error adding transaction:', error);
      });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>取引の追加</h2>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="カテゴリ" required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="説明" />
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="金額" required />
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="expense">支出</option>
        <option value="income">収入</option>
      </select>
      <button type="submit">追加</button>
    </form>
  );
};

export default TransactionForm;
