import React, { Component } from 'react'
import { connect } from 'react-redux'

import Postform from '../components/Postform'
import { sendAddress } from '../actions/FormActions'

class App extends Component {
	render() {
		const page = this.props.page;
		const sendAddress = this.props.sendAddress;
		return <div>
			<Postform sendAddress={sendAddress} link={page.link} />
		</div>
	}
}

export default connect(state => ({ page: state.page }), { sendAddress })(App);