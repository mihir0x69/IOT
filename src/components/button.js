'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	View,
	Text
} = React;

module.exports = React.createClass({
	render: function(){
		return (
			<TouchableHighlight 
				style={[styles.button, {backgroundColor: this.props.onRelaxColor}]} 
				underlayColor={this.props.onPressColor}
				onPress={this.props.onPress}
			>
				<Text style={styles.buttonText}>{this.props.text}</Text>
			</TouchableHighlight>
		);
	}
});

var styles = StyleSheet.create({
	button: {
		paddingTop: 10,
		paddingRight: 15,
		paddingBottom: 10,
		paddingLeft: 15,
		marginTop: 10,
	},
	buttonText: {
		flex: 1,
		color: '#ffffff',
		alignSelf: 'center'
	}
});