import React, { Component } from 'react'
import {
  SectionList,
  View,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import PropTypes from 'prop-types';
import R from 'ramda'

import ProjectTile from './ProjectTile';
import NavBar from '../NavBar'
import FontedText from '../common/FontedText'
import * as navBarActions from '../../actions/navBar'
import { GLOBALS } from '../../constants/globals'
import { extractNonSwipeEnabledProjects, extractSwipeEnabledProjects } from '../../utils/projectUtils'
import Theme from '../../theme'

GoogleAnalytics.trackEvent('view', 'Project')

const mapStateToProps = (state, ownProps) => {
    const { selectedProjectTag } = ownProps;
    const inPreviewMode = selectedProjectTag === 'preview'
    const inBetaMode = selectedProjectTag === 'beta'
    let projectList
    
    // Grab all of the projects from the selected Project Tag
    if (selectedProjectTag === 'recent') {
      const activeProjects = R.filter((project) => { return project.activity_count > 0 }, state.user.projects);
      projectList = state.projects.projectList.filter((project) => R.keys(activeProjects).includes(project.id));
    } else if (inPreviewMode) {
        projectList = state.projects.previewProjectList
    } else if (inBetaMode) {
        projectList = state.projects.betaProjectList
    }
    else {
        projectList = state.projects.projectList.filter((project) => R.contains(selectedProjectTag, project.tags))
    }

    // Seperate out the native workflows and non-native workflows    
    const swipeEnabledProjects = extractSwipeEnabledProjects(projectList)
    const nonSwipeEnabledProjects = state.settings.showAllWorkflows ?
        extractNonSwipeEnabledProjects(projectList)
        : []

    return {
        swipeEnabledProjects,
        nonSwipeEnabledProjects,
        promptForWorkflow: state.main.settings.promptForWorkflow || false,
        isLoading: state.projects.isLoading,
        collaboratorIds: state.projects.collaboratorIds,
        ownerIds: state.projects.ownerIds,
        inPreviewMode,
        inBetaMode
    };
}

const mapDispatchToProps = (dispatch) => ({
    navBarActions: bindActionCreators(navBarActions, dispatch)
})

const PAGE_KEY = 'ProjectList';

class ProjectList extends Component {
    
    static renderNavigationBar() {
        return <NavBar pageKey={PAGE_KEY} showBack={true} />;
    }

    componentDidMount() {
        const title = GLOBALS.DISCIPLINES.find((element) => element.value === this.props.selectedProjectTag).label
        this.props.navBarActions.setTitleForPage(title, PAGE_KEY);

        if (this.props.inPreviewMode) {
            this.props.navBarActions.setNavbarColorForPage(Theme.$testRed, PAGE_KEY)
        } else {
            this.props.navBarActions.setNavbarColorForPageToDefault(PAGE_KEY)
        }
    }

    _emptyText() {
        if (!this.props.isLoading) {
            return 'Sorry, but you have no mobile friendly projects to display'
        } else {
            return 'Loading Projects...'
        }
    }
    
    _seperatorHeightStyle(data) {
        return {height: !!data.leadingItem && !!data.trailingSection ? 50 : 0}
    }

    render() {
        const {inPreviewMode, ownerIds, collaboratorIds, swipeEnabledProjects, nonSwipeEnabledProjects } = this.props
        let sections = []
        if (inPreviewMode) {
            if (!R.isEmpty(ownerIds)) {
                const ownerProjects = swipeEnabledProjects.filter((project) => ownerIds.includes(project.id))
                sections.push({data: ownerProjects, title: 'Your Projects'})
            }

            if (!R.isEmpty(collaboratorIds)) {
                const collaboratorProjects = swipeEnabledProjects.filter((project) => collaboratorIds.includes(project.id))
                sections.push({data: collaboratorProjects, title: 'Collaborations'})
            }
        } else {
            if (!R.isEmpty(swipeEnabledProjects)) {
                const mobileSection = this.props.inBetaMode ? 
                    {data: swipeEnabledProjects} :
                    {data: swipeEnabledProjects, title: 'Made For Mobile'}
                sections.push(mobileSection);
            }
    
            if (!R.isEmpty(this.props.nonSwipeEnabledProjects)) {
                sections.push({data: nonSwipeEnabledProjects, title: 'In-Browser Experience'})
            }
        }
        

        return (
            <SectionList
                ListHeaderComponent={this.props.inBetaMode && <ListHeaderComponent />}
                contentContainerStyle={styles.contentContainer}
                stickySectionHeadersEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separatorView} />}
                SectionSeparatorComponent={(data) => <View style={this._seperatorHeightStyle(data)} />}
                renderItem={({item}) => <ProjectTile project={item} inPreviewMode={this.props.inPreviewMode} inBetaMode={this.props.inBetaMode}/>}
                renderSectionHeader={({section}) => section.title && <FontedText style={styles.sectionHeader}> { section.title } </FontedText>}
                sections={sections}
                ListEmptyComponent={() => <FontedText style={styles.emptyComponent}> {this._emptyText()} </FontedText>}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

const ListHeaderComponent = () => {
    return  (
        <FontedText style={styles.listHeader}>
            {
                'Thank you for volunteering to beta test projects in development.\n\n' +
                'Your feedback here will help new projects join the Zooniverse.'
            }
        </FontedText>
    )
}

const styles = EStyleSheet.create({
    contentContainer: {
        paddingBottom: 25,
        paddingTop: 35
    },
    listHeader: {
        color: '$headerGrey',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'justify',
        marginHorizontal: 25,
        marginBottom: 25
        
    },
    separatorView: {
        height: 25
    },
    sectionHeader: {
        fontSize: 26, 
        marginLeft: 25, 
        marginBottom: 20, 
        fontWeight: 'bold',
        color: '$headerGrey'
    },
    emptyComponent: {
        fontStyle: 'italic', 
        marginHorizontal: 20, 
        color: '$headerGrey'
    }

});

ProjectList.propTypes = {
    swipeEnabledProjects: PropTypes.array,
    nonSwipeEnabledProjects: PropTypes.array,
    recentsList: PropTypes.array,
    promptForWorkflow: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    selectedProjectTag: PropTypes.string,
    navBarActions: PropTypes.any,
    inPreviewMode: PropTypes.bool,
    inBetaMode: PropTypes.bool,
    collaboratorIds: PropTypes.array,
    ownerIds: PropTypes.array
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)