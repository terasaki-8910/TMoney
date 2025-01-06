# 作成: 2025/01/01
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)

# CORS設定
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# データベース接続情報
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',  
    'password': 'pass', 
    'database': 'tmoney' 
}

# データベース接続関数
def create_connection():
    try:
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            charset='utf8mb4'  # 日本語対応エンコード
        )
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None


# エンドポイント: トランザクション一覧取得
@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = create_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM transactions")
        rows = cursor.fetchall()
        conn.close()
        return jsonify(rows), 200
    else:
        return jsonify({"error": "Database connection failed"}), 500

# エンドポイント: 新規トランザクション追加
@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    query = """
    INSERT INTO transactions (date, category, description, amount, type)
    VALUES (%s, %s, %s, %s, %s)
    """
    values = (
        data['date'], data['category'], data.get('description', ''),
        data['amount'], data['type']
    )
    conn = create_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        return jsonify({"message": "Transaction added successfully"}), 201
    else:
        return jsonify({"error": "Database connection failed"}), 500

# カテゴリごとの合計金額取得
@app.route('/category-summary', methods=['GET'])
def get_category_summary():
    query = """
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE `type` = 'expense'
    GROUP BY category
    """
    conn = create_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()
        return jsonify(rows), 200
    else:
        return jsonify({"error": "Database connection failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)
