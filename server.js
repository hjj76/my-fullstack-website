const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 解析 JSON 请求体（必须加，否则接收不到前端发来的数据）
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 连接（或创建）数据库文件
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
    } else {
        console.log('✅ 成功连接到 SQLite 数据库');
        // 创建留言表（如果不存在的话）
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )`);
    }
});

// 【API 1】获取所有留言
app.get('/api/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ status: 'success', data: rows });
    });
});

// 【API 2】提交新留言
app.post('/api/messages', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: '内容不能为空' });
    }
    const createdAt = new Date().toISOString();
    // 插入数据
    db.run(`INSERT INTO messages (content, created_at) VALUES (?, ?)`, [content, createdAt], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ status: 'success', message: '留言成功', id: this.lastID });
    });
});

app.listen(port, () => {
    console.log(`✅ 后端服务器已启动！请访问 http://192.168.26.135:${port}`);
});
