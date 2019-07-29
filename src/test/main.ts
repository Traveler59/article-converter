import * as assert from 'assert';

import { extractHostname } from '../components/Postform';
import { parseArticle } from '../../server';

describe('Extracting host name', () => {
	it('should delete all slashes', () => {
		assert.equal(extractHostname('//stackoverflow.com/'), 'stackoverflow.com');
	})
	it('should not delete first part', () => {
		assert.equal(extractHostname('stackoverflow.com/questions'), 'stackoverflow.com');
	})
});

describe('Parsing page', () => {
	it('should delete all divs and h1', () => {
		assert.equal(
			parseArticle('<h1>Title</h1><div>text1</div><div>text2</div><span>text3</span>',
				undefined, ['h1', 'div', 'head'], () => { }),
			'<html><body><span>text3</span></body></html>');
	})
	it('should delete all .misc class elements', () => {
		assert.equal(
			parseArticle('<h1>Title</h1><div class=\'misc\'>text1</div><div>text2</div><p class=\'misc\'>text3</p><p>text4</p>',
				undefined, ['.misc'], () => { }),
			'<html><head></head><body><h1>Title</h1><div>text2</div><p>text4</p></body></html>');
	})
});
