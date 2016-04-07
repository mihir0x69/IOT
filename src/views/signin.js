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

var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('../components/button');
var Parse = require('parse/react-native').Parse;
var interval;


module.exports = React.createClass({

	getInitialState: function(){
		return{
			username: '',
			password: '',
			currentPhrase: '',
			phraseColor: '#ffffff',
			interactionDisabled: false
		}
	},
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Icon name="gamepad" size={50} color="#ffffff" />
					<Text style={styles.title}>conference</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.inputDescriptor}>username</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						keyboardType={'email-address'}
						underlineColorAndroid={'#E1F5FE'}
						onChangeText={(text) => this.setState({username: text, currentPhrase: ''})}
					/>
					<Text style={styles.inputDescriptor}>password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#E1F5FE'}
						onChangeText={(text) =>this.setState({password: text, currentPhrase: ''})}
					/>
					<Button 
					 	text={'LOGIN'} 
					 	onPressColor={'#42A5F5'}
					 	onRelaxColor={'#0288D1'} 
					 	onPress={this.onLoginPress}
					/>
					<Text 
					 	style={styles.signupMessage} 
					 	onPress={this.onSignupPress}
					>
						Don't have an account? Sign up!
					</Text>
					<Text style={[styles.message, {color: this.state.phraseColor}]}>{this.state.currentPhrase}</Text>
				</View>
			</View>
		)
	},
	onLoginPress: function(){

		var _this = this;

		if(this.state.interactionDisabled){
			return;
		}
		if(this.state.username===""){
			return this.setState({
				currentPhrase: 'Username is missing.',
				phraseColor: '#1A237E'
			});
		}
		if(this.state.password===""){
			return this.setState({
				currentPhrase: 'Password is missing.',
				phraseColor: '#1A237E'
			});
		}
		if(this.isMounted()){
			this.setState({ currentPhrase: 'Loading...', phraseColor: '#ffffff', interactionDisabled: true });
		}
		this.setRandomMessage();

		Parse.User.logIn(this.state.username, this.state.password, {
			success: async function(user){ 

				clearInterval(interval);
				if(_this.isMounted()){
					_this.setState({
						currentPhrase: '',
						interactionDisabled: false
					});
				}
				console.log(user);
				try{
					await AsyncStorage.setItem('IS_LOGGED_IN', 'SECRET_KEY');
					_this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
				}
				catch(e){
					console.warn('[SIGN IN]', e);
				}
			},
			error: (data, error) => {
				console.log(data, error);
				var errorText;

				switch(error.code){
					case 101: 	errorText="Invalid username or password."
								break;
					case 100: 	errorText="Unable to connect to the internet."
								break;
					default : 	errorText="Something went wrong."
								break;
				}
				clearInterval(interval);
				if(_this.isMounted()){
					_this.setState({
						currentPhrase: errorText,
						phraseColor: '#1A237E',
						interactionDisabled: false
					});
				}
			}
		});
		setTimeout(function(){
			if(_this.state.interactionDisabled === true){
				clearInterval(interval);
				if(_this.isMounted()){
					_this.setState({
						currentPhrase: 'Something went wrong. Please try again.',
						phraseColor: '#1A237E',
						interactionDisabled: false
					})
				}
			}
		}, 10000);
	},
	onSignupPress: function(){
		if(!this.state.interactionDisabled){
			this.props.navigator.push({name: 'signup'});
		}
	},
	setRandomMessage: function(){
		var _this = this;
		var phrases = [
			"Calculating meaning of life", 
			"Moving satellite into position", 
			"Fighting the dragons", 
			"Queueing bird songs", 
			"Coloring flowers",
			"Almost there",
			"Contemplating life events",
			"Counting backwards from infinity",
			"Generating next funny line",
			"Spinning up the hamster",
			"Shovelling coal into the server",
			"We're testing your patience",
			"Why don't you order a sandwich?",
			"Get a coffee or something",
			"The bits are flowing slowly today",
			"Warming up Large Hadron Collider",
			"Warming up the processors",
			"Going the distance",
			"Releasing hamsters",
			"Keep smiling"
		]
		interval = setInterval(function(){
			if(_this.isMounted()){
				_this.setState({ currentPhrase: phrases[Math.floor(Math.random()*phrases.length)] })
			}
		}, 1500);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#4FC3F7'
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
		color: '#ffffff',
		fontSize: 30,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 22,
		color: '#ffffff',
		marginBottom: 20,
		textAlign: 'center'
	},
	inputDescriptor: {
		color: '#ffffff',
		alignSelf: 'center'
	},
	signupMessage: {
		color: '#ffffff',
		alignSelf: 'center',
		margin: 25,
	},
	message: {
		alignSelf: 'center'
	},
});