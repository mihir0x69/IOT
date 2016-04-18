'use strict';
var React = require('react-native');

var {
	AsyncStorage,
	StyleSheet,
	TextInput,
	Image,
	View,
	Text
} = React;

//get libraries
var Icon = require('react-native-vector-icons/MaterialIcons')
var Parse = require('parse/react-native').Parse;
var dismissKeyboard = require('react-native-dismiss-keyboard');
var TimerMixin = require('react-timer-mixin');

//get components
var Button = require('../components/button');

module.exports = React.createClass({

	mixins: [TimerMixin],
	getInitialState: function(){
		return{
			username: '',
			password: '',
			passwordConfirmation: '',
			message: '',
			messageColor: '#cccccc',
			interactionDisabled: false
		}
	},
	render: function(){
		return(
			<View style={styles.container}>
				<View style={styles.header}>
					<Icon name="account-circle" size={50} color="#0288D1" />
					<Text style={styles.title}>quick sign up</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.inputDescriptor}>You'll need a username</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						keyboardType={'email-address'}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) => this.setState({username: text, message: ''})}
					 />
					 <Text style={styles.inputDescriptor}>And a password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) =>this.setState({password: text, message: ''})}
					 />
					 <Text style={styles.inputDescriptor}>Confirm password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) =>this.setState({passwordConfirmation: text, message: ''})}
					 />
					 <Button 
					 	text={'SIGN UP'} 
					 	onPressColor={'#1565C0'}
					 	onRelaxColor={'#0288D1'} 
					 	onPress={this.onSignupPress}
					 />
					 <Text style={[styles.message, {color: this.state.messageColor}]}>{this.state.message}</Text>
				</View>
			</View>
		)
	},
	onSignupPress: function(){

		dismissKeyboard();
		if(this.state.interactionDisabled){
			return;
		}
		var _this=this;
		if(this.state.username.trim()===""){
			return this.setState({
				message: 'Username is mandatory',
				messageColor: '#e53935'
			});
		}
		if(this.state.password.trim()===""){
			return this.setState({
				message: 'You need a password!',
				messageColor: '#e53935'
			});
		}		
		if(this.state.passwordConfirmation.trim()===""){
			return this.setState({
				message: 'Please confirm your password',
				messageColor: '#e53935'
			});
		}
		if(this.state.password.trim() !== this.state.passwordConfirmation.trim()){
			return this.setState({
				message: 'Passwords do not match. Please try again.',
				messageColor: '#e53935'
			});
		}

		Parse.User.logOut();

		var user = new Parse.User();
		user.set('username', this.state.username.trim());
		user.set('password', this.state.password.trim());

		console.log('calling api...');

		this.setState({ interactionDisabled: true, message: 'Just a moment...', messageColor: '#cccccc' })
		user.signUp(null, {
			success: async function(user){ 
				var keys = ['IS_LOGGED_IN', 'FORCE_UPDATE', 'MEETING_LIST'];
				var cleanData = [];
				try{
					await AsyncStorage.multiRemove(keys, (error)=>{
						console.log(error);
					});
					await AsyncStorage.setItem('IS_LOGGED_IN', 'SECRET_KEY');
					await AsyncStorage.setItem('MEETING_LIST', JSON.stringify(cleanData));
				}
				catch(e){
					console.log(e);
				}

				console.log(user);
				_this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]); 
			},
			error: function(user, error){ 

				var errorText;
				switch(error.code){
					case 101: 	errorText="Invalid username or password.";
								break;
					case 100: 	errorText="Unable to connect to the internet.";
								break;
					case 202: 	errorText="\""+_this.state.username+"\" has already been taken";
								break;
					default : 	errorText="Something went wrong.";
								break;
				}
				console.log(error);
				_this.setState({ interactionDisabled: false, message: errorText, messageColor: '#e53935' });
			}
		});
		this.setTimeout(function(){
			if(_this.state.interactionDisabled === true){
				_this.setState({
					message: 'Something went wrong. Please try again.',
					messageColor: '#e53935',
					interactionDisabled: false
				})
			}
		}, 10000);		
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#ffffff'
	},
	header: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flex: 2,
	},
	footer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 20
	},
	title: {
		color: '#0288D1',
		fontSize: 30,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 22,
		marginBottom: 20,
		textAlign: 'center'
	},
	inputDescriptor: {
		color: '#444444',
		alignSelf: 'center'
	},
	signupMessage: {
		color: '#ffffff',
		alignSelf: 'center',
		margin: 20,
	},
	message: {
		alignSelf: 'center',
		margin: 10
	}
});