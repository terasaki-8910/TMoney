-- 2025/01/01 作成
-- 2025/01/02 更新
-- データベースの作成（utf8mb4 対応）
CREATE DATABASE IF NOT EXISTS tmoney
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- データベースの使用
USE tmoney;

-- トランザクションテーブルの作成（utf8mb4 対応）
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
