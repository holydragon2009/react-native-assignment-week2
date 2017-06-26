import React, { Component } from 'react'
import { 
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    Dimensions,
    Alert,
    RefreshControl,
    TouchableHighlight,
    Button,
    StatusBar
} from 'react-native';

import SearchBar from 'react-native-search-bar';
import ProgressBar from 'react-native-progress/Bar';
// import SearchListView from './SearchListView';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const { screenWidth, screenHeight } = Dimensions.get('window');

class SearchPage extends Component{

    constructor(props) {
      super(props);
      this.state = {
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
      if(this.state.accessToken){
        this.fetchData();
      } else {
        this.fetchToken();
      }
    }

    fetchToken() {
      const params = {
        client_id: 'qAT9tub1fVEsYOPrh7jrIg', 
        client_secret: 'h8xR9JKEOlj9lYT0XC5puua2Ho5FPXIXjEPIS38cyu0TnmYoyS9pw5KGPuNcHix0', 
        grant_type: 'client_credentials'
      }
      const request = new Request('https://api.yelp.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        }),
        body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}`
      });
      return fetch(request)
        .then(response => {
          return response.json()
        })
        .then(json => {
        //   console.log(json);
          this.setState({
            accessToken: json.access_token,
            tokenType: json.token_type
          });
          this.fetchData();
          return json; // Token
        });
    }

    fetchData() {
      var keywords = 'bakery'
      var location = 'San Francisco'
      const request = new Request('https://api.yelp.com/v3/businesses/search'
        + `?term=${keywords}&location=${location}`, {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
          'Authorization': this.state.tokenType + ' ' + this.state.accessToken
        }),
      });
      return fetch(request)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log('fetchData = ' + JSON.stringify(responseJson));
          this.setState({
            dataSource: ds.cloneWithRows(responseJson.businesses),
            screenWidth: screenWidth,
            totalData: responseJson.businesses
          });
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
        <Place movie={item} navigator={navigator} />
      );
    }

    onEndReached = () => {
        // alert("onEndReached !!!");
        // this.loadMore();
    }

    _setSearchText(text){
      this.setState({text: text});
      let filteredData = this._filterNotes(text, this.state.totalData);
      this.setState({
        dataSource: ds.cloneWithRows(filteredData),
      });
    }

    _filterNotes(searchText, notes) {
      let newData = notes.slice();
      let filteredData = []
      for (var i = 0; i < newData.length; i++) {
        if(this.isMatching(newData[i], searchText)){
          filteredData.push(newData[i]);
        }
      }
      return filteredData;
    }

    isMatching(item, text){
      var searchText = text.toLowerCase();
      var name = item.name.toLowerCase();
      if(name.match(searchText)){
        return true
      }
      return false
    }

    _onButtonPress = () => {
      this.props.navigator && this.props.navigator.push({id:'FilterPage', passProps: {
        // movie: movie
      }})
    }   

    render(){
        return (
            <View>
                <View style={{height: 20, backgroundColor: 'red'}}>
                    <StatusBar backgroundColor="red" />
                </View>
                <View style={{flexDirection: 'row', backgroundColor: 'red'}}>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={this._onButtonPress}
                        underlayColor='#fff'>
                        <Text style={styles.submitText}>Filter</Text>
                    </TouchableHighlight>
                    <SearchBar
                        ref='searchBar'
                        placeholder='Search'
                        onChangeText={(text) => this._setSearchText(text)}
                        onSearchButtonPress={() => {}}
                        onCancelButtonPress={() => {}}
                        barTintColor='red'
                        textFieldBackgroundColor='white'
                        style={{flex: 1, backgroundColor: 'red'}}
                        />
                </View>
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

class Place extends Component {
  constructor(props){
      super(props)
    //   console.log('Place: ' + JSON.stringify(this.props.movie))
  }

  _onSelectMovie(movie){
    this.setState({selectedMovie: movie});
    // this.props.navigator && this.props.navigator.push({id:'FilterPage', passProps: {
    //   movie: movie
    // }})
  }

  render (){
      // var ment.unix(this.props.movie.timestamp).fromNow();
      // var imageUrl = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + this.props.movie.poster_path
      return (
      <TouchableHighlight 
          onPress={()=>this._onSelectMovie(this.props.movie)}>
          <View style={{flex:1, flexDirection:'row', borderBottomColor: 'black',
                      borderBottomWidth: 1, padding: 10, backgroundColor: 'white'}}>
          <Image source={{uri: this.props.movie.image_url}} indicator={ProgressBar} 
              style={{width: 100, height: 100, flex: 3, borderRadius: 8}} />
          <View style={{flex: 7}}>
              <Text style={{flex:1, marginLeft: 10, marginRight: 10, fontSize: 15, fontWeight: 'bold', color: 'black'}}>{this.props.movie.name}</Text>     
              <Text style={{flex:1, marginLeft: 10, marginRight: 10, fontSize: 11, color: '#5B5B5B'}}>{this.props.movie.review_count + " Reviews"}</Text>     
              <Text style={{flex:1, marginLeft: 10, marginRight: 10, fontSize: 12, fontWeight: 'bold', color: 'black'}} >{this.props.movie.location.display_address[0]}</Text>
              <Text style={{flex:1, marginLeft: 10, marginRight: 10, fontSize: 11, color: '#5B5B5B'}} >{this.props.movie.location.display_address[1]}</Text>
          </View>
          </View>
      </TouchableHighlight>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  mode: {
    marginTop: 10,
    backgroundColor: 'red'
  },
  submit:{
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    marginBottom:10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'red',
    borderRadius:8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText:{
    color:'#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default SearchPage
