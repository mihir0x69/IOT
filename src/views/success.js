'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	Image,
	View,
	Text
} =  React;

module.exports = React.createClass({
	render: function(){
		return(
			<View style={styles.container}>
				<Image source={require('../../assets/images/success_transparent.gif')} style={styles.successImage} />
				<Text style={{fontWeight: 'bold'}}>SUCCESS</Text>
				<Text>{"We have reserved " + this.props.data.room + " for you on"}</Text>
				<Text>{this.props.data.date}</Text>
				<TouchableHighlight underlayColor={'#e8e8e8'} onPress={this.onDismiss} style={{marginTop: 20}}>
					<Text style={{fontSize: 15, color: '#4FC3F7'}}>Tap to continue</Text>
				</TouchableHighlight>
			</View>
		);
	},
	onDismiss: function(){
		this.props.data.loadData();
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