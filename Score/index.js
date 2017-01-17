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
  TouchableHighlight
} from 'react-native';
import styles from './ScoreStyle';
import {COLOR, MODE, SVG} from './ScoreConstants';

const {ACTIVE_COLOR, DEFAULT_COLOR, FONT_COLOR, UNDERLAY_COLOR, DISABLE_COLOR} = COLOR;
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

class Score extends Component {
  constructor(props) {
    super(props);
    this.state = {

      score: this.props.score
    };
    this.score = 0;
    this.noop = this.noop.bind(this);
    this.renderArcs = this.renderArcs.bind(this);
    this.renderStars = this.renderStars.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.renderSmiles = this.renderSmiles.bind(this);
    this.onPressBoard = this.onPressBoard.bind(this);
    this.onPressArc = this.onPressArc.bind(this);
  }
  throttle(fn, time) {
    let running = false;
    let isFrame = false;
    if (!time) isFrame = true;
    const getCallback = (self, args) => {
      return () => {
        fn.apply(self, args);
        running = false;
      };
    };
    return function () {
      if (running) return;
      running = true;
      if (isFrame) {
        window.requestAnimationFrame(getCallback(this, arguments));
      } else {
        setTimeout(getCallback(this, arguments), time);
      }
    };
  }
  moveArc (evt, gestureState) {
    const {scoreBase, score, onScore} = this.props;
    let ds = -gestureState.dy / 300 * scoreBase;
    this.score = ds + score;
    if (this.score > scoreBase) {
      this.score = scoreBase;
    } else if (this.score < 0) {
      this.score = 0;
    }
    onScore(this.score);
  }
  noop () { }
  drawSmile(options) {
    const {
      like,
      active,
      scale = 1,
      activeColor = ACTIVE_COLOR,
      defaultColor = DEFAULT_COLOR,
      enable = true
    } = options || {};
    let fill = !active ? defaultColor : !enable ? DISABLE_COLOR : activeColor;
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
      scoreBase = 10,
      scale = 1,
      score,
      fontColor = FONT_COLOR,
      name = '',
      enable
    } = options || {};
    this.score = score;
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
    activeColor = !enable ? DISABLE_COLOR : activeColor;
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
        <Text style={[styles.arcScore, fontStyle]}>{(this.score).toFixed(1)}</Text>
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
  onPressArc () {
    const {readOnly, enable} = this.props;
    if (readOnly || !enable) return;
    this.refs.modal.openModal();
  }
  renderArcs () {
    const {score, scoreBase, onScore} = this.props;
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this.onPressArc}>
        <View style={styles.arcs}>
          {this.drawArc({...this.props})}
          {<ScoreModal
            ref="modal"
            score={score}
            scoreBase={scoreBase}
            scored={false}
            onScore={onScore}
          />}
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
      enable,
      readOnly
    } = this.props;
    let arr = [];
    activeColor = !enable ? DISABLE_COLOR : activeColor;
    defaultColor = !enable ? DEFAULT_COLOR : defaultColor;
    onScore = enable && !readOnly ? onScore : this.noop;
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
      enable,
      readOnly
    } = this.props;
    let onPress = enable && !readOnly ? onScore : this.noop;
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
  onPressBoard () {
    const {enable, readOnly} = this.props;
    if (!enable || readOnly) return;
    this.refs.modal.openModal();
  }
  renderBoard() {
    const {
      score,
      num,
      activeColor,
      defaultColor,
      fontColor,
      enable,
      onScore
    } = this.props;
    let mainColor = !enable ? DISABLE_COLOR : activeColor;
    let font = !enable ? FONT_COLOR : fontColor;
    const BASE = 5;
    let arr = [1, 1, 1, 1, 1];
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
          {<ScoreModal
            ref="modal"
            score={score}
            scoreBase={BASE}
            scored={false}
            onScore={onScore}
          />}
        </View>
      </TouchableHighlight>
    );
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

Score.defaultProps = {
  mode: 'board',
  enable: true,
  readOnly: false,
  num: 0,
  score: 0,
  scoreBase: 5,
  scale: 1,
  onScore: () => {},
  name: '',
  duration: 200,
  isLike: true,
  activeColor: ACTIVE_COLOR,
  defaultColor: DEFAULT_COLOR,
  fontColor: FONT_COLOR
};

Score.propTypes = {
  mode: PropTypes.oneOf([BOARD, ARCS, SMILES, STARS]),
  enable: PropTypes.bool,
  readOnly: PropTypes.bool,
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

class ScoreModal extends Component {
  static propTypes = {
    scored: PropTypes.bool,
    scoreBase: PropTypes.number,
    visible: PropTypes.bool,
    onScore: PropTypes.func,
    duration: PropTypes.number
  }
  static defaultProps = {
    scored: false,
    scoreBase: 5,
    visible: false,
    duration: 200,
    onScore: () => {}
  }
  constructor (props) {
    super(props);
    this.state = {
      score: this.props.score,
      isModalVisible: false
    };
    this.openModal = this.openModal.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
  }
  setModalVisible (isModalVisible) {
    this.setState({isModalVisible: isModalVisible});
  }
  openModal () {
    this.setModalVisible(true);
  }
  onPressCancel () {
    this.setModalVisible(false);
  }
  onPressConfirm () {
    this.props.onScore(this.state.score);
    this.setModalVisible(false);
  }
  render () {
    const {scoreBase} = this.props;
    let selectArr = [];
    let i = 0;
    while (i < scoreBase * 10) {
      i += 1;
      selectArr.push(i);
    }
    selectArr = selectArr.map(item => item / 10);
    return (
      <Modal
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
                <View style={styles.modal}>
                  <View>
                    <Picker
                      selectedValue={this.state.score}
                      onValueChange={(value) => !this.props.scored && this.setState({score: value})}>
                      {selectArr.map(item =>
                        <Picker.Item label={item.toFixed(1)} value={item} key={item}/>
                      )}
                    </Picker>
                  </View>
                    {this.props.scored ?
                      <View style={styles.modalButtons}>
                        <Button
                          onPress={this.onPressCancel}
                          title="您已评价"
                          color="#888"/>
                      </View> :
                      <View style={styles.modalButtons}>
                        <View style={styles.modalButton}>
                          <Button
                            onPress={this.onPressCancel}
                            title="取消"
                            color="#888"
                            />
                        </View>
                        <View style={[styles.modalButton, styles.confirmButton]}>
                          <Button
                            style={styles.modalButton}
                            onPress={this.onPressConfirm}
                            title="确定"
                            />
                        </View>
                      </View>
                    }
                </View>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
      </Modal>
    );
  }
}

export default Score;
