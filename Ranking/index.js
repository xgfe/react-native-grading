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
import {COLOR, MODE, SVG} from './RankingConstants';

const {ACTIVE_COLOR, DEFAULT_COLOR, FONT_COLOR} = COLOR;
const {BOARD, SMILES, ARCS, STARS} = MODE;

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
      defaultColor = DEFAULT_COLOR
    } = options || {};
    return (
      <Surface width={50 * scale} height={50 * scale}>
        <Group x={5 * scale} y={5 * scale}>
          <Shape
            scale={40 / 1024 * scale}
            fill={active ? activeColor : defaultColor}
            d={like ? SVG.HAPPY : SVG.SAD}/>
        </Group>
      </Surface>
    );
  }
  drawArc(options) {
    const {
      activeColor = ACTIVE_COLOR,
      score = 2,
      scoreBase = 10,
      scale = 1,
      fontColor = FONT_COLOR,
      name = ''
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
      scale = 1
    } = options || {};
    return (
      <Surface width={40 * scale} height={40 * scale}>
        <Group x={20 * scale} y={20 * scale}>
          <Shape
            fill={color}
            scale={scale}
            d={`M 0.000 10.000
                L 11.756 16.180
                L 9.511 3.090
                L 19.021 -6.180
                L 5.878 -8.090
                L 0.000 -20.000
                L -5.878 -8.090
                L -19.021 -6.180
                L -9.511 3.090
                L -11.756 16.180
                L 0.000 10.000`}
            />
        </Group>
      </Surface>
    );
  }
  parseNumber(num) {
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
    const {
      score,
      scoreBase,
      scale,
      activeColor,
      defaultColor
    } = this.props;
    let arr = [];
    let base = scoreBase;
    while (base--) { arr.push(1); }
    let activeStar = this.drawStar({scale: 0.3 * scale, color: activeColor});
    let defaultStar = this.drawStar({scale: 0.3 * scale, color: defaultColor});
    return (
      <View style={styles.stars}>
        {arr.map((item, index) =>
          score >= index + 1 ? activeStar : defaultStar
        )}
      </View>
    );
  }
  renderSmiles() {
    const {isLike} = this.props;
    return (
      <View style={styles.smiles}>
        {this.drawSmile({...this.props, active: isLike, like: true})}
        {this.drawSmile({...this.props, active: !isLike, like: false})}
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
    let activeStar = this.drawStar({scale: 0.3, color: activeColor});
    let defaultStar = this.drawStar({scale: 0.3, color: defaultColor});
    let arr = [1, 1, 1, 1, 1];
    return (
      <View style={styles.board}>
        <View style={styles.boardScoreWp}>
          <Text style={[styles.boardScore, {color: activeColor}]}>{(score % BASE).toFixed(1)}</Text>
        </View>
        <Text style={[styles.boardNum, {color: fontColor}]}>{num < 1000000 ? this.parseNumber(num) : '100w+'}</Text>
        <View style={styles.boardStars}>
          {arr.map((item, index) =>
            score >= index + 1 ? activeStar : defaultStar
          )}
        </View>
      </View>
    );
  }
  render() {
    const {
      mode
    } = this.props;
    let rankingView;
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
  enable: false,
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
  enable: PropTypes.bool,
  isLike: PropTypes.bool,
  scale: PropTypes.numerber,
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
