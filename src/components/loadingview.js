var React = require('react-native');

var {
	Dimensions,
	StyleSheet,
	Image,
	View
} = React;

const {height, width} = Dimensions.get('window');

module.exports = React.createClass({

	render: function(){
		return(
			<View style={styles.container}>
	  			<View style={styles.loadingScene}>
					
				</View>
			</View>
		);
	}	
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingScene: {
		flex: 1,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	loader: {
		width: 200,
		height: 150
	}
});