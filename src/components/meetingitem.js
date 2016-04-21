'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	View,
	Text
} = React;

//get libraries
var Moment = require('moment');

var colorMap = {
	A: 'f44336',	B: 'E91E63',	C: '9C27B0',	D: '673AB7',
	E: '3F51B5',	F: '2196F3',	G: '03A9F4',	H: '00BCD4',
	I: '009688',	J: '4CAF50',	K: '8BC34A',	L: 'CDDC39',
	M: 'FDD835',	N: 'FFC107',	O: 'FF9800',	P: 'FF5722',
	Q: '795548',	R: '9E9E9E',	S: '607D8B',	T: '673AB7',
	U: '424242',	V: 'A5D6A7',	W: '01579B',	X: '827717',
	Y: '00838F',	Z: '9E9D24'
}, color;

module.exports = React.createClass({
	render: function(){
		if(!(titleCase(this.props.item.title.charAt(0)) in colorMap)){
			color= '#939393'
		}
		else{
			color = '#' + colorMap[titleCase(this.props.item.title.charAt(0))];
		}
		return(
			<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressMeetingItem}>
				<View style={styles.wrapper}>
					<View style={styles.alphabetIcon}>
						<View style={[styles.circle, {backgroundColor: color}]}>
							<Text style={styles.alphabet}>{titleCase(this.props.item.title.charAt(0))}</Text>
						</View>
					</View>
					<View style={styles.titleWrapper}>
						<Text style={styles.title}>{this.props.item.title}</Text>
						<Text style={styles.timestamp}>{Moment(this.props.item.book_date + " " + this.props.item.book_fromtime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("MMMM Do YYYY")}</Text>
					</View>
					{this.statusToString(this.props.item.status_id)}
				</View>
			</TouchableHighlight>
		);
	},
	onPressMeetingItem: function(){
		this.props.navigator.push({name: 'meetingdetails', data: this.props.item, params: {loadData: this.props.data.loadData, refreshList: this.props.data.refreshList}});
	},
	statusToString: function(id){
		var accent;
		switch(id){
			case 1: id="Booked";
					accent="2196F3";
					break;
			case 2: id="Ongoing";
					accent="4CAF50"
					break;
			case 4: id="Cancelled";
					accent="FF5722"
					break;
			case 5: id="Completed";
					accent="607D8B"
					break;
			default:id="Unknown"
					accent="9E9E9E"
					break;

		}
		return(
			<View>
				<View style={[styles.status, {borderColor: '#'+accent, }]}>
					<Text style={{color: '#'+accent}}>{id}</Text>
				</View>
			</View>
		)		
	}
});

function titleCase(string) { return string.toUpperCase(); }

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		flexDirection: 'row'
	},
	title: {
		fontSize: 16,
		color: '#2e2e2e'
	},
	timestamp: {
		color: '#999999',
		marginTop: 3
	},
	alphabetIcon: {
		flex: 1
	},
	titleWrapper: {
		flex: 4
	},
	circle: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	alphabet: {
		fontSize: 22,
		color: '#ffffff'
	},
	status: {
		borderWidth: 1,
		borderRadius: 3, 
		paddingTop: 1, 
		paddingRight: 5, 
		paddingBottom: 2, 
		paddingLeft: 5
	}
});