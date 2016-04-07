var React = require('react-native');

var {
	ToolbarAndroid,
	StyleSheet,
} = React;

module.exports = React.createClass({
	render: function(){
		return(
			<ToolbarAndroid
				navIcon={this.props.navIcon}
            	title={this.props.title}
            	titleColor='#ffffff'
            	style={styles.toolbar}
            	actions={[{title: 'About App', show: 'never'}, {title: 'Settings', show: 'never'}, {title: 'Logout', show: 'never'}]}
            	onActionSelected={this._onActionSelected}
            	onIconClicked={this._onIconClicked}
          	>
          	</ToolbarAndroid>			
		)		
	},
	_onActionSelected: function(position){
		switch(position){
			case 0: this.props.navigator.push({name: 'about'});
					break;
			case 2: this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);			
					break;
		}
	},
	_onIconClicked: function(){
		if(this.props.isChildView){
			this.props.navigator.pop();	
		}
	}
});

const styles = StyleSheet.create({
	toolbar:{
    	height: 55,
    	backgroundColor: '#4FC3F7',
  	}	
});