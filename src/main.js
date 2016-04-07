'use strict';
var React = require('react-native');

var {
	AsyncStorage,
	BackAndroid,
	AppRegistry,
	StyleSheet,
	Navigator,
	Image,
	Alert,
	View,
	Text
} = React;

//Get Parse from modules
var Parse = require('parse/react-native');

//Declare top level views
var Splash = require('./views/splash');
var Signin = require('./views/signin');
var Signup = require('./views/signup');
var Home = require('./views/home');
var NewBooking = require('./views/newbooking');
var Success = require('./views/success');
var Failure = require('./views/failure');
var About = require('./views/about');
var ReservationList = require('./views/reservationlist');
var MeetingDetails = require('./views/meetingdetails');

//Registering top level views
var ROUTES = {
	splash: Splash,
	signin: Signin,
	signup: Signup,
	home: Home,
	newbooking: NewBooking,
	success: Success,
	failure: Failure,
	about: About,
	reservationlist: ReservationList,
	meetingdetails: MeetingDetails
};

var _navigator, _route;

module.exports = React.createClass({
	getInitialState: function(){
		return{
			initialRouteName: ''
		}
	},
	componentWillMount: function(){
		//IOT
		Parse.initialize("NOkpPBJHqjpS4QJ2TmUdFf3H9GWLKdP1Bekw2XSU", "cWS2x0pOaBsSFX76JdPYBRw4nDjxOeHhmz05ecXh", "YYyRErjI4Boku76k5RPxRR0IEh3HekLWBkzX5sz7");
		//123456789
		//Parse.initialize("NR9dHycpjgUn0Bcem3lH1q0jniHSiynGh5yKe4Ws", "Z1CBwM16Uaa5D6imGgSFmoKmCdwC76p0V2HMa7ab", "oPTU82hoGomzVFRe1E8r9ZTgB3Q6D2UeYaI9MQmQ");

		this.getInitialRoute().done();
	},
	getInitialRoute: async function(){
		var value;
		try{
			value = await AsyncStorage.getItem('IS_LOGGED_IN');
			if(value !== null){
				this.setState({ initialRouteName: 'home'});
			}
			else{
				this.setState({ initialRouteName: 'splash' });
			}			
		}
		catch(e){
			console.warn('[MAIN] ', e);
		}
	},
    render: function(){
    	if(this.state.initialRouteName === ''){
    		return(
    			<View style={styles.container}>
    			</View>
    		)
    	}
        return(
        	//Render first view through initialRoute
			<Navigator 
				style={styles.container} 
				initialRoute={{ name: this.state.initialRouteName, index: 0 }} 
				renderScene={ this.renderScene } 
				configureScene={ () => { return Navigator.SceneConfigs.PushFromRight; }}
			>
			</Navigator>        	
        )
    },
    renderScene: function(route, navigator){
		
		_navigator = navigator;
		_route = route;

		//ROUTES['signin'] => SignIn
		var Component = ROUTES[route.name]; 
		return (
			<Component 
				route={route} 
				navigator={navigator} 
				data={route.data}
				params={route.params}
			/>
		);    	
    }
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

BackAndroid.addEventListener('hardwareBackPress', () => {

	var flag = false;

	if(_route.name==="newbooking"){
		Alert.alert(
			"Confirmation", 
			"Are you sure you want to cancel?",
            [
              	{text: 'No', onPress: () => console.log('OK Pressed!')},
              	{text: 'Yes', onPress: () => {_navigator.pop();}}
            ]
		);
		return true;
	}
	else{
		flag = true;
	}
	if (_navigator.getCurrentRoutes().length === 1  ) {
    	return false;
  	}
  	if(flag){
  		_navigator.pop();
  		return true;
  	}

});