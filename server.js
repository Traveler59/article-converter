const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 3000;

app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.json()); // for parsing application/json


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
});

app.get('/download', (req, res) => {
	const file = __dirname + '/articles/sep.html';
	res.download(file); // Set disposition and send it.
});

app.post('/getArticle', (req, res) => {
	if (!req.body) return res.sendStatus(400);
	parseArticle(req.body.address, req.body.selectors, result => res.send(result));
});


const parseArticle = (address, userSelectors, sendResult) => {
	https.get(address, res => {
		let body = '';
		res.on('data', chunk => body += chunk);

		res.on('end', () => {
			const $ = cheerio.load(body);
			const selectors = [
				'#header-wrapper',
				'#article-sidebar',
				'#article-banner',
				'#footer',
				'#article-banner',
				'script'
			].concat(userSelectors);

			selectors.map(s => $(s).remove());

			if (~$('#content').text().indexOf('Document Not Found')) {
				console.log('Статья не найдена')
				sendResult(false);
			} else {
				fs.writeFile(`articles/sep.html`, $.html(), err => {
					if (err) {
						console.log(err);
						sendResult(false);
					}
					console.log('Создано');
					sendResult(true);
				});
			}
		});
	});
}

app.listen(port, error => {
	if (error) {
		console.error(error)
	} else {
		console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
	}
})