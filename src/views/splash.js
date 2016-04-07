'use strict';
var React = require('react-native');

var {
	StyleSheet,
	Image,
	View
} = React;

module.exports = React.createClass({

	componentDidMount: function(){
		setTimeout(() =>{
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
		backgroundColor: '#4FC3F7'
	},
	logo: {
		width: 200,
		height: 200
	}
})