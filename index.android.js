/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text
} from 'react-native';
import Ranking from './Ranking';

class ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Examples about react-native-ranking</Text>
        <View style={styles.boardRanking}>
          <Ranking score={3.0} num={234} defaultColor="#9ce0d6"/>
          <Ranking score={4.0} num={782343} fontColor="#330099"/>
          <Ranking score={2.45} num={78} activeColor="#2bb8aa"/>
          <Ranking score={4.45} num={234234523478}/>
        </View>
        <View style={styles.starsRanking}>
          <Ranking mode="stars" size="sm" score={4.45}/>
          <Ranking mode="stars" score={4.45} scoreBase={8} defaultColor="#dad9b8"/>
          <Ranking mode="stars" size="lg" score={6.2} scoreBase={10} activeColor="#e4525e"/>
        </View>
        <View style={styles.arcsRanking}>
          <Ranking mode="arcs" score={6.2} scoreBase={10}/>
        </View>
        <View style={styles.simlesRanking}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333333'
  },
  boardRanking: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  starsRanking: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'space-around'
  },
  arcsRanking: {
    flex: 1,
    justifyContent: 'space-around'
  },
  simlesRanking: {
    flex: 1,
    justifyContent: 'space-around'
  }
});

AppRegistry.registerComponent('ranking', () => ranking);
