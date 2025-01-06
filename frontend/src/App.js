// 作成: 2025/01/01
// 更新: 2025/01/02
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import CategoryPieChart from './components/CategoryPieChart';

function App() {
  return (
    <div className="App">
      <h1>TMoney - 家計簿アプリ</h1>
      <TransactionForm />
      <TransactionList />
      <CategoryPieChart />
      <ToastContainer />
    </div>
  );
}

export default App;
