'use strict';
var React = require('react-native');

var {
	TouchableWithoutFeedback,
	StyleSheet,
	View,
	Text
} = React;

module.exports = React.createClass({

	render: function(){
		return(
			<TouchableWithoutFeedback onPress={this.onPressRoom}>
				<View style={[styles.container, styles.wrapper]}>
					<Text style={styles.title}>{this.props.data.room_name}</Text>
					<Text style={styles.location}>{this.props.data.room_location == 'GP' ? 'Global Port' : this.props.data.room_location}</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	},
	onPressRoom: function(){
		this.props.navigator.push({ name: 'newbooking', data: this.props.data, params: this.props.params });
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
		backgroundColor: '#ffffff',
	},
	wrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#e8e8e8'
	},
	title: {
		fontSize: 18,
		color: '#666666',
		marginBottom: 3,
		fontWeight: 'bold'
	},
	location: {
		color: '#adadad'
	}
});