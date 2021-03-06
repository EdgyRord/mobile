import React from 'react'
import {
  Switch,
  TouchableOpacity,
  View
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import PropTypes from 'prop-types';
import FontedText from '../common/FontedText'
import { addIndex, contains, map } from 'ramda'
import theme from '../../theme'

const UnlinkedTask = (props) => {
  const annotationValues = props.annotation || []

  const renderUnlinkedTask = ( answer, idx ) => {
    return (
      <View key={ idx } style={styles.rowContainer}>
        <Switch
          value={contains(idx, annotationValues)}
          style={styles.switchComponent}
          onTintColor={theme.$headerColor}
          onValueChange={()=>props.onAnswered(props.unlinkedTaskKey, idx)}
        />

        <TouchableOpacity
          onPress={ ()=>props.onAnswered(props.unlinkedTaskKey, idx) }
          activeOpacity={0.5}
        >
          <FontedText style={styles.answer}>
            {answer.label }
          </FontedText>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      { addIndex(map)(
        (answer, idx) => {
          return renderUnlinkedTask(answer, idx)
        },
        props.unlinkedTask.answers
      ) }
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
    margin: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
  },
  switchComponent: {
    marginLeft: 0,
    marginVertical: 3,
    marginRight: 3,
  },
  answer: {
    flexWrap: 'wrap',
    margin: 3,
    fontSize: 10,
  }
});

UnlinkedTask.propTypes = {
  unlinkedTask: PropTypes.object.isRequired,
  onAnswered: PropTypes.func.isRequired,
  annotation: PropTypes.array,
  unlinkedTaskKey: PropTypes.string.isRequired,
}

export default UnlinkedTask
