const express = require('express');
const app = express();
const port = 3000; 
const path = require('path');//新增：引入路经模块

//新增：把public文件夹设置为静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

//API接口（路径是/api/hello)
app.get('/api/hello', (req, res) => {
	//返回一段JSON数据(前端最喜欢的数据格式）
	res.json({
		status: "success",
		message: "你好，这是来自后端的数据",
		time: new Date().toISOString()
	});
});


app.listen(port, () => {
	console.log('后端服务器已启动!请访问http://192.168.26.135:3000');
});
