import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form } from 'react-bootstrap';
import './Postform.css';

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
			<div id='main'>
				<Col md={{ span: 4, offset: 4 }}>
					<h1>Скачать статью</h1>
					<br/><br/>
					<Form onSubmit={this.onSubmit}>
						<Form.Group>
							<Form.Label>Адрес: </Form.Label>
							<Form.Control type='address' placeholder='Введите адрес' onChange={this.onChangeAdress} value={this.state.address} />
							<Form.Text className='text-muted'>
								Полный адрес необходимой статьи
							</Form.Text>
						</Form.Group>

						<Form.Group>
							<Form.Label>Селекторы: </Form.Label>
							<Form.Control as='textarea' type='password'
								placeholder='Перечислите селекторы, которые необходимо удалить, такие как .footer и проч.'
								onChange={e => this.setState({ selectors: e.target.value })} value={this.state.selectors} />
						</Form.Group>
						<Button variant='primary' type='submit' disabled={!this.state.address.length}>
							Отправить
						</Button>
						{fileReady === true
							? <a id='downloadLink' href='/download' download>Скачать</a>
							: fileReady === false
								? <Form.Text className='text-muted'>Ошибка. Проверьте правильность адреса</Form.Text>
								: <div />}
					</Form>
				</Col>
			</div>
		);
	}
}

PostForm.propTypes = {
	sendAddress: PropTypes.func.isRequired,
	fileReady: PropTypes.bool
};

const extractHostname = url => url.split('/')[(url.indexOf('//') > -1 ? 2 : 0)];