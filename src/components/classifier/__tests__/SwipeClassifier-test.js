import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('WebView', () => 'WebView')
jest.mock('../../OverlaySpinner', () => 'OverlaySpinner')
jest.mock('../Question', () => 'Question')
jest.mock('../Tutorial', () => 'Tutorial')
jest.mock('../SwipeTabs', () => 'SwipeTabs')
jest.mock('../../ZoomableImage', () => 'ZoomableImage')

import { SwipeClassifier } from '../SwipeClassifier'

const task = {
  question: 'What was that?',
  answers: [
    { label: 'Yes' },
    { label: 'No' },
  ]
}

const workflow = {
  first_task: 'T0',
  tasks: {
    T0: task
  },
  configuration: {
    pan_and_zoom: true
  }
}

const subject = {
  id: '23432432',
  display: {
    src: 'blah.jpg'
  }
}

const project = {
  display_name: 'Awesome project'
}

const subjectSizes={resizedWidth: 100, resizedHeight: 100}

const seenThisSession=[]

// Stub out actions
const navBarActions = { 
  setTitleForPage() {},
  setNavbarColorForPageToDefault() {}
}

const classifierActions = {
  startNewClassification() {},
  setClassifierTestMode() {}
}

it('renders correctly', () => {
  const tree = renderer.create(
    <SwipeClassifier
      task={task}
      isFetching={false}
      setIsFetching={jest.fn}
      startNewClassification={jest.fn}
      saveClassification={jest.fn}
      saveAnnotation={jest.fn}
      project={project}
      workflow={workflow}
      workflowID={'1'}
      subject={subject}
      subjectSizes={subjectSizes}
      seenThisSession={seenThisSession}
      navBarActions={navBarActions}
      classifierActions={classifierActions} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders spinner if fetching', () => {
  const tree = renderer.create(
    <SwipeClassifier
      task={task}
      isFetching={true}
      setIsFetching={jest.fn}
      startNewClassification={jest.fn}
      project={project}
      workflow={workflow}
      workflowID={'1'}
      subject={subject}
      subjectSizes={subjectSizes}
      seenThisSession={seenThisSession}
      navBarActions={navBarActions}
      classifierActions={classifierActions} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders tutorial if needed', () => {
  const tree = renderer.create(
    <SwipeClassifier
      task={task} 
      isFetching={false}
      setIsFetching={jest.fn}
      startNewClassification={jest.fn}
      needsTutorial={true}
      project={project}
      workflow={workflow}
      workflowID={'1'}
      subject={subject}
      subjectSizes={subjectSizes}
      seenThisSession={seenThisSession}
      navBarActions={navBarActions}
      classifierActions={classifierActions} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
