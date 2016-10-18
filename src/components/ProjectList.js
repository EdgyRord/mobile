import React from 'react'
import {
  Alert,
  Dimensions,
  ListView,
  NetInfo,
  StyleSheet,
  Text,
  View
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import apiClient from 'panoptes-client/lib/api-client'
import Project from './Project'
import {MOBILE_PROJECTS} from '../constants/mobile_projects'
import { connect } from 'react-redux'
import { setUser } from '../actions/index';

var {height, width} = Dimensions.get('window')

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isConnected: null
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );

    //this is always being set to false (even when connected) in iOS
    //so, getProjects() will be called in handleConnectionChange
    //Open issue: https://github.com/facebook/react-native/issues/8469
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        this.setState({isConnected})
      }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    })

    if ((isConnected === true) && (this.state.dataSource.getRowCount() === 0)){
      this.getProjects()
    }
  }

  getDataSource(projects: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(projects);
  }

  getProjects(){
    apiClient.type('projects').get({id: MOBILE_PROJECTS, cards: true, sort: 'display_name'})
      .then((projects) => {
        this.setState({
          dataSource: this.getDataSource(projects),
        });
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          'The following error occurred.  Please close down Zooniverse and try again.  If it persists please notify us.  \n\n' + error,
        )
      })
  }

  renderRow(project) {
    return (
      <Project project={project}/>
    );
  }

  render() {
    this.props.setUser('TODO')
    const projectList =
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />

    const noConnection =
      <Text style={styles.message}>
        You must have an internet connection to use Zooniverse Mobile
      </Text>

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Zooniverse
          </Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Mobile-friendly Projects
          </Text>
        </View>
        { this.state.isConnected ? projectList : noConnection }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    backgroundColor: '$backgroundColor',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 32,
    alignItems: 'center',
    width: width
  },
  title: {
    color: '$textColor',
    fontSize: 22
  },
  subtitleContainer: {
    borderBottomColor: '$borderColor',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15
  },
  subtitle: {
    color: '$textColor',
    fontSize: 24,
    padding: 15,
  },
  message: {
    color: '$textColor',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    padding: 15,
  }
});

const mapStateToProps = (state) => ({
  userID: state.userID
})

const mapDispatchToProps = (dispatch) => ({
  setUser(id) {
    dispatch(setUser(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)
