import React from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import PropTypes from 'prop-types';
import StyledMarkdown from '../StyledMarkdown'
import StyledText from '../StyledText'
import SizedImage from '../SizedImage'
import Button from '../Button'

const ITEM_ICON_RADIUS = 50

const FieldGuideItemDetail = (props) => {
  return (
    <ScrollView style={styles.itemDetailContainer}>
      <View onLayout={props.setHeaderHeight}>
        { props.icons[props.item.icon].src
          ? <SizedImage
              source={{ uri: props.icons[props.item.icon].src }}
              maxHeight={ ITEM_ICON_RADIUS * 2 }
              additionalStyles = {[styles.itemDetailIcon]}
            />
          : null
        }
        <StyledText additionalStyles={[styles.itemDetailTitle]} text={ props.item.title } />
      </View>
      <StyledMarkdown
        markdown={props.item.content}
        onReceivedHeight={props.setContentHeight}
      />
      <Button
        handlePress={props.onClose}
        additionalStyles={[styles.backButton]}
        text={'< Back'} />
    </ScrollView>
  )
}

const styles = EStyleSheet.create({
  itemDetailContainer: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
  itemDetailIcon: {
    alignSelf: 'center',
    maxWidth: ITEM_ICON_RADIUS * 2,
    maxHeight: ITEM_ICON_RADIUS * 2,
    borderRadius: ITEM_ICON_RADIUS
  },
  itemDetailTitle: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  }
});

FieldGuideItemDetail.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.string,
  }),
  icons: PropTypes.object,
  setContentHeight: PropTypes.func,
  setHeaderHeight: PropTypes.func,
  onClose: PropTypes.func,
}

export default FieldGuideItemDetail
