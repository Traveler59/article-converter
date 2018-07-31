const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 4000;

app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/download', (req, res) => res.download(__dirname + '/articles/new.html'));

app.post('/getArticle', (req, res) => {
	if (!req.body) return res.sendStatus(400);
	parseArticle(req.body.address, req.body.selectors, req.body.site, result => res.send(result));
});

const sepSelectors = [
	'#header-wrapper',
	'#article-sidebar',
	'#article-banner',
	'#footer',
	'#article-banner',
	'script',
	'img'
];

const wikipediaSelectors = [
	'.navbox',
	'.mbox-small',
	'.mw-indicators',
	'.mw-editsection',
	'gallery',
	'#mw-head',
	'#mw-panel',
	'#footer',
	'script',
	'img'
];

const parseArticle = (address, selectors, site, sendResult) => {
	https.get(address, res => {
		let body = '';
		res.on('data', chunk => body += chunk);

		res.on('end', () => {
			const $ = cheerio.load(body);
			if(site === 'sep'){
				selectors = selectors.concat(sepSelectors)
			} else if(site === 'wikipedia'){
				selectors = selectors.concat(wikipediaSelectors)
			}

			selectors.map(s => $(s).remove());

			if (~$('#content').text().indexOf('Document Not Found')) {
				console.log('Статья не найдена')
				sendResult(false);
			} else {
				fs.writeFile('articles/new.html', $.html(), err => {
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

app.listen(port, error => error
	? console.error(error)
	: console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
)