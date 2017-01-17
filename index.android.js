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
  Text,
  ScrollView
} from 'react-native';
import Score from './Score';
export default class scoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {
        num: 124,
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
  changeBoardScore(newScore) {
    const {num, score} = this.state.board;
    this.setState({
      board: {
        num: num + 1,
        score: (score * num + newScore) / (num + 1)
      }
    });
  }
  changeStarScore(score) {
    this.setState({
      stars: {score: score}
    });
  }
  changeArcScore(score) {
    console.log(score);
    this.setState({
      arcs: {score: score}
    });
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
        <View style={styles.boardScore}>
          <Score
            score={this.state.board.score}
            num={this.state.board.num}
            defaultColor="#9ce0d6"
            onScore={this.changeBoardScore}
            />
          <Score score={4.0} num={72346} fontColor="#552da6" readOnly={true}/>
          <Score score={2.45} num={712338} activeColor="#2bb8aa" enable={false}/>
          <Score
            score={4.9}
            num={234234523478}
            readOnly={true}
            fontColor="#3c77b5"
            />
        </View>
        <View style={styles.starsScore}>
          <Score mode="stars" score={4.45} status={2}/>
          <Score
            mode="stars"
            scale={2}
            scoreBase={8}
            defaultColor="#dad9b8"
            score={5}
            status={1}/>
          <Score
            mode="stars"
            scale={2.4}
            score={this.state.stars.score}
            scoreBase={10}
            activeColor="#eb5461"
            onScore={this.changeStarScore}/>
        </View>
        <View style={styles.arcsScore}>
          <Score mode="arcs" score={6.2} scoreBase={10} name="市占比"/>
          <Score
            mode="arcs"
            score={this.state.arcs.score}
            scoreBase={10}
            activeColor="#2bb8aa"
            scale={1.2}
            onScore={this.changeArcScore}
            name="环比增长"
            status={2}
            />
          <Score
            mode="arcs"
            score={1.2}
            scale={1.6}
            name="同比增长"
            status={1}
            />
        </View>
        <View style={styles.simlesScore}>
          <Score
            mode="smiles"
            isLike={this.state.smiles.isLike}
            onScore={this.changeSmileScore}/>
          <Score mode="smiles" scale={1.2} activeColor="#d23f2b" isLike={false} status={1}/>
          <Score mode="smiles" scale={1.4} activeColor="#f2558d" isLike={true} status={2}/>
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
  boardScore: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  starsScore: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'space-around'
  },
  arcsScore: {
    marginTop: 20,
    justifyContent: 'space-around'
  },
  simlesScore: {
    marginTop: 20,
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('ranking', () => scoring);
