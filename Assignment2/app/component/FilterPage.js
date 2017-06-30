import React, { Component } from "react";
import { Button, View, TouchableHighlight, Image, Text, 
	ListView, RefreshControl, Dimensions, Switch, Picker } from "react-native";

import ModalDropdown from 'react-native-modal-dropdown';
// import update from 'react-addons-update';

import { actionCreators } from '../redux/abcRedux'
import { connect } from 'react-redux';
import update from 'react-addons-update';

// const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const ds = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2,
		sectionHeaderHasChanged: (s1, s2) => s1 !== s2
	});
const { screenWidth, screenHeight } = Dimensions.get('window');

class FilterPage extends Component {

	constructor(props) {
		super(props);

		this._updateListData = this._updateListData.bind(this);
		this._onSwitchCategory = this._onSwitchCategory.bind(this);

		this.state = {
			onTouchBackAction: this.props.onTouchBackAction,
			dataSource: ds.cloneWithRowsAndSections([]),
			refreshing: false,
			selectedMovie: null,
			totalData: null,
			text: '',
			accessToken: '',
			tokenType: 'Bearer',
			filterData: null,
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	_initData(data){
		var dataWithSection = {}
		dataWithSection['offer deals'] = [
			{'text': 'Offering a Deal', 'select': false}
		]
		dataWithSection['distance'] = [
			[
				{'text': '1 mile', 'value': 1, 'select': true}, 
				{'text': '5 miles', 'value': 5, 'select': false}, 
				{'text': '10 miles', 'value': 10, 'select': false}, 
				{'text': '15 miles', 'value': 15, 'select': false}, 
				{'text': '20 miles', 'value': 20, 'select': false}, 
				{'text': '25 miles', 'value': 25, 'select': false}, 
			]
		]
		dataWithSection['sort by'] = [
			[
				{'text': 'Best matched', 'value': 0, 'select': true}, 
				{'text': 'Distance', 'value': 1, 'select': false}, 
				{'text': 'Highest Rated', 'value': 2, 'select': false}, 
			]
		]
		for(let cat of data){
			cat['value'] = false;
		}
		dataWithSection['category'] = data

		this.setState({
			dataSource: ds.cloneWithRowsAndSections(dataWithSection),
			totalData: dataWithSection,
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

	renderItem(rowData, sectionID, rowID, navigator){
		return (
			<Category sectionID={sectionID} rowID={rowID} rowData={rowData} 
				navigator={navigator} action={this._updateListData}
				onCategorySwitch={this._onSwitchCategory} />
		);
	}

	renderSectionHeader(sectionData, category){
		return (
			<Text style={{backgroundColor: 'white', color: 'black', fontWeight: 'bold', fontSize: 15, margin: 10}}>{category}</Text>
		);
	}

	onEndReached = () => {
			// alert("onEndReached !!!");
			// this.loadMore();
	}

	_onTouchSearch = () => {
		const {dispatch} = this.props
		dispatch(actionCreators.search(this.state.totalData))

		// this.props.route.callback(args);
		// this.props.navigator && this.props.navigator.push({id:'FilterPage', passProps: {
    //   movie: movie
    // }})
	}

	_onTouchBack = () => {
		if (this.state.onTouchBackAction) {
			this.state.onTouchBackAction();
		} else {
			this.props.navigator && this.props.navigator.pop();
		}
	};

	_updateListData(rowID, cellData){
		// const newData = this.state.totalData.slice();
		// newData[rowID] = cellData;
		// // console.log('_onSwitchCategoryValue value = ' + JSON.stringify(cellData.value) + " - rowID = " + rowID)
		
		// this.setState({
		// 	dataSource: ds.cloneWithRows(newData),
		// 	totalData: newData
		// });
	}

	_cloneTotalData(data){
		return data.slice();
	}

	_onSwitchCategory(newValue, rowID){
		// const newData = this._cloneTotalData(this.state.totalData);
		// newData.category[rowID].value = true
		// this.setState({
		// 	totalData: newData
		// })

		// let newData = this.state.totalData
		// newData.category[rowID].value = value
		// this.setState({
		// 	totalData: newData
		// })

		const newObj = update(this.state.totalData.category, {[rowID] : {value: {$set: true}}});
		this.setState(prevState => ({
			totalData: newObj,
		}));
		console.log(this.state.totalData.category)

		// let newCellData = this.state.rowData
		// newCellData.value = value
		// this.props.action(rowID, newCellData);
	}

	render() {
		return (
			<View style={{ backgroundColor: "red"}}>
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
					<TouchableHighlight onPress={this._onTouchBack}>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Cancel
						</Text>
					</TouchableHighlight>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Filter
						</Text>
					<TouchableHighlight onPress={this._onTouchSearch}>
						<Text style={{ paddingLeft: 10, width: 70, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
							Search
						</Text>
					</TouchableHighlight>
					</View>
				 <ListView
						enableEmptySections={true}
						dataSource={this.state.dataSource}
						renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, sectionID, rowID, this.props.navigator)}
						renderSectionHeader={this.renderSectionHeader}
						refreshControl={
						<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh.bind(this)}
						/>
						}
						onEndReached={this.onEndReached}
						style={{backgroundColor: 'white'}}
				/>
			</View>
		);
	}
}

class Category extends Component {
  constructor(props){
		super(props)
		console.log('sectionID, rowID: ' + this.props.sectionID + '-' + this.props.rowID)
		this.state = {
			rowData: this.props.rowData
		};
  }

  _onSelectMovie(movie){
    this.setState({selectedMovie: movie});
    // this.props.navigator && this.props.navigator.push({id:'FilterPage', passProps: {
    //   movie: movie
    // }})
  }

	_onSwitchCategoryValue(value, rowID){
		let categories = this.state.totalData.category.slice()
		categories[rowID].value = true
		let newData = this.state.totalData
		newData.category = categories
		this.setState({
			totalData: newData
		})

		// let newCellData = this.state.rowData
		// newCellData.value = value
		// this.props.action(rowID, newCellData);
	}

	_onSwitchOfferDeal(value, rowID){
	}

	_renderCategoryRow(){
   	return (
      <TouchableHighlight 
          onPress={()=>this._onSelectMovie(this.props.rowData)}>
          <View style={{flex:1, flexDirection:'row', borderBottomColor: 'black',
                      borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: 'white'}}>
              <Text style={{flex:1, fontSize: 12, color: 'black'}}>{this.props.rowData.title}</Text>     
							<Switch
								onValueChange={(value) => this.props.onCategorySwitch(value, this.props.rowID)}
								value={this.props.rowData.value} />
          </View>
      </TouchableHighlight>
      );
	}

	_onDistanceSelect(index){
		
	}

	_onSortBySelect(index){
		
	}

	_renderOfferDeals(){
		return (
      <TouchableHighlight 
          onPress={()=> {}}>
          <View style={{flex:1, flexDirection:'row', backgroundColor: 'white', marginLeft: 10, marginRight: 10 , padding: 10, borderWidth: 1, borderRadius: 8}}>
              <Text style={{flex: 1, backgroundColor: 'white'}}>
								{this.props.rowData.text}
								</Text>     
							<Switch
								onValueChange={(value) => this._onSwitchOfferDeal(value, this.props.rowID)}
								value={this.props.rowData.select} />
          </View>
      </TouchableHighlight>
      );
	}

	_renderDistance(){
		var options = []
		this.props.rowData.forEach((element) => {
			options.push(element.text)
		});
		return (
			<ModalDropdown options={options} defaultValue='Auto' 
				style={{flex: 1, backgroundColor: 'white', marginLeft: 10, marginRight: 10 , padding: 10, borderWidth: 1, borderRadius: 8}}
				dropdownStyle={{width: 200}}
				onSelect={(index) => this._onDistanceSelect(index)}
				/>
		);
	}

	_renderSortBy(){
		var options = []
		this.props.rowData.forEach((element) => {
			options.push(element.text)
		});
		return (
			<ModalDropdown options={options} defaultValue='Auto' 
				style={{flex: 1, backgroundColor: 'white', marginLeft: 10, marginRight: 10 , padding: 10, borderWidth: 1, borderRadius: 8}}
				dropdownStyle={{width: 200}}
				onSelect={(index) => this._onSortBySelect(index)}
				/>
		);
	}

  render (){
      // var ment.unix(this.://image.tmdb.org/t/p/w600_and_h900_bestv2/" + this.props.movie.poster_path
			if(this.props.sectionID == 'category'){
					return this._renderCategoryRow();
			} else if(this.props.sectionID == 'offer deals'){
					return this._renderOfferDeals();
			} else if(this.props.sectionID == 'distance'){
					return this._renderDistance();
			} else {
					return this._renderSortBy();
			}
  }
}

const mapStateToProps = (state) => ({
  filter_data: state.filter_data,
})


// export default FilterPage;
export default connect(mapStateToProps)(FilterPage)