'use strict';
var React = require('react-native');

var {
	StyleSheet,
	Image,
	View
} = React;

var TimerMixin = require('react-timer-mixin');

module.exports = React.createClass({

	mixins: [TimerMixin],
	componentDidMount: function(){
		this.setTimeout(() =>{
			this.props.navigator.replace({name: 'signin'});
		}, 2000);
	},
	render: function(){
		return(
			<View style={styles.container}>
				<Image source={require('../../assets/images/HSLOGO/hs_logo_3x_white.png')} style={styles.logo} />
			</View>
		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2196F3'
	},
	logo: {
		width: 200,
		height: 200
	}
})