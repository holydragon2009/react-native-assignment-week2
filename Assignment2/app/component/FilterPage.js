import React, { Component } from "react";
import { Button, View, TouchableHighlight, Image, Text } from "react-native";

class FilterPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
		selectedMovie: this.props.movie,
		onTouchBackAction: this.props.onTouchBackAction
		};
	}

	_onButtonPress = () => {};

	_onTouchBack = () => {
		if (this.state.onTouchBackAction) {
			this.state.onTouchBackAction();
		} else {
			this.props.navigator && this.props.navigator.pop();
		}
	};

	render() {
		return (
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 64,
					backgroundColor: "red"
				}}
			>
				<TouchableHighlight onPress={this._onTouchBack}>
					<View
						style={{
							marginTop: 20,
							height: 44,
							flex: 0,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Cancel
						</Text>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Filter
						</Text>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Search
						</Text>
					</View>
				</TouchableHighlight>
			</View>
		);
	}
}

export default FilterPage;
