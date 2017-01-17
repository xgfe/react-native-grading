import {StyleSheet, Dimensions} from 'react-native';
const {width, height, scale} = Dimensions.get('window');

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
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'flex-start'
  },
  arcContainer: {
    alignItems: 'center'
  },
  arc: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  arcScore: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  smiles: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalMask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000077'
  },
  modalContainer: {
  },
  modal: {
    height: 251,
    width: width * 0.6,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  modalButtons: {
    borderTopWidth: 1 / scale,
    borderColor: '#c6c6c6',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalButton: {
    width: 120
  },
  confirmButton: {
    borderLeftWidth: 1 / scale,
    borderColor: '#c6c6c6'
  }
});
