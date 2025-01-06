# TMoney - 家計簿アプリ

## TODO
現在、herokuに適応中

## 概要
TMoneyは、収支を管理するための簡単な家計簿アプリケーション。収入や支出の入力、カテゴリ別のデータ分析を行う。

---

## 実装機能
- **収支の記録**  
  日付、カテゴリ、説明、金額を入力し、収入や支出を記録できる。
  
- **取引一覧表示**  
  過去の取引を日付順に確認でき、フィルタリングが可能。

- **カテゴリ別分析**  
  支出と収入をカテゴリごとに円グラフで可視化。

- **フィルタ機能**  
  - 月ごとのフィルタ
  - 自由日付範囲フィルタ (開始日～終了日)

---

## 環境構築手順

### 必要な環境
- Python 3.x
- Node.js
- MySQL

### ローカル環境でのセットアップ
1. **リポジトリをクローンする**:
   ```bash
   git clone https://github.com/terasaki-8910/TMoney.git
   cd TMoney
  ```

2. **バックエンドセットアップ**:
```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
   pip install -r requirements.txt
```

3. **フロントエンドセットアップ**:
```bash
   cd ../frontend
   npm install

4. **データベースセットアップ**:
```sql
CREATE DATABASE IF NOT EXISTS tmoney
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tmoney;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


5. **アプリの起動**:
- バックエンド:
```bash
コードをコピーする
cd backend
python app.py
- フロントエンド:
```bash
コードをコピーする
cd frontend
npm start

6. **ブラウザでアクセス**:
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:5000


