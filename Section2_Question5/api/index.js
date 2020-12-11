const { Buffer } = require('buffer');
const express = require('express')
const app = express();
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path");
app.use(bodyParser.json())
app.use(cors())
const reactApp = path.join(__dirname, '../build');
app.use('/',express.static(reactApp));
app.post('/save-data', (req, res) => {
	try {
		const message = req.body
		fs.writeFile('result.json', new Buffer(JSON.stringify(message)), function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
		res.json({
			"message": "success",
			data: message
		})
	} catch (error) {
		res.status(500).json({
			error: error.message
		})
	}
})
app.get('/data', (req, res) => {
	try {
		fs.readFile('result.json', (err, data) => {
			if (err) throw err;
			const jsonData = JSON.parse(data.toString())
			res.json({
				data: jsonData
			})
		})
	} catch (error) {
		res.status(500).json({
			error: error.message
		})
	}
})
const port = process.env.PORT || 4000
app.listen(port, function () {
	console.log(`${'\u2705'}  Server starting http://localhost:${port}`);
})