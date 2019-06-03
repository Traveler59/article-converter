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

	onChange = e => this.setState({ [e.target.name]: e.target.value });

	onSubmit = e => {
		e.preventDefault();

		const getSiteName = (address) => {
			const foundSite = [{ url: '.wikipedia.org/wiki/', name: 'wikipedia' }, { url: '/plato.stanford.edu/entries/', name: 'sep' }]
				.find(a => !!~address.indexOf(a.url));
			
			return foundSite && foundSite.name;
		}
		const post = {
			address: this.state.address,
			selectors: this.state.selectors.split('\n')
		};

		const site = getSiteName(post.address);

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
							name='address'
							onChange={this.onChange}
							value={this.state.address}
						/>
					</div>
					<br />
					<div>
						<label>Селекторы: </label>
						<br />
						<textarea
							style={{ resize: 'vertical', width: 500 }}
							name='selectors'
							onChange={this.onChange}
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
