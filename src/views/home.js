'use strict';
var React = require('react-native');

var {
  	DrawerLayoutAndroid,
  	TouchableHighlight,
  	TimePickerAndroid,
  	DatePickerAndroid,
  	RefreshControl,
  	AsyncStorage,
  	ToastAndroid,
  	ScrollView,
  	StyleSheet,
  	Dimensions,
  	TextInput,
  	ListView,
  	AppState,
  	Alert,
  	Image,
  	Text,
  	View
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var MomentTZ = require('moment-timezone');
var TimerMixin = require('react-timer-mixin');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var LoadingView = require('../components/loadingview');
var ReloadView = require('../components/reloadview');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Room = require('../components/room');

//get device dimensions
const {height, width} = Dimensions.get('window');
var timeout, timer, current;

module.exports = React.createClass({

	mixins: [TimerMixin],
	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: false,
			isReloadRequired: false,
			isEnabled: false,
			isRefreshing: false,
			serverTime: MomentTZ(),
			selectedDate: MomentTZ(),
			selectedInTime: MomentTZ(),
			selectedOutTime: MomentTZ().add(30, "minutes"),
			interactionDisabled: true,
			currentAppState: ''
		}
	},
	componentWillMount: function(){
		this.initEpoch();
	},
	componentDidMount: function(){
		AppState.addEventListener('change', this._handleAppStateChange);
	},
	_handleAppStateChange: function(currentAppState) {
  		this.setState({ currentAppState: currentAppState });
  		if(this.state.currentAppState === "active"){
  			this.initEpoch();
  		}
	},
	initEpoch: function(){

		//clear previous background timer
		this.clearInterval(timer);

		var _this = this;
		this.setState({ isReloadRequired: false, loaded: false, isEnabled: false, isRefreshing: true, interactionDisabled: true });

		Parse.Cloud.run('giveNextMeetingSlot', {})
		.then(

			function(result){

				//get server time
				//var _serverTime = MomentTZ(MomentTZ.tz(new Date("Mon Apr 18 2016 22:59:40 GMT+0530 (IST)"), "Asia/Kolkata")); 
				var _serverTime = MomentTZ(MomentTZ.tz(new Date(result), "Asia/Kolkata")); 

				//round in-time to next slot
				var _selectedInTime = MomentTZ(_serverTime);
				_selectedInTime = MomentTZ(roundInTime(_selectedInTime));
				
				//adjust out time accordingly
				var _selectedOutTime = MomentTZ(_selectedInTime);
				_selectedOutTime.add(30, "minutes");


				//inject
				_this.setState({
					serverTime: _serverTime,
					selectedDate: _serverTime,
					selectedInTime: _selectedInTime,
					selectedOutTime: _selectedOutTime
				});

				//initial load
				_this.loadData();

				//background timer
				timer = _this.setInterval(function(){

					var _inTime, _outTime, _minutes;

					// server time++
					_this.setState({ serverTime: MomentTZ(_this.state.serverTime.add(1, "seconds")) });

					//get minutes
					_minutes = _this.state.serverTime.minutes();

					//if server time exceeds 30 minutes or hour changes
					if(( _minutes === 0 || _minutes === 30) && (_this.state.serverTime.seconds() === 0)){

						//round and set in time
						_inTime = MomentTZ(_this.state.serverTime);
						_inTime = MomentTZ(roundInTime(_inTime));

						//adjust and set out time
						_outTime = MomentTZ(_inTime);
						_outTime.add(30, "minutes");

						//inject
						_this.setState({
							interactionDisabled: true,
							selectedDate: MomentTZ(_this.state.serverTime),
							selectedInTime: _inTime,
							selectedOutTime: _outTime
						});

						//update rooms
						_this.loadData();
					}
				}, 1000);
			},
			function(error){
				console.warn("[HOME TIME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},	
	loadData: function(){
		
		this.clearTimeout(timeout);
		var _this = this;
		this.API();

		//check if data is loaded
		timeout = this.setTimeout(function(){
			if(_this.isMounted()){
				if(_this.state.loaded===false){
					_this.setState({
						isRefreshing: false,
						isEnabled: true,
						isReloadRequired: true
					})
				}
			}
		}, 10000);
	},
	API: function(){

		var _this = this;

		var _bookFromTime = parseFloat(MomentTZ(this.state.selectedInTime, "H:m").subtract(MomentTZ().utcOffset(), "minutes").format("H.m"));
		var _bookToTime = parseFloat(MomentTZ(this.state.selectedOutTime, "H:m").subtract(MomentTZ().utcOffset(), "minutes").format("H.m"));
		var _bookDate = MomentTZ(MomentTZ(this.state.selectedDate).format("D-M-YYYY") + " " + MomentTZ(this.state.selectedInTime, "H:m").format("H.m"), "D-M-YYYY H:m").subtract(MomentTZ().utcOffset(), "minutes").format("D-M-YYYY");

		this.setState({ isReloadRequired: false, loaded: false, isEnabled: false, isRefreshing: true });

		Parse.Cloud.run('checkAvailibilityOfRooms', {
			bookdate: _bookDate,
			reqfromtime: _bookFromTime,
			reqtotime: _bookToTime
		}).then(

			function(result){
				
				//Convert ParseObject to JSON; then push into an array.
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					if(result[i].toJSON().room_name !== undefined && result[i].toJSON().room_name !== ""){
						cleanData.push(result[i].toJSON());
					}
				}

				console.log("[HOME API] Success: ", cleanData);

				_this.setState({ 
					rawData: cleanData,
					dataSource: _this.state.dataSource.cloneWithRows(cleanData),
					loaded: true,
					isReloadRequired: false,
					isEnabled: true,
					isRefreshing: false,
					interactionDisabled: false
				});
			},
			function(error){
				_this.setState({ isReloadRequired: true, loaded: false, isEnabled: true, isRefreshing: false, interactionDisabled: false });
				console.log("[HOME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){

		return(
      		<DrawerLayoutAndroid
        		drawerWidth={width-60}
        		drawerPosition={DrawerLayoutAndroid.positions.Left}
        		renderNavigationView={this.renderNavigationView}
        		ref={'DRAWER'}
      		>
        		<View style={styles.container}>
	          		<ToolbarAfterLoad
	          			navIcon={'menu'}
    	        		title={'Dashboard'}
        	    		navigator={this.props.navigator}
            			sidebarRef={this}
            			isChildView={false}
          			/>
	        			<View style={styles.body}>
	        				<View style={styles.panel} elevation={3}>
	        					<View style={styles.leftSection}>
	        						<TouchableHighlight 
	        							onPress={this.onPressChangeDate.bind(this, { date: new Date(this.state.selectedDate.format("YYYY-MM-DD")), minDate: this.state.serverTime.toDate() })}
	        							underlayColor={'#1E88E5'}
	        						>
		        						<View style={styles.dateWrapper}>
		        							<View style={styles.date}>
		        								<Text style={styles.dateNumber}>
		        									{this.state.selectedDate.format("D")}
		        								</Text>
		        							</View>
		        							<View style={styles.stackItems}>
				        						<Text style={styles.dayText}>
				        							{this.state.selectedDate.format("dddd")}
				        						</Text>
				        						<Text style={styles.monthYearText}>
				        							{this.state.selectedDate.format("MMM YYYY")}
				        						</Text>        							
		        							</View>
		        						</View>
	        						</TouchableHighlight>
	        					</View>
	        					<View style={styles.rightSection}>
	        						<View style={[styles.stackItems, {padding: 10}]}>
	        							<View style={{flexDirection: 'row'}}>
    										<Text style={styles.dayText}>In-Out Time </Text>
    										<TouchableHighlight 
    											onPress={this.onPressHelp}
    											underlayColor={'#1E88E5'}
    										>
    											<Icon name="help-outline" size={16} color="#ffffff" style={{marginTop: 1}} />
    										</TouchableHighlight>
    									</View>
		        						<View style={styles.inOutTimeWrapper}>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "IN", {hour: this._parseHour(this.state.selectedInTime), minute: this._parseMinute(this.state.selectedInTime)})}
		        								underlayColor={'#1E88E5'}
		        							>
		        								<Text style={styles.monthYearText}>
		        									{this.state.selectedInTime.format("HH:mm")}
		        								</Text>
		        							</TouchableHighlight>
		        							<Text style={styles.monthYearText}> - </Text>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "OUT", {hour: this._parseHour(this.state.selectedOutTime), minute: this._parseMinute(this.state.selectedOutTime)})}
		        								underlayColor={'#1E88E5'}
		        							>
		        								<Text style={styles.monthYearText}>
		        									{this.state.selectedOutTime.format("HH:mm")}
		        								</Text>
											</TouchableHighlight>
		        						</View>
		        					</View>
	        					</View>
	        				</View>
							<ScrollView
								refreshControl={
									<RefreshControl 
				                		refreshing={this.state.isRefreshing}
				                		onRefresh={this.loadData}
				                		colors={['#2196F3', '#E91E63', '#FBC02D', '#7B1FA2', '#607D8B', '#29B6F6', '#CDDC39']}
									/>
				            	}
		            			contentContainerStyle={styles.container}
          					>
		        				<View style={styles.body}>
		        					{ this.state.loaded ? this.renderListView() : this.renderLoadingView() }
		        				</View>
	        				</ScrollView>
	        			</View>
      			</View>
      		</DrawerLayoutAndroid>
    	);
	},
	renderLoadingView: function(){
		if(this.state.isReloadRequired){
			return <ReloadView loadData={this.loadData} />
		}		
		return <LoadingView />
	},
	renderListView: function(){
		if(this.state.rawData.length > 0){
			return(
				<View style={styles.container}>
					<View style={styles.listViewTitle}>
						<Text style={{marginTop: 2}}>AVAILABLE ROOMS</Text>
					</View>
					<ListView 
						dataSource={this.state.dataSource}
						renderRow={this.renderRoom}
						style={styles.listView}
						initialListSize={7}
					/>
				</View>
			);
		}
		return(
			<View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
				<Text>No luck. Perhaps, try a different time slot?</Text>
				<Text>Or pull down to refresh list.</Text>
			</View>		
		);		

	},
	renderRoom: function(room){
		return(
			<Room data={room} params={{date: this.state.selectedDate, inTime: this.state.selectedInTime, outTime: this.state.selectedOutTime, loadData: this.loadData }} navigator={this.props.navigator} />
		)
	},
	renderNavigationView: function(){
	    return(
			<View style={[styles.container, {backgroundColor: '#ffffff'}]}>
				<View style={styles.sidebarHeader}>
					<Image source={require('../../assets/images/backdrop2.png')} style={styles.canvas} />
				</View>
				<View style={styles.sidebarBody}>
					<TouchableHighlight style={{backgroundColor: '#f5f5f5'}} underlayColor={'#f5f5f5'}>
						<View style={styles.sidebarItem}>
							<Icon name="home" size={24} color="#000000" />
							<Text style={styles.sidebarItemtext}>Dashboard</Text>
						</View>
					</TouchableHighlight>				
					<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressReservationList}>
						<View style={styles.sidebarItem}>
							<Icon name="reorder" size={24} color="#999999" />
							<Text style={styles.sidebarItemtext}>My Reservations</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressAboutApp}>
						<View style={styles.sidebarItem}>
							<Icon name="info-outline" size={24} color="#999999" />
							<Text style={styles.sidebarItemtext}>About App</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressLogout}>
						<View style={styles.sidebarItem}>
							<Icon name="input" size={22} color="#999999" />
							<Text style={styles.sidebarItemtext}>Logout</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
	    );
	},
	onPressChangeDate: async function(options){
		var _selectedInTime, _selectedOutTime;
		if(this.state.interactionDisabled){
			ToastAndroid.show('Please wait. Adjusting to the local time.', ToastAndroid.LONG);
			return;
		}
		const {action, year, month, day} = await DatePickerAndroid.open(options);
		if (action === DatePickerAndroid.dismissedAction) {
			return;
		}
		var dateString = year + "-" + ((month+1)<10 ? "0"+(month+1) : month+1) + "-" + (day < 10 ? "0"+day : day);
		var date = new Date(dateString);
		this.setState({ selectedDate: MomentTZ(date) });

		//prevent backdoor changes
		if((MomentTZ(MomentTZ(this.state.serverDate).format("YYYY MM DD"), "YYYY MM DD").isSame(MomentTZ(MomentTZ(this.state.selectedDate).format("YYYY MM DD"), "YYYY MM DD")))){
			//round in-time to next slot
			_selectedInTime = MomentTZ(this.state.serverTime);
			_selectedInTime = MomentTZ(roundInTime(_selectedInTime));
			
			//adjust out time accordingly
			_selectedOutTime = MomentTZ(_selectedInTime);
			_selectedOutTime.add(30, "minutes");

			this.setState({
				selectedInTime: _selectedInTime,
				selectedOutTime: _selectedOutTime
			})
		}

		//refresh rooms
		this.loadData();
	},
	onPressChangeInOutTime: async function(mode, options){
		if(this.state.interactionDisabled){
			ToastAndroid.show('Please wait. Adjusting to the local time.', ToastAndroid.LONG);
			return;
		}		
		var {action, minute, hour} = await TimePickerAndroid.open(options);
		var isTimeAdjusted = false, previousTime;

		if(!(action === TimePickerAndroid.timeSetAction)){
			return;
		}

		if(minute>0 && minute<30){
			minute=30;
			isTimeAdjusted = true;
		}
		else if(minute>30){
			
			minute=0;
			
			if(hour===23){
				hour=0;
			}
			else{
				hour++;
			}
			isTimeAdjusted = true;
		}

		switch(mode){
			case "IN":
				previousTime = this.state.selectedInTime;
				this.setState({ selectedInTime: MomentTZ(hour + ":" + minute, "H:m") });

				if(!(MomentTZ(this.state.serverDate).isBefore(MomentTZ(this.state.selectedDate)))){
					if(Date.parse('01/01/2011 ' + MomentTZ(this.state.selectedInTime).format("H:m") + ":0") <= Date.parse('01/01/2011 ' + MomentTZ(this.state.serverTime).format("H:m") + ":0")){
						this.setState({selectedInTime: previousTime});
						ToastAndroid.show('Invalid in-time', ToastAndroid.LONG);
						break;
					}
				}

				this.setState({ selectedOutTime: MomentTZ(MomentTZ(hour + ":" + minute, "H:m").add(30, "minutes"))})
				// if((Date.parse('01/01/2011 ' + MomentTZ(hour + ":" + minute, "H:m").format("H:m") + "0") >= Date.parse('01/01/2011 ' + MomentTZ(this.state.selectedOutTime).format("H:m") + "0")) && MomentTZ(this.state.selectedOutTime).format("H:m") !== "0:0"){
				// 	ToastAndroid.show('Your in-time should be less than out-time', ToastAndroid.LONG);
				// 	break;
				// }
				if(isTimeAdjusted){
					ToastAndroid.show('Your in-time was adjusted to '+MomentTZ(hour + ":" + minute, "H:m").format("H:mm"), ToastAndroid.LONG);
				}
				this.loadData();
				break;

			case "OUT":
				previousTime = this.state.selectedOutTime;
				this.setState({ selectedOutTime: MomentTZ(hour + ":" + minute, "H:m") });
				
				if((Date.parse('01/01/2011 ' + MomentTZ(this.state.selectedInTime).format("H:m") + ":0") >= Date.parse('01/01/2011 ' + MomentTZ(hour + ":" + minute, "H:m").format("H:m") + ":0")) && hour + ":" + minute !== "0:0"){
					ToastAndroid.show('Your in-time should be less than out-time', ToastAndroid.LONG);
					this.setState({selectedOutTime: previousTime});
					break;				
				}
				if(isTimeAdjusted){
					ToastAndroid.show('Your out-time was adjusted to '+MomentTZ(hour + ":" + minute, "H:m").format("H:mm"), ToastAndroid.LONG);
				}
				this.loadData();
				break;
		}		
	},
	onPressHelp: function(){
		var _this = this;
		Alert.alert(
			"What's wrong with the time?",
			"We use 24-hour format. And your time is automatically adjusted to the nearest half-hour slot.",
            [
              	{text: 'OK', onPress: () => console.log('Cancel Pressed!')}
            ]
		);		
	},	
	onPressReservationList: function(){
		this.refs['DRAWER'].closeDrawer();
		this.props.navigator.push({ name: 'reservationlist', data: this.loadData });
	},
	onPressAboutApp: function(){
		this.refs['DRAWER'].closeDrawer();
		this.props.navigator.push({ name: 'about' });
	},	
	onPressLogout: async function(){
		var keys = ['IS_LOGGED_IN', 'FORCE_UPDATE', 'MEETING_LIST'];

		this.refs['DRAWER'].closeDrawer();

		try{
			await AsyncStorage.multiRemove(keys, (error)=>{
				console.log(error);
			});
			this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);
		}
		catch(e){
			console.log('LOG OUT', e);
		}
	},
	_parseHour: function(time){
		time = time.format("H:m");
		return parseInt(time.slice(0, time.indexOf(":")));
	},
	_parseMinute: function(time){
		time = time.format("H:m");
		return parseInt(time.substr(time.indexOf(":") + 1));
	},
});

function roundInTime(time){
	if(time.minutes()>0 && time.minutes()<30){
		time.minutes(30);
	}
	else{
		time.minutes(0).add(1, "hours");
	}
	return time;
}

function roundToNextSlot(start){
	var ROUNDING = 30 * 60 * 1000; /*ms*/
	start = MomentTZ(Math.ceil((+start) / ROUNDING) * ROUNDING);
	return start;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	listView: {
		flex: 1
	},
	listViewTitle: {
		padding: 16,
		backgroundColor: '#eeeeee'
	},
	canvas: {
		flex: 1,
		alignSelf: 'stretch',
    	width: null,
    	position: 'relative'
	},
	sidebarHeader: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	sidebarBody: {
		flex: 2,
		marginTop: 15,
		backgroundColor: '#ffffff'
	},
	sidebarItem: {
		margin: 13,
		flexDirection: 'row'
	},
	sidebarItemtext: {
		fontSize: 15,
		marginLeft: 20,
		marginTop: 1.5,
		color: '#111111'
	},
	sidebarItemtextActive: {
		fontSize: 15,
		marginLeft: 20,
		marginTop: 1.5,
		color: '#000000'
	},	
	panel: {
		padding: 10,
		backgroundColor: '#2196F3',
		flexDirection: 'row'
	},
	leftSection: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateWrapper: {
		flexDirection: 'row',
		padding: 10
	},
	dayText: {
		fontSize: 15,
		color: '#ffffff'
	},
	dateNumber: {
		fontSize: 30,
		color: '#2196F3'
	},
	stackItems: {
		paddingLeft: 10,
		marginTop: 2
	},
	monthYearText: {
		fontSize: 20,
		color: '#ffffff'
	},
	rightSection: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'		
	},
	inOutTimeWrapper: {
		flexDirection: 'row'
	},
	time: {
		fontSize: 25,
		color: '#ffffff'
	},
	date: {
		width: 50,
		height: 50,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff',
	}
});