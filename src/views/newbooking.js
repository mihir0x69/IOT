'use strict';
var React = require('react-native');

var {
  	TouchableHighlight,
  	ProgressBarAndroid,
  	ScrollView,
  	StyleSheet,
  	TextInput,
  	Alert,
  	Image,
  	Text,
  	View
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var Moment = require('moment');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var LoaderImage = require('../../assets/images/rolling.gif');
var BlankImage = require('../../assets/images/1x1.png');
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			title: '',
			description: '',
			errorTitle: '',
			disableSubmit: false,
			buttonColor: '#0288D1',
			loader: BlankImage,
			bookingResult: ''
		}
	},
	render: function(){
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={'arrow-back'}
	        		title={''}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<View style={styles.body} keyboardShouldPersistTaps={true}>
    				<View style={styles.panel} elevation={3}>
    					<Text style={{color: '#ffffff', marginLeft: 2}}>Title</Text>
    					<TextInput
							underlineColorAndroid={'#E1F5FE'} 
							style={styles.inputTitle}
							autoFocus={true}
							autoCapitalize={'words'}
							onChangeText={(text) =>this.setState({title: text, errorTitle: ''})}
    					/>
    					<Text style={styles.errorMessage}>{this.state.errorTitle}</Text>
						<TextInput 
							placeholder={'Description'}
							placeholderTextColor={'#B3E5FC'}
							underlineColorAndroid={'#E1F5FE'}
							style={styles.input}
							autoCapitalize={'sentences'}
							onChangeText={(text) =>this.setState({description: text})}
						>
						</TextInput>

    				</View>
					<View style={{padding: 10}}>
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="label" size={20} color="#939393" />
							</View>
							<View style={styles.info}>
								<Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5, color: '#4b4b4b'}}>Room Name</Text>
								<Text style={{fontSize: 15}}>{this.props.data.room_name}</Text>
							</View>
						</View>
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="event-available" size={20} color="#939393" />
							</View>
							<View style={styles.info}>
								<Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5, color: '#4b4b4b'}}>Booking Date</Text>
								<Text style={{fontSize: 15}}>{Moment(this.props.params.date, "D-M-YYYY").format("MMMM Do YYYY")}</Text>
							</View>
						</View>
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="access-time" size={20} color="#939393" />
							</View>
							<View style={styles.info}>
								<Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5, color: '#4b4b4b'}}>In-Out Time</Text>
								<Text style={{fontSize: 15}}>{Moment(this.props.params.inTime, "H.m").format("H:mm") + " - " + Moment(this.props.params.outTime, "H.m").format("H:mm")}</Text>
							</View>
						</View>
					</View>
					<View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                		<TouchableHighlight 
							underlayColor={'#f5f5f5'} 
							style={styles.buttonTouchable}
							onPress={this.onPressCancel}
						>
							<Text style={[styles.button, styles.gray]}>CANCEL</Text>
						</TouchableHighlight>
						<TouchableHighlight 
							underlayColor={'#f5f5f5'} 
							style={styles.buttonTouchable}
							onPress={this.onPressConfirm}
						>
							<View>
								<Text style={[styles.button, {color: this.state.buttonColor}]}>CONFIRM</Text>
								{this.state.disableSubmit ? this.renderProgressBar() : this.renderBlank() }
							</View>
						</TouchableHighlight>
					</View>
    			</View>
  			</View>
		)
	},
	onPressCancel: function(){
		var _this = this;
		Alert.alert(
			"Confirmation", 
			"Are you sure you want to cancel?",
            [
              	{text: 'No', onPress: () => console.log('OK Pressed!')},
              	{text: 'Yes', onPress: () => _this.props.navigator.pop()}
            ]
		)
	},
	onPressConfirm: function(){

		if(this.state.disableSubmit){
			return;
		}

		if(!this.state.title){
			this.setState({errorTitle: 'You need a cool title!'});
			return;
		}

		var _this = this;
		this.setState({ disableSubmit: true, buttonColor: '#939393', loader: LoaderImage });

		var _bookFromTime = parseFloat(Moment(this.props.params.inTime, "H.m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookToTime = parseFloat(Moment(this.props.params.outTime, "H.m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookDate = Moment(Moment(this.props.params.date).format("D-M-YYYY") + " " + Moment(this.props.params.inTime, "H:m").format("H.m"), "D-M-YYYY H:m").subtract(Moment().utcOffset(), "minutes").format("D-M-YYYY");
		var _roomMacId = this.props.data.room_mac_id;
		var _userId = Parse.User.current().getUsername();
		var _title = this.state.title;
		var _description = this.state.description;
		var _statusId = 1;

		Parse.Cloud.run('bookRoomFromAppCloudFunction', {
			book_fromtime: _bookFromTime,
			book_totime: _bookToTime,
			book_date: _bookDate,
			room_mac_id: _roomMacId,
			user_id: _userId,
			title: _title,
			description: _description,
			status_id: _statusId
		}).then(
			function(result){
				if(result ==="You CANNOT book room"){
					_this.props.navigator.replace({name: 'failure', data: { date: Moment(_bookDate, "D-M-YYYY").format("MMMM Do YYYY"), room: _this.props.data.room_name, loadData: _this.props.params.loadData} });					
				}
				else{
					_this.props.navigator.replace({name: 'success', data: { date: Moment(_bookDate, "D-M-YYYY").format("MMMM Do YYYY"), room: _this.props.data.room_name, loadData: _this.props.params.loadData} });
				}
				console.log("[NEW BOOKING API] Success: "+ JSON.stringify(result, null, 2));
			},
			function(error){
				_this.setState({ disableSubmit: false, buttonColor: '#0288D1', loader: BlankImage });
				console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
			}
		);							
	},
	renderProgressBar: function(){
		return <ProgressBarAndroid color={'#4FC3F7'} styleAttr="Horizontal" />
	},
	renderBlank: function(){
		return <View></View>
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	panel: {
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 55,
		backgroundColor: '#4FC3F7',
	},	
	inputTitle: {
		color: '#ffffff',
		padding: 4,
		height: 62,
		fontSize: 30,
	},
	input: {
		color: '#ffffff',
		padding: 4,
		height: 40,
		marginTop: 10
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
		width: 50,
		paddingLeft: 10
	},
	info: {
		flex: 1
	},
	bold: {
		fontWeight: 'bold'
	},	
	note: {
		color: '#939393',
		fontSize: 12,
		fontStyle: 'italic'
	},
	button: {
		borderRadius: 2,
		marginTop: 5,
		marginRight: 10,
		marginBottom: 5,
		marginLeft: 10,
		fontSize: 15
	},
	buttonTouchable: {
		borderRadius: 2
	},
	blue: {
		color: '#0288D1',
	},
	gray: {
		color: '#5f5f5f',
	},
	errorMessage: {
		color: '#1A237E',
		fontSize: 12,
		marginLeft: 3,
		marginBottom: 10
	},
	loaderImage: {
		width: 13, 
		height: 13, 
		marginTop: 9
	}
});