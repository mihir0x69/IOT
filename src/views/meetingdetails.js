'use strict';
var React = require('react-native');
var {
	StyleSheet,
	ScrollView,
	View,
	Text
} = React;

//get libraries
var Moment = require('moment');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');

// var _date = Moment(this.props.item.book_date + this.props.item.book_fromtime, "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("MMMM Do YYYY");
// var _inTime = Moment(this.props.item.book_date + this.props.item.book_fromtime, "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm");
// var _outTime = Moment(this.props.item.book_date + this.props.item.book_totime, "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm");


module.exports = React.createClass({
	render: function(){
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={'arrow-back'}
	        		title={'Meeting'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<ScrollView style={styles.body}>
    				<View style={styles.body}>
    					<View>
	    					<Text style={styles.title}>{this.props.data.title}</Text>
	    					<Text style={styles.description}>{this.props.data.description}</Text>
    					</View>
    					<View style={{marginTop: 20}}>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Room Name</Text>
    							</View>
    							<View style={styles.info}>
    								<Text>{this.props.data.room_name}</Text>
    							</View>
    						</View>    					
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Booking Date</Text>
    							</View>
    							<View style={styles.info}>
    								<Text>{Moment(this.props.data.book_date + " " + this.props.data.book_fromtime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("MMMM Do YYYY")}</Text>
    							</View>
    						</View>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>In Time</Text>
    							</View>
    							<View style={styles.info}>
    								<Text>{Moment(this.props.data.book_date + " " + this.props.data.book_fromtime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm")}</Text>
    							</View>
    						</View>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Out Time</Text>
    							</View>
    							<View style={styles.info}>
    								<Text>{Moment(this.props.data.book_date + " " + this.props.data.book_totime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm")}</Text>
    							</View>
    						</View>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Status</Text>
    							</View>
    							<View style={styles.info}>
    								<Text>{statusToString(this.props.data.status_id)}</Text>
    							</View>
    						</View>    						
    					</View>
    				</View>
    			</ScrollView>
  			</View>
  		);
	}
});

function statusToString(id){
	switch(id){
		case 1: return "Booked";
		case 2: return "Ongoing";
		case 4: return "Cancelled";
		case 5: return "Completed";	
		default:return "Unknown";
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		padding: 10,
		backgroundColor: '#ffffff'
	},	
	title: {
		fontSize: 22,
		fontWeight: 'bold'
	},
	description: {
		marginTop: 2,
		color: '#939393'
	},
	detailWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10
	},
	heading: {
		flex: 1
	},
	info: {
		flex: 2
	},
	bold: {
		fontWeight: 'bold'
	}
});