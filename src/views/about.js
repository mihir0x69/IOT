var React = require('react-native');

var {
	InteractionManager,
	ScrollView,
	StyleSheet,
	Image,
	View,
	Text
} = React;

var ToolbarAfterLoad = require('../components/toolbarAfterLoad');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			aboutImage: {}
		}
	},
	componentWillMount: function(){
		InteractionManager.runAfterInteractions(() =>{
			this.setState({
				aboutImage: require('../../assets/images/about.png')
			})
		});
	},
	render: function(){
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={'arrow-back'}
	        		title={'About'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<ScrollView>
    				<View style={styles.body}>
    					<View style={styles.appInfo}>
    						<Text style={styles.title}>Conference App for Android</Text>
    						<Text style={styles.subtitle}>Version: 0.0.1</Text>
    					</View>
						<View style={styles.companyInfo}>
	    					<Text style={styles.title}>Harbinger Systems Pvt. Ltd.</Text>
	    					<Text style={styles.subtitle}>Tech Incubator</Text>
    					</View>
    				</View>
    			</ScrollView>
				<View style={styles.wrapper}>
					<View style={styles.footer}>
						<Image source={this.state.aboutImage} style={styles.canvas} />
					</View>
				</View>    			
			</View>
		)
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	body: {
		flex: 1,
		padding: 20
	},
	appInfo: {
		marginBottom: 10
	},
	wrapper: {
		flex: 1,
	},
	title: {
		fontSize: 18,
	},
	subtitle: {
		fontStyle: 'italic'
	},
	footer: {
		flex: 1,
		height: 200,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	},
	canvas: {
		flex: 1,
		alignSelf: 'stretch',
    	width: null,
    	position: 'relative'
	}
})