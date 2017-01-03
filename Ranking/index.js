import React, {
  Component,
  PropTypes
} from 'react';
import {
  ART,
  Text,
  View,
  Modal,
  Picker,
  Button,
  Platform,
  Animated,
  PanResponder,
  TouchableHighlight
} from 'react-native';
import styles from './RankingStyle';
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
      scored: false,
      isModalVisible: false,
      animatedModalOpactiy: new Animated.Value(0.4),
      score: this.props.score
    };
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y}0 现在会被设置为0
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      }
    });
    this.noop = this.noop.bind(this);
    this.renderArcs = this.renderArcs.bind(this);
    this.renderStars = this.renderStars.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.renderSmiles = this.renderSmiles.bind(this);
    this.onPressBoard = this.onPressBoard.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }
  noop () { }
  setModalVisible (isModalVisible) {
    const {height, duration} = this.props;
    this.setState({isModalVisible: isModalVisible});
    if (isModalVisible) {
      Animated.timing(
        this.state.animatedModalOpactiy,
        {
          toValue: 1,
          duration: duration
        }
      ).start();
    } else {
      Animated.timing(
        this.state.animatedModalOpactiy,
        {
          toValue: 0,
          duration: duration
        }
      ).start();
    }
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
      onScore = this.noop
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
    const {
      status
    } = this.props;
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {}}>
        <View style={styles.arcs}>
          {this.drawArc({...this.props})}
        </View>
      </TouchableHighlight>
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
    onScore = status === ENABLE ? onScore : this.noop;
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
      onScore,
      status
    } = this.props;
    let onPress = status === ENABLE ? onScore : this.noop;
    return (
      <View style={styles.smiles}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => onPress(true)}>
          <View>
            {this.drawSmile({...this.props, active: isLike, like: true})}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => onPress(false)}>
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
      status,
      num,
      activeColor,
      defaultColor,
      fontColor
    } = this.props;
    let mainColor = status === DISABLE ? DISABLE_COLOR : activeColor;
    let font = status === DISABLE ? FONT_COLOR : fontColor;
    const BASE = 5;
    let arr = [1, 1, 1, 1, 1];
    let selectArr = [];
    let i = 0;
    while (i < BASE * 10) {
      i += 1;
      selectArr.push(i);
    }
    selectArr = selectArr.map(item => item / 10);
    return (
      <TouchableHighlight
        underlayColor={UNDERLAY_COLOR}
        onPress={this.onPressBoard}>
        <View style={styles.board}>
          <View style={styles.boardScoreWp}>
            <Text style={[styles.boardScore, {color: mainColor}]}>{(score % BASE).toFixed(1)}</Text>
          </View>
          <Text style={[styles.boardNum, {color: font}]}>
            {num < 100000 ? this.parseNumber(num)
              : num > Math.pow(10, 7) ? '999w+'
              : this.parseNumber(num / 10000) + 'w+'}
          </Text>
          <View style={styles.boardStars}>
            {arr.map((item, index) =>
              score >= index + 1 ?
              this.drawStar({scale: 0.3, color: mainColor, key: index + 1})
              : this.drawStar({scale: 0.3, color: defaultColor, key: index + 1})
            )}
          </View>
          {Platform.OS === 'ios' && <Modal
            transparent={true}
            visible={this.state.isModalVisible}
            onRequestClose={() => {this.setModalVisible(false);}}>
              <View style={{flex: 1}}>
                <TouchableHighlight
                  style={styles.modalMask}
                  activeOpacity={1}
                  underlayColor="#00000077"
                  onPress={this.onPressCancel}>
                  <TouchableHighlight
                    underlayColor="#fff"
                    style={styles.modalContainer}>
                    <Animated.View style={[styles.modal, {opacity: this.state.animatedModalOpactiy}]}>
                      <View>
                        <Picker
                          selectedValue={this.state.score}
                          onValueChange={(value) => !this.state.scored && this.setState({score: value})}>
                          {selectArr.map(item =>
                            <Picker.Item label={item.toFixed(1)} value={item} key={item}/>
                          )}
                        </Picker>
                      </View>
                        {this.state.scored ?
                          <Button
                            onPress={this.onPressCancel}
                            title="您已评价"
                            color="#888"
                            /> :
                          <View style={styles.modalButtons}>
                            <Button
                              onPress={this.onPressCancel}
                              title="取消"
                              color="#888"
                              />
                            <Button
                              onPress={this.onPressConfirm}
                              title="确定"
                              />
                          </View>
                        }
                    </Animated.View>
                  </TouchableHighlight>
                </TouchableHighlight>
              </View>
          </Modal>}
        </View>
      </TouchableHighlight>
    );
  }
  onPressCancel () {
    this.setModalVisible(false);
  }
  onPressConfirm () {
    this.setState({scored: true});
    this.props.onScore(this.state.score);
    this.setModalVisible(false);
  }
  // Event Listeners
  onPressBoard () {
    const {status} = this.props;
    if (status !== ENABLE) return;
    if (Platform.OS === 'ios') {
      this.setModalVisible(true);
    } else {
    }
  }
  onDatePicked () {

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
  duration: 300,
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
  duration: React.PropTypes.number,
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  fontColor: PropTypes.string
};

export default Ranking;
