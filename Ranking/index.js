import React, {
  Component,
  PropTypes
} from 'react';
import {
  ART,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import {default as styles} from './RankingStyle';

const {
  Shape,
  Group,
  Surface,
  Rectangle
} = ART;

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
    const {
      score,
      num
    } = this.props;
    return (
      <View style={styles.board}>

        <View style={styles.boardScoreWp}>
          <Text style={styles.boardScore}>{score}</Text>
        </View>
        <Text style={styles.boardNum}>{num}</Text>
        <View style={styles.boardStars}>
          <Surface width={200} height={100}>
            <Group x={0} y={0}>
              <Shape
                d={10}
                stroke="#000"
                strokeWidth={5}
              />
            </Group>
          </Surface>
        </View>
      </View>
    );
  }
  render() {
    const {
      mode
    } = this.props;

    let rankingView;
    if (mode === 'board') {
      rankingView = this.renderBoard();
    } else if (mode === 'arcs') {
      rankingView = this.renderArc();
    } else {
      rankingView = this.renderStar();
    }

    return (
      <TouchableHighlight>
        {rankingView}
      </TouchableHighlight>
    );
  }
}

Ranking.defaultProps = {
  mode: 'board',
  enable: false,
  size: 'md',
  score: 0,
  num: 0,
  onScore: () => {},
  name: '',
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
  num: PropTypes.number,
  name: PropTypes.string,
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  fontColor: PropTypes.string
};

export default Ranking;
