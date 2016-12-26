import React, {
  Component,
  PropTypes,
  ART
} from 'react';
import {
  Text,
  View,
  TouchableHightlight
} from 'react-native';
import {default as styles} from './RankingStyle'

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.noop = this.noop.bind(this);
  }
  noop() {
    return true;
  }
  renderArc() {

  }
  renderStar() {

  }

  renderBoard() {

  }

  render() {
    return (
      <TouchableHightlight
        onPress={this.noop}
        style={styles.container}
      >
        <View style={styles.view}>
          <Text style={styles.text}>EX1</Text>
        </View>
      </TouchableHightlight>
    );
  }
};

Ranking.defaultProps = {
  mode: 'board',
  enable: false,
  activeColor: '#fa952f',
  defaultColor: '#e9e9e9',
  fontColor: '#333'
};

Ranking.propTypes = {
  mode: PropTypes.oneOf(['board', 'star', 'smile', 'arcs']),
  enable: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  score: PropTypes.number,
  onScore: PropTypes.func,
  name: PropTypes.string,
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  fontColor: PropTypes.string
};

export default Ranking;
