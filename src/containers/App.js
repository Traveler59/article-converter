import React, { Component } from 'react'
import { connect } from 'react-redux'

import Postform from '../components/Postform'
import { sendAddress } from '../actions/FormActions'

class App extends Component {
	render() {
		const form = this.props.form;
		const sendAddress = this.props.sendAddress;
		return <div>
			<Postform sendAddress={sendAddress} fileReady={form.fileReady} />
		</div>
	}
}

export default connect(state => ({ form: state.form }), { sendAddress })(App);