var React = require('react-native');

var {
	ToolbarAndroid,
	AsyncStorage,
	StyleSheet,
} = React;

var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	render: function(){
		return(
			<Icon.ToolbarAndroid
          		navIconName={this.props.navIcon}
            	title={this.props.title}
            	titleColor="#ffffff"
            	style={styles.toolbar}
            	actions={[{title: 'About App', show: 'never'}, {title: 'Settings', show: 'never'}, {title: 'Logout', show: 'never'}]}
            	onActionSelected={this._onActionSelected}
            	onIconClicked={this._onIconClicked}
          	/>
		);	
	},
	_onActionSelected: async function(position){
		var storage;
		switch(position){
			case 0: if(this.props.title!=="About"){
						this.props.navigator.push({name: 'about'});
					}
					break;
			case 2: try{
						await AsyncStorage.removeItem('IS_LOGGED_IN');
						await AsyncStorage.removeItem('FORCE_UPDATE');
						await AsyncStorage.removeItem('MEETING_LIST');
						this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);
					}
					catch(e){
						console.warn('LOG OUT', e);
					}
					break;
		}
	},
	_onIconClicked: function(){
		if(!this.props.isChildView){
			this.props.sidebarRef.refs['DRAWER'].openDrawer();
		}
		else{
			this.props.navigator.pop();	
		}
	}
});

const styles = StyleSheet.create({
	toolbar:{
    	height: 55,
    	backgroundColor: '#2196F3',
  	}	
});