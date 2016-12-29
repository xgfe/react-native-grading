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
  ScrollView,
  Text
} from 'react-native';
import Ranking from './Ranking';

class ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {
        num: 1204,
        score: 4.5
      },
      arcs: {
        score: 8.4
      },
      stars: {
        score: 6.0
      },
      smiles: {
        isLike: true
      }
    };
    this.changeBoardScore = this.changeBoardScore.bind(this);
    this.changeStarScore = this.changeStarScore.bind(this);
    this.changeArcScore = this.changeArcScore.bind(this);
    this.changeSmileScore = this.changeSmileScore.bind(this);
  }
  changeBoardScore(score) {
    this.setState({
      num: this.state.num + 1,
      score: (this.state.score * this.state.num) / (this.state.num + 1)
    });
  }
  changeStarScore(score) {
    this.setState({
      stars: {score: score}
    });
  }
  changeArcScore(score) {

  }
  changeSmileScore(score) {
    this.setState({
      smiles: {isLike: score}
    });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>Examples about react-native-ranking</Text>
        <View style={styles.boardRanking}>
          <Ranking
            score={this.state.board.score}
            num={this.state.board.num}
            defaultColor="#9ce0d6"
            onScore={this.changeBoardScore}
            />
          <Ranking score={4.0} num={72346} fontColor="#552da6"/>
          <Ranking score={2.45} num={712338} activeColor="#2bb8aa"/>
          <Ranking
            score={this.state.board.score}
            num={234234523478}
            />
        </View>
        <View style={styles.starsRanking}>
          <Ranking mode="stars" score={4.45} status={2}/>
          <Ranking
            mode="stars"
            scale={2}
            score={4}
            scoreBase={8}
            defaultColor="#dad9b8"
            status={1}/>
          <Ranking
            mode="stars"
            scale={2.4}
            score={this.state.stars.score}
            scoreBase={10}
            activeColor="#eb5461"
            onScore={this.changeStarScore}/>
        </View>
        <View style={styles.arcsRanking}>
          <Ranking mode="arcs" score={6.2} scoreBase={10} name="市占比"/>
          <Ranking
            mode="arcs"
            score={this.state.arcs.score}
            scoreBase={10}
            activeColor="#2bb8aa"
            scale={1.2}
            onScore={this.changeArcScore}
            name="环比增长"
            status={2}
            />
          <Ranking
            mode="arcs"
            score={1.2}
            scale={1.6}
            name="同比增长"
            status={1}
            />
        </View>
        <View style={styles.simlesRanking}>
          <Ranking
            mode="smiles"
            isLike={this.state.smiles.isLike}
            onScore={this.changeSmileScore}/>
          <Ranking mode="smiles" scale={1.2} activeColor="#d23f2b" isLike={false} status={1}/>
          <Ranking mode="smiles" scale={1.4} activeColor="#f2558d" isLike={false} status={2}/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    marginTop: 30,
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
    marginTop: 20,
    justifyContent: 'space-around'
  },
  simlesRanking: {
    marginTop: 20,
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('ranking', () => ranking);
