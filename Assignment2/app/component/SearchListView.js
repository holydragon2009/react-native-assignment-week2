import React, { Component } from 'react';
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
  Button
} from 'react-native';

import ProgressBar from 'react-native-progress/Bar';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const { screenWidth, screenHeight } = Dimensions.get('window');

class SearchListView extends Component {
  
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

    // loadMore(page){
    //   return fetch(this.props.url + '&page=' + page)
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       // console.log('debug load more = ' + JSON.stringify(responseJson));
    //       var newData = this.state.totalData.concat(responseJson.results)
    //       this.setState({
    //         dataSource: ds.cloneWithRows(newData),
    //         screenWidth: screenWidth,
    //         page: responseJson.page,
    //         totalData: newData
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }

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
          console.log(json);
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

    onChangeText = (text) => {
      return new Promise((resolve, reject) => {
          console.log('onChangeText text = ' + text);
          this.onFilter(text);
          resolve();
      });
    }

    onFilter(text){
      let filteredData = []
      for (var i = 0; i < this.state.totalData.length; i++) {
        if(this.isMatching(this.state.totalData[i], text)){
          filteredData.push(this.state.totalData[i]);
        }
      }
      // console.log('filter data = ' + JSON.stringify(filteredData))
      this.setState({
        dataSource: ds.cloneWithRows(filteredData),
      });
    }

    isMatching(item, text){
      var searchText = text.toLowerCase();
      var title = item.title.toLowerCase();
      var desc = item.overview.toLowerCase();
      // console.log('title.match(searchText) = ' + JSON.stringify(title.match(searchText)))
      if(title.match(searchText) || desc.match(searchText)){
        return true
      }
      return false
    }

    onButtonPress = () => {
      this.props.navigator && this.props.navigator.push({id:'MovieGrid', passProps: {
        // movie: movie
      }})
    }

    render() {
      return (
        <View style={{flex:1, flexDirection: 'column', marginTop:20, backgroundColor: '#009588', justifyContent:'space-around'}}>
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
      console.log('Place: ' + JSON.stringify(this.props.movie))
  }

  _onSelectMovie(movie){
    this.setState({selectedMovie: movie});
    this.props.navigator && this.props.navigator.push({id:'MovieDetail', passProps: {
      movie: movie
    }})
  }

  render (){
      // var ment.unix(this.props.movie.timestamp).fromNow();
      // var imageUrl = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + this.props.movie.poster_path
      return (
      <TouchableHighlight 
          onPress={()=>this._onSelectMovie(this.props.movie)}>
          <View style={{flex:1, flexDirection:'row', borderBottomColor: 'black',
                      borderBottomWidth: 1, padding: 10, backgroundColor: '#009588'}}>
          <Image source={{uri: this.props.movie.image_url}} indicator={ProgressBar} 
              style={{width: 120, height: 120, flex: 3}} />
          <View style={{flex: 7}}>
              <Text style={{padding: 10, fontSize: 15, fontWeight: 'bold'}}>{this.props.movie.name}</Text>     
              <Text style={{padding: 10, fontSize: 15, fontWeight: 'bold'}}>{this.props.movie.review_count}</Text>     
              <Text style={{padding: 10}} >{this.props.movie.location.display_address[0]}</Text>
              <Text style={{padding: 10}} >{this.props.movie.location.display_address[1]}</Text>
          </View>
          </View>
      </TouchableHighlight>
      );
  }
}

export default SearchListView