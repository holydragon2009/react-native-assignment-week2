import React, { Component } from "react";
import { Button, View, TouchableHighlight, Image, Text, ListView, RefreshControl, Dimensions, Switch } from "react-native";

// import update from 'react-addons-update';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const { screenWidth, screenHeight } = Dimensions.get('window');

class FilterPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
		onTouchBackAction: this.props.onTouchBackAction,
		dataSource: ds.cloneWithRows([]),
		refreshing: false,
		selectedMovie: null,
		totalData: null,
		text: '',
		accessToken: '',
		tokenType: 'Bearer'
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	_initData(data){
		for(let cat of data){
			cat['value'] = false;
		}
		this.setState({
			dataSource: ds.cloneWithRows(data),
			totalData: data,
			screenWidth: screenWidth,
		})
		// this.setState({
		// 	dataSource: ds.cloneWithRows(responseJson),
		// 	screenWidth: screenWidth,
		// 	totalData: responseJson
		// });
	}

	fetchData() {
		return fetch('https://www.yelp.com/developers/documentation/v2/all_category_list/categories.json')
			.then((response) => response.json())
			.then((responseJson) => {
				// console.log('fetchData = ' + JSON.stringify(responseJson));
				this._initData(responseJson)
			})
			.catch((error) => {
				console.error(error);
			});
	}

	onRefresh() {
		this.setState({refreshing: true});
		this.fetchData().then(() => {
			this.setState({refreshing: false});
		});
	}

	renderItem(item, navigator){
		return (
			<Category movie={item} navigator={navigator} />
		);
	}

	onEndReached = () => {
			// alert("onEndReached !!!");
			// this.loadMore();
	}

	_onTouchBack = () => {
		if (this.state.onTouchBackAction) {
			this.state.onTouchBackAction();
		} else {
			this.props.navigator && this.props.navigator.pop();
		}
	};

	render() {
		return (
			<View style={{ backgroundColor: "red"}}>
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
				 <ListView
						enableEmptySections={true}
						dataSource={this.state.dataSource}
						renderRow={(rowData) => this.renderItem(rowData, this.props.navigator)}
						refreshControl={
						<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh.bind(this)}
						/>
						}
						onEndReached={this.onEndReached}
				/>
			</View>
		);
	}
}

class Category extends Component {
  constructor(props){
      super(props)
      console.log('Place: ' + JSON.stringify(this.props.movie))
  }

  _onSelectMovie(movie){
    this.setState({selectedMovie: movie});
    // this.props.navigator && this.props.navigator.push({id:'FilterPage', passProps: {
    //   movie: movie
    // }})
  }

	_onSwitchCategoryValue(value, index){
		// const initialArray = [1, 2, 3];
		// const newArray = update(this.state.totalData, {index: {$set: value}});

		// var newData = this.state.totalData.slice();
		// newData[index].value = value;
		// this.setState({
		// 	dataSource: ds.cloneWithRows(newData),
		// 	totalData: newData
		// });
	}

  render (){
      // var ment.unix(this.://image.tmdb.org/t/p/w600_and_h900_bestv2/" + this.props.movie.poster_path
      return (
      <TouchableHighlight 
          onPress={()=>this._onSelectMovie(this.props.movie)}>
          <View style={{flex:1, flexDirection:'row', borderBottomColor: 'black',
                      borderBottomWidth: 1, padding: 10, backgroundColor: 'white'}}>
              <Text style={{flex:1, marginLeft: 10, marginRight: 10, fontSize: 12, fontWeight: 'bold', color: 'black'}}>{this.props.movie.title}</Text>     
							<Switch
								onValueChange={(value, index) => this._onSwitchCategoryValue(value, index)}
								value={this.props.movie.value} />
          </View>
      </TouchableHighlight>
      );
  }
}

export default FilterPage;
