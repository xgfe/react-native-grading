import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  board: {
    alignItems: 'center',
    padding: 4,
    width: 70,
    height: 80,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccc'
  },
  boardScoreWp: {
    alignItems: 'center',
    width: 62,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },
  boardScore: {
    fontSize: 24,
    color: '#fa952f'
  },
  boardNum: {
    color: '#999'
  },
  boardStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  arcs: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
