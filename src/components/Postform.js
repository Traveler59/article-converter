import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendAddress } from '../actions/FormActions';

export default class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      selectors: ''
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const post = {
      address: this.state.address,
      selectors: this.state.selectors.split('\n')
    };

    this.props.sendAddress(post.address, post.selectors);
  }

  render() {
    return (
      <div>
        <h1>Скачать статью</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>address: </label>
            <br />
            <input
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
              name='selectors'
              onChange={this.onChange}
              value={this.state.selectors}
            />
          </div>
          <br />
          <button type='submit'>Отправить</button>
        </form>
        {this.props.fileReady && <a href='/download' download>Скачать</a>}
      </div>
    );
  }
}

PostForm.propTypes = {
  sendAddress: PropTypes.func.isRequired,
  fileReady: PropTypes.bool.isRequired
};
