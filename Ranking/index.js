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
import {COLOR, MODE, STATUS, SVG} from './RankingConstants';

const {ACTIVE_COLOR, DEFAULT_COLOR, FONT_COLOR, UNDERLAY_COLOR, DISABLE_COLOR} = COLOR;
const {BOARD, SMILES, ARCS, STARS} = MODE;
const {ENABLE, DISABLE, READ_ONLY} = STATUS;

const {
  Shape,
  Group,
  Surface
} = ART;

function polarToCartesian (centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees + 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY - (radius * Math.sin(angleInRadians))
  };
}

function generateArcPath (x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, startAngle);
  var end = polarToCartesian(x, y, radius, endAngle);
  var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(' ');
}

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  noop() {
    return true;
  }
  drawSmile(options) {
    const {
      like,
      active,
      scale = 1,
      activeColor = ACTIVE_COLOR,
      defaultColor = DEFAULT_COLOR,
      status = ENABLE
    } = options || {};
    let fill = !active ? defaultColor : status === DISABLE ? DISABLE_COLOR : activeColor;
    return (
      <Surface width={50 * scale} height={50 * scale}>
        <Group x={5 * scale} y={5 * scale}>
          <Shape
            scale={40 / 1024 * scale}
            fill={fill}
            d={like ? SVG.HAPPY : SVG.SAD}/>
        </Group>
      </Surface>
    );
  }
  drawArc(options) {
    let {
      activeColor = ACTIVE_COLOR,
      score = 2,
      scoreBase = 10,
      scale = 1,
      fontColor = FONT_COLOR,
      name = '',
      status
    } = options || {};
    const angle = score / scoreBase * 360;
    let fontStyle = {
      fontSize: 20 * scale,
      lineHeight: 20 * scale,
      marginTop: -44 * scale,
      color: fontColor
    };
    let nameStyle = {
      fontSize: 16 * scale,
      marginTop: 24 * scale,
      color: fontColor
    };
    activeColor = status === DISABLE ? DISABLE_COLOR : activeColor;
    return (
      <View style={[styles.arcContainer]}>
        <View style={[styles.arc]}>
          <Surface width={68 * scale} height={68 * scale}>
            <Group x={0} y={0}>
              <Shape
                scale={scale}
                stroke={DEFAULT_COLOR}
                strokeWidth={4}
                d={generateArcPath(34, 34, 30, 0.01, 360)}
                />
              {angle ?
                <Shape
                  scale={scale}
                  stroke={activeColor}
                  strokeWidth={4}
                  d={generateArcPath(34, 34, 30, 0, angle)}
                  /> : undefined
              }
            </Group>
          </Surface>
        </View>
        <Text style={[styles.arcScore, fontStyle]}>{(score % scoreBase).toFixed(1)}</Text>
        <Text style={nameStyle}>{name}</Text>
      </View>
    );
  }
  drawStar(options) {
    const {
      color = ACTIVE_COLOR,
      scale = 1,
      key,
      onScore
    } = options || {};
    return (
      <TouchableHighlight
        key={key}
        underlayColor="transparent"
        onPress={() => onScore(key)}
        >
        <View>
          <Surface width={40 * scale} height={40 * scale}>
            <Group x={20 * scale} y={20 * scale}>
              <Shape
                fill={color}
                scale={scale}
                d={SVG.STAR}
                />
            </Group>
          </Surface>
        </View>
      </TouchableHighlight>
    );
  }
  parseNumber(num) {
    num = ~~num;
    let arr = [];
    while (num > 0) {
      arr.unshift(num % 1000);
      num = ~~(num / 1000);
    }
    return arr.join();
  }
  renderArcs() {
    return (
      <View style={styles.arcs}>
        {this.drawArc({...this.props})}
      </View>
    );
  }
  renderStars() {
    let {
      score,
      scoreBase,
      scale,
      activeColor,
      defaultColor,
      onScore,
      status
    } = this.props;
    let arr = [];
    activeColor = status === DISABLE ? DISABLE_COLOR : activeColor;
    defaultColor = status === DISABLE ? DEFAULT_COLOR : defaultColor;
    while (scoreBase--) { arr.push(1); }
    return (
      <View style={styles.stars}>
        {arr.map((item, index) =>
          score >= index + 1 ?
          this.drawStar({scale: 0.3 * scale,
            color: activeColor,
            key: index + 1,
            onScore
          }) : this.drawStar({scale: 0.3 * scale,
            color: defaultColor,
            key: index + 1,
            onScore
          })
        )}
      </View>
    );
  }
  renderSmiles() {
    const {
      isLike,
      onScore
    } = this.props;
    return (
      <View style={styles.smiles}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => onScore(true)}>
          <View>
            {this.drawSmile({...this.props, active: isLike, like: true})}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => onScore(false)}>
          <View>
            {this.drawSmile({...this.props, active: !isLike, like: false})}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  renderBoard() {
    const {
      score,
      num,
      activeColor,
      defaultColor,
      fontColor
    } = this.props;
    const BASE = 5;
    let arr = [1, 1, 1, 1, 1];
    return (
      <TouchableHighlight
        underlayColor={UNDERLAY_COLOR}
        onPress={this.onPressBoard}>
        <View style={styles.board}>
          <View style={styles.boardScoreWp}>
            <Text style={[styles.boardScore, {color: activeColor}]}>{(score % BASE).toFixed(1)}</Text>
          </View>
          <Text style={[styles.boardNum, {color: fontColor}]}>
            {num < 100000 ? this.parseNumber(num)
              : num > Math.pow(10, 7) ? '999w+'
              : this.parseNumber(num / 10000) + 'w+'}
          </Text>
          <View style={styles.boardStars}>
            {arr.map((item, index) =>
              score >= index + 1 ?
              this.drawStar({scale: 0.3, color: activeColor, key: index + 1})
              : this.drawStar({scale: 0.3, color: defaultColor, key: index + 1})
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  // Event Listeners
  onPressBoard () {
    // s
  }
  render() {
    const {
      mode
    } = this.props;
    let rankingView = <Text>Rendering</Text>;
    if (mode === BOARD) {
      rankingView = this.renderBoard();
    } else if (mode === ARCS) {
      rankingView = this.renderArcs();
    } else if (mode === STARS){
      rankingView = this.renderStars();
    } else if (mode === SMILES){
      rankingView = this.renderSmiles();
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
  status: ENABLE,
  num: 0,
  score: 0,
  scoreBase: 5,
  scale: 1,
  onScore: () => {},
  name: '',
  isLike: true,
  activeColor: ACTIVE_COLOR,
  defaultColor: DEFAULT_COLOR,
  fontColor: FONT_COLOR
};

Ranking.propTypes = {
  mode: PropTypes.oneOf([BOARD, ARCS, SMILES, STARS]),
  status: PropTypes.oneOf([ENABLE, DISABLE, READ_ONLY]),
  enable: PropTypes.bool,
  isLike: PropTypes.bool,
  scale: PropTypes.number,
  score: PropTypes.number,
  scoreBase: PropTypes.number,
  onScore: PropTypes.func,
  num: PropTypes.number,
  name: PropTypes.string,
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  fontColor: PropTypes.string
};

export default Ranking;
