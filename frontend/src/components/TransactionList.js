// 作成2025/01/01
// 更新2025/01/02
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // 取引一覧の表示/非表示
  const [monthFilter, setMonthFilter] = useState(''); // 月ごとのフィルタ
  const [since, setSince] = useState('2000-01-01'); // フィルタの開始日
  const [until, setUntil] = useState(new Date().toISOString().split('T')[0]); // フィルタの終了日

  useEffect(() => {
    axios.get('http://localhost:5000/transactions')
      .then((response) => {
        // 日付順に並べ替え（降順: 最新の日付が最初）
        const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions); // 初期状態では全取引を表示
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
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
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const sinceDate = new Date(since);
      const untilDate = new Date(until);
      return transactionDate >= sinceDate && transactionDate <= untilDate;
    });
    setFilteredTransactions(filtered);
  }, [since, until, transactions]);

  return (
    <div style={{ width: '50%', margin: 'auto', textAlign: 'center' }}>
      <h3>取引一覧</h3>

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
            {/* 過去24か月分を選択肢として追加 */}
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

      {/* 取引一覧の展開/非表示ボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isOpen ? '取引一覧を閉じる' : '取引一覧を表示'}
      </button>

      {/* 取引一覧 */}
      {isOpen && (
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          {filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '5px',
              }}
            >
              <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{transaction.category}</span>
              <span style={{ marginRight: '10px', color: '#666' }}>{transaction.description}</span>
              <span
                style={{
                  color: transaction.type === 'income' ? 'green' : 'red',
                  fontWeight: 'bold',
                }}
              >
                {transaction.type === 'income' ? `+${transaction.amount.toLocaleString()}` : `-${transaction.amount.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
