// 作成2024/01/02

import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const fetchTransactions = () => axios.get(`${API_BASE}/transactions`);
export const addTransaction = (data) => axios.post(`${API_BASE}/transactions`, data);
export const fetchCategorySummary = () => axios.get(`${API_BASE}/category-summary`);
