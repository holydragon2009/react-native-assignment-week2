import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

import { Navigator } from "react-native-deprecated-custom-components";

import LoginPage from "./LoginPage";
import SearchPage from "./SearchPage";
import FilterPage from "./FilterPage";

export default class MyNavigation extends Component {
    
  constructor() {
    super();
    this.state = {
      movie: null
    };
  }

  render() {
    return (
      <Navigator
        initialRoute={{ id: "LoginPage", title: "LoginPage", index: 0 }}
        avigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => {
                return (
                  index > 0 &&
                  <TouchableHighlight
                    onPress={() => {
                      navigator.pop();
                    }}
                  >
                    <Text style={{ color: "white" }}>{"< Back"} </Text>
                  </TouchableHighlight>
                );
              },

              RightButton: (route, navigator, index, navState) => null,
              Title: (route, navigator, index, navState) => null
            }}
            style={{ backgroundColor: "#459288" }}
          />
        }
        renderScene={(route, navigator) => {
          switch (route.id) {
            case "LoginPage":
              return (
                <LoginPage
                  url={this.props.url}
                  navigator={navigator}
                  {...route.passProps}
                />
              );

            case "SearchPage":
              return (
                <SearchPage
                  url={this.props.url}
                  navigator={navigator}
                  {...route.passProps}
                />
              );

            case "FilterPage":
              return (
                <FilterPage
                  url={this.props.url}
                  navigator={navigator}
                  {...route.passProps}
                />
              );
          }
        }}
      />
    );
  }
}
