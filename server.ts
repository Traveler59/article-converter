import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const app: express.Application = express();
const port = 4000;

app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));
app.get('/download', (_, res) => res.download(__dirname + '/articles/new.html'));

app.post('/getArticle', (req, res) => {
	if (!req.body) res.sendStatus(400);
	else parseArticle(req.body.address, req.body.selectors, req.body.site, result => res.send(result));
})


const allSelectors = [
	{
		name: "sepSelectors",
		headerSelector: "h1",
		selectorsList: [
			'#header-wrapper',
			'#article-sidebar',
			'#article-banner',
			'#footer',
			'#article-banner',
			'script',
			'img'
		]
	},
	{
		name: "wikipediaSelectors",
		headerSelector: "h1",
		selectorsList: [
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
		]
	},
	{
		name: "nationalinterestSelectors",
		headerSelector: "h1",
		selectorsList: [
			'.info',
			'nav',
			'.share',
			'.footer',
			'script'
		]
	}
];


const parseArticle = (address: string, selectors: string[], site: string, sendResult: (result: boolean) => void) => {
	https.get(address, res => {
		let body = '';
		res.on('data', chunk => body += chunk);

		res.on('end', () => {
			const $ = cheerio.load(body);
			const foundSite = allSelectors.find(s => s.name.includes(site));

			if (~$('#content').text().indexOf('Document Not Found')) {
				console.log('Статья не найдена')
				sendResult(false);
			} else {
				const selectorsToDelete = selectors.concat(foundSite && foundSite.selectorsList || [])
				selectorsToDelete.map(s => $(s).remove());
				const heading = foundSite && $(foundSite.headerSelector).text();
				console.log(heading);

				fs.writeFile("articles/new.html", $.html(), err => {
					if (err) {
						console.log(err);
						sendResult(false);
					}
					console.log('Создано');
					sendResult(true);
				});
			}
		})
	}).on('error', e => {
		console.log(e)
		sendResult(false);
	});;
}

app.listen(port, (error: string) => error
	? console.error(error)
	: console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
)