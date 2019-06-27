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

	getSiteNameFromKnown = address => {
		const recognizedSite = [
			{ url: '.wikipedia.org/wiki/', name: 'wikipedia' },
			{ url: '/plato.stanford.edu/entries/', name: 'sep' },
			{ url: 'nationalinterest.org/blog', name: 'nationalinterest' }
		]
			.find(a => !!~address.indexOf(a.url));
		return recognizedSite && recognizedSite.name;
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

		if (this.state.selectors.length) {
			const name = `${extractHostname(this.state.address)}Selectors`;
			window.localStorage.setItem(name, this.state.selectors);
		}

		const post = {
			address: this.state.address,
			selectors: this.state.selectors.split('\n')
		};

		const site = this.getSiteNameFromKnown(post.address);

		this.props.sendAddress(post.address, post.selectors, site ? site : null);
	}

	render() {
		const fileReady = this.props.fileReady;
		const dosInput = '_'.repeat(67);
		const site = this.getSiteNameFromKnown(this.state.address);
		return (
			<Col id='main' lg={{ span: 6, offset: 3 }} md={12}>
				<h1>Article Converter</h1>
				<br />
				<p>Save any webpage in .html format and exclude page elements that you don't need. Usefull for e-readers and offline desktop readers.</p>
				<br /><br />
				<Form onSubmit={this.onSubmit}>
					<p>Full address of page that will be converted.</p>
					<Form.Group>
						<Form.Label>Address: </Form.Label>
						<Form.Control type='address' placeholder={dosInput} onChange={this.onChangeAddress} value={this.state.address} />
					</Form.Group>
					{site
						? <p className='highlighted-text'>Site was recognized, adding selectors not needed.</p>
						: <div>
							<br /><br />
							<p>Set list of selectors, that will be removed, ex. '.footer' etc. They should be divided by end of line</p>
							<p>Used selectors will be saved in cache.</p>
							<Form.Group>
								<Form.Label>Selectors: </Form.Label>
								<Form.Control as='textarea' type='password'
									placeholder={dosInput}
									onChange={e => this.setState({ selectors: e.target.value })} value={this.state.selectors} />
							</Form.Group>
						</div>
					}
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