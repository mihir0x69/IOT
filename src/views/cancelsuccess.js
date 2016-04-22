'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	View,
	Text
} =  React;

//get libraries
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	render: function(){
		return(
			<View style={styles.container}>
				<Icon name="delete" size={100} color="#cccccc" style={{marginBottom: 25}} />
				<Text style={{fontWeight: 'bold'}}>SUCCESS</Text>
				<Text>Your booking has been cancelled.</Text>
				<TouchableHighlight underlayColor={'#e8e8e8'} onPress={this.onDismiss}>
					<Text style={{fontSize: 15, color: '#4FC3F7', marginTop: 20}}>Tap to continue</Text>
				</TouchableHighlight>
			</View>
		);
	},
	onDismiss: function(){
		this.props.data.loadData();
		this.props.data.refreshList("API");
		this.props.navigator.pop();
	}
});

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