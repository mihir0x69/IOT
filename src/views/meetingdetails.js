'use strict';
var React = require('react-native');
var {
    TouchableHighlight,
    ProgressBarAndroid,
    ToastAndroid,
    ScrollView,
	StyleSheet,
	View,
	Text
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var Moment = require('moment');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            disableSubmit: false
        }
    },
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
    								<Text style={styles.infoText}>{this.props.data.room_name}</Text>
    							</View>
    						</View>
                            <View style={styles.detailWrapper}>
                                <View style={styles.heading}>
                                    <Text style={styles.bold}>Booking Date</Text>
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.infoText}>{Moment(this.props.data.book_date + " " + this.props.data.book_fromtime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("dddd, MMMM Do YYYY")}</Text>
                                </View>
                            </View>                            
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>In Time</Text>
    							</View>
    							<View style={styles.info}>
    								<Text style={styles.infoText}>{Moment(this.props.data.book_date + " " + this.props.data.book_fromtime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm")}</Text>
    							</View>
    						</View>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Out Time</Text>
    							</View>
    							<View style={styles.info}>
    								<Text style={styles.infoText}>{Moment(this.props.data.book_date + " " + this.props.data.book_totime.toFixed(2), "D-M-YYYY H.m").add(Moment().utcOffset(), "minutes").format("H:mm")}</Text>
    							</View>
    						</View>
    						<View style={styles.detailWrapper}>
    							<View style={styles.heading}>
    								<Text style={styles.bold}>Status</Text>
    							</View>
    							<View style={styles.info}>
    								<Text style={styles.infoText}>{statusToString(this.props.data.status_id)}</Text>
    							</View>
    						</View>    						
    					</View>
                        <View style={[styles.container, {alignItems: 'flex-end', marginTop: 10}]}>
                            {this.renderCancelButton(this.props.data.status_id)}
                        </View>
    				</View>
    			</ScrollView>
  			</View>
  		);
	},
    renderCancelButton: function(id){
        if(id===1){
            return(
                <TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressCancel}>
                    <View style={{paddingTop: 5, paddingRight: 10, paddingBottom: 5, paddingLeft: 10}}>
                        <Text style={{color: '#f44336'}}>CANCEL MEETING</Text>
                        {this.state.disableSubmit ? this.renderProgressBar() : this.renderBlank() }
                    </View>
                </TouchableHighlight>
            )
        }
        return(
            <TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressDeny.bind(this, statusToString(id))}>
                <View style={{paddingTop: 5, paddingRight: 10, paddingBottom: 5, paddingLeft: 10}}>
                    <Text style={{color: '#cccccc'}}>CANCEL MEETING</Text>
                </View>
            </TouchableHighlight>
        )
    },
    onPressCancel: function(){
        var _this = this;
        this.setState({ disableSubmit: true })
        Parse.Cloud.run('deleteMyBooking', {
            objectid: _this.props.data.objectId
        }).then(

            function(result){

                // await AsyncStorage.removeItem('FORCE_UPDATE');
                // await AsyncStorage.setItem('FORCE_UPDATE', JSON.stringify(true));
                _this.props.navigator.replace({name: 'cancelsuccess', data: _this.props.params});
            },
            function(error){
                _this.setState({ disableSubmit: false })
                ToastAndroid.show("Something went wrong. Please try later.", ToastAndroid.LONG);
            }
        );
    },
    onPressDeny: function(id){
        ToastAndroid.show(id+" meeting cannot be cancelled.", ToastAndroid.LONG);
    },
    renderProgressBar: function(){
        return <ProgressBarAndroid color={'#f44336'} styleAttr="Horizontal" />
    },
    renderBlank: function(){
        return <View></View>
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
		fontSize: 28,
        color: '#000000',
        marginBottom: 5
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
    infoText: {
    },
	bold: {
		fontWeight: 'bold'
	}
});