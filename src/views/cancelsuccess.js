'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	Image,
	View,
	Text
} =  React;

//get libraries
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	render: function(){
		return(
			<View style={styles.container}>
				<Icon name="delete-sweep" size={100} color="#ef5350" style={{marginBottom: 25}} />
				<Text style={{fontWeight: 'bold'}}>OOPS!</Text>
				<Text>Booking has been cancelled successfully</Text>
				<TouchableHighlight underlayColor={'#e8e8e8'} onPress={this.onDismiss}>
					<Text style={{fontSize: 15, color: '#4FC3F7', marginTop: 20}}>Back to Dashboard</Text>
				</TouchableHighlight>
			</View>
		);
	},
	onDismiss: function(){
		this.props.data.loadData("API");
		this.props.navigator.pop();
	}
})
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	successImage: {
		width: 350,
		height: 263
	}
})