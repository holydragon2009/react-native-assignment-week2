import React, { Component } from 'react'
import { Button } from 'react-native';

class LoginPage extends Component{

    _onButtonPress = () => {
      this.props.navigator && this.props.navigator.push({id:'SearchPage', passProps: {
        // movie: movie
      }})
    }

    render(){
        return (
            <Button
                title="Login"
                onPress={this._onButtonPress}
            />
        );
    }
}

export default LoginPage