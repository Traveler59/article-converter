import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import './Postform.scss';

export default class PostForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			address: '',
			selectors: ''
		};
	}

	onChangeAddress = e => {
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
		const dosInput = '_____________________________________________';
		return (
			<Col id='main' lg={{ span: 4, offset: 4 }} md={12}>
				<h1>Download</h1>
				<br /><br />
				<Form onSubmit={this.onSubmit}>
					<Form.Group>
						<Form.Label>Address: </Form.Label>
						<Form.Control type='address' placeholder={dosInput} onChange={this.onChangeAddress} value={this.state.address} />
					</Form.Group>
					<p>Full address of the article</p>
					<br /><br />

					<Form.Group>
						<Form.Label>Selectors: </Form.Label>
						<Form.Control as='textarea' type='password'
							placeholder={dosInput}
							onChange={e => this.setState({ selectors: e.target.value })} value={this.state.selectors} />
					</Form.Group>
					<p>Set list of selectors, that will be removed, ex. .footer etc.</p>
					{!!this.state.address.length && <button type='submit'>
						Submit
						</button>}
					{fileReady === true
						? <a href='/download' download>Download</a>
						: fileReady === false
							? <Form.Text className='text-muted'>Error. Check the address</Form.Text>
							: <div />}
				</Form>
			</Col>
		);
	}
}

PostForm.propTypes = {
	sendAddress: PropTypes.func.isRequired,
	fileReady: PropTypes.bool
};

const extractHostname = url => url.split('/')[(url.indexOf('//') > -1 ? 2 : 0)];