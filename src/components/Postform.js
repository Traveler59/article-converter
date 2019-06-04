import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PostForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			address: '',
			selectors: ''
		};
	}

	onChangeAdress = e => {
		const storedSelectors = window.localStorage.getItem(`${extractHostname(e.target.value)}Selectors`);
		this.setState(
			{
				address: e.target.value,
				selectors: storedSelectors ? this.state.selectors.concat(storedSelectors) : this.state.selectors
			}
		);
	};

	onSubmit = e => {
		e.preventDefault();

		const getSiteNameFromKnown = address => {
			const foundSite = [
				{ url: '.wikipedia.org/wiki/', name: 'wikipedia' }, 
				{ url: '/plato.stanford.edu/entries/', name: 'sep' },
				{ url: 'nationalinterest.org/blog', name: 'nationalinterest' }
			]
				.find(a => !!~address.indexOf(a.url));
			return foundSite && foundSite.name;
		}

		if (this.state.selectors.length) {
			const name = `${extractHostname(this.state.address)}Selectors`;
			window.localStorage.setItem(name, this.state.selectors);
		}

		const post = {
			address: this.state.address,
			selectors: this.state.selectors.split('\n')
		};

		const site = getSiteNameFromKnown(post.address);

		this.props.sendAddress(post.address, post.selectors, site ? site : null);
	}

	render() {
		const fileReady = this.props.fileReady;
		return (
			<div>
				<h1>Скачать статью</h1>
				<form onSubmit={this.onSubmit}>
					<div>
						<label>Адрес: </label>
						<br />
						<input
							style={{ width: 500 }}
							type='text'
							onChange={this.onChangeAdress}
							value={this.state.address}
						/>
					</div>
					<br />
					<div>
						<label>Селекторы: </label>
						<br />
						<textarea
							style={{ resize: 'vertical', width: 500 }}
							onChange={e => this.setState({ selectors: e.target.value })}
							value={this.state.selectors}
						/>
					</div>
					<br />
					<button type='submit'>Отправить</button>
				</form>
				{fileReady === true
					? <a href='/download' download>Скачать</a>
					: fileReady === false ? 'Ошибка' : <div />}
			</div>
		);
	}
}

PostForm.propTypes = {
	sendAddress: PropTypes.func.isRequired,
	fileReady: PropTypes.bool
};

const extractHostname = url => url.split('/')[(url.indexOf('//') > -1 ? 2 : 0)];