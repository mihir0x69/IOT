'use strict';
var React = require('react-native');

var {
	TouchableWithoutFeedback,
	InteractionManager,
  	TouchableHighlight,
  	RefreshControl,
  	ScrollView,
  	StyleSheet,
  	Dimensions,
  	ListView,
  	Image,
  	Text,
  	View
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var Icon = require('react-native-vector-icons/MaterialIcons');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var LoadingView = require('../components/loadingview');
var ReloadView = require('../components/reloadview');
var MeetingItem = require('../components/meetingitem');

var timeout;

module.exports = React.createClass({
	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			loaded: false,
			isReloadRequired: false,
			isRefreshing: false,
			isEnabled: false
		}
	},
	componentWillMount: function(){
		InteractionManager.runAfterInteractions(() =>{
			this.loadData();
		})
	},	
	loadData: function(){
		
		clearTimeout(timeout);
		var _this = this;
		this.API();

		//check if data is loaded
		timeout = setTimeout(function(){
			if(_this.isMounted()){
				if(_this.state.loaded===false){
					_this.setState({
						isReloadRequired: true
					})
				}
			}
		}, 10000);
	},
	API: function(){

		var _this = this;
		this.setState({ isReloadRequired: false, loaded: false, isRefreshing: true, isEnabled: false });

		Parse.Cloud.run('fetchBookingListForUserCloudFunction', {
			user_id: Parse.User.current().getUsername()
		}).then(

			function(result){
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

				_this.setState({
					rawData: cleanData,
					dataSource: _this.state.dataSource.cloneWithRows(cleanData),
					loaded: true,
					isReloadRequired: false,
					isRefreshing: false,
					isEnabled: true
				});
			},
			function(error){
				_this.setState({ isReloadRequired: true, loaded: false, isRefreshing: false, isEnabled: true })
				console.log("[HOME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={'arrow-back'}
	        		title={'My Reservations'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
      				<ScrollView
	  					refreshControl={
	  						<RefreshControl 
	        					refreshing={this.state.isRefreshing}
	        					onRefresh={this.loadData}
	        					enabled={this.state.isEnabled}
	        					colors={['#2196F3', '#E91E63', '#FBC02D', '#607D8B']}
							/>
						}      				
      				>
      					{this.state.loaded ? this.renderListView() : this.renderLoadingView()}
      				</ScrollView>
  			</View>
		)
	},
	renderListView: function(){
		if(this.state.rawData.length === 0){
			return(
				<View style={styles.container}>
					<TouchableWithoutFeedback onPress={this.onPressPop}>
		      			<View style={styles.noRecordsFoundScene}>
		      				<View style={styles.centerWeighted}>
		      					<Icon name="error" size={100} color="#cccccc" />
		      					<Text style={styles.errorMessageReload}>You have no meetings.</Text>
		      					<Text>Tap to book.</Text>
		      				</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			);
		}
		return(
			<View style={[styles.container]}>
				<ListView 
					dataSource={this.state.dataSource}
	    			renderRow={this.renderReservation}
	    			style={styles.listView}		    			
	    		/>
    		</View>
		);		
	},
	onPressPop: function(){
		this.props.navigator.pop();
	},
	renderLoadingView: function(){
		if(this.state.isReloadRequired){
			return <ReloadView loadData={this.loadData} />
		}	
		return <LoadingView />
	},
	renderReservation: function(item){
		return <MeetingItem item={item} navigator={this.props.navigator} />
	},
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	listView:{
		flex: 1
	},
	noRecordsFoundScene:{
		flex: 1,
		backgroundColor: '#ffffff',
	},
	centerWeighted: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'		
	},
	reloadArrow: {
		alignSelf: 'center',
		margin: 10,
	},
	errorMessageReload: {
		alignSelf: 'center',
		fontSize: 15
	}
});