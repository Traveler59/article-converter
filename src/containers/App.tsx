import * as React from 'react'
import { connect } from 'react-redux'
import Postform from '../components/Postform'
import { Dispatch, bindActionCreators } from 'redux';
import { SiteActionTypes } from '../actions/types';
import { AppState } from '../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { sendAddress } from '../actions/FormActions'


interface Props {
	sendAddress: (address: string, selectors: string[], siteName: string) => (dispatch: Dispatch<SiteActionTypes>) => Promise<void>,
	fileReady: boolean 
};

class App extends React.Component<Props, {}> {
	render() {
		const fileReady = this.props.fileReady;
		const sendAddress = this.props.sendAddress;
		return <div>
			<Postform sendAddress={sendAddress} fileReady={fileReady} />
		</div>
	}
}


const mapStateToProps = (state: AppState) => ({
	fileReady: state.form.fileReady
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, SiteActionTypes>) => ({
	sendAddress: bindActionCreators(sendAddress, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);