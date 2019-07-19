import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as mongo from 'mongodb';

const dbUrl = 'mongodb://localhost:27017/article_sites';
interface Site {
	name: string,
	headerSelector: string,
	selectorsList: string[]
};
const allSelectors: Site[] = [];

const app: express.Application = express();
const port = 4000;

app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));
app.get('/download', (_, res) => res.download(__dirname + '/articles/new.html'));

app.post('/getArticle', (req, res) => {
	if (!req.body) res.sendStatus(400);
	else loadArticle(req.body.address, req.body.selectors, req.body.site, result => res.send(result));
})

const loadArticle = (address: string, selectors: string[], site: string, sendResult: (result: boolean) => void) => {
	try {
		https.get(address, res => {
			let body = '';
			res.on('data', chunk => body += chunk);

			res.on('end', () => {
				const foundSite = allSelectors.find(s => s.name.includes(site));
				const parsedHtml = parseArticle(body, foundSite, selectors, sendResult);
				if (!!parsedHtml.length) {
					fs.writeFile('articles/new.html', parsedHtml, err => {
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
		});
	} catch (e) {
		console.log(e);
		sendResult(false);
	}
}

const startListening = () =>
	app.listen(port, (error: string) => error
		? console.error(error)
		: console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
	);


(async () => {
	const client = new mongo.MongoClient(dbUrl, { useNewUrlParser: true });
	await client.connect();
	const cursor = client.db('article_sites').collection('sites').find();
	cursor.forEach(doc => allSelectors.push(doc), () => {
		client.close()
		startListening();
	});
})();


export const parseArticle = (pageBody: string, foundSite: Site | undefined, selectors: string[], result: (result: boolean) => void) => {
	const $ = cheerio.load(pageBody);

	if (~$('#content').text().indexOf('Document Not Found')) {
		console.log('Статья не найдена')
		result(false);
		return '';
	} else {
		const selectorsToDelete = selectors.concat(foundSite && foundSite.selectorsList || [])
		selectorsToDelete.map(s => $(s).remove());
		const heading = $(foundSite && foundSite.headerSelector || 'h1').text();
		console.log(heading);
		return $.html();
	}
}
