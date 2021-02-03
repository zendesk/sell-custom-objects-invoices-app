import * as React from 'react'
import {
  useClientHeight,
  ResponseHandler,
  useSellContactEmail,
} from '@zendesk/sell-zaf-app-toolbox'
import {Row, Grid} from '@zendeskgarden/react-grid'

import Loader from './components/Loader'
import EmptyState from './components/EmptyState'

import css from './App.css'

export const EntryView = () => {
  useClientHeight(400)
  const contactEmailResponse = useSellContactEmail()

  return (
    <Grid gutters={false} className={css.App}>
      <Row>
        <ResponseHandler
          response={contactEmailResponse}
          loadingView={<Loader />}
          errorView={<div>Something went wrong!</div>}
          emptyView={<div>There's nothing to see yet.</div>}
        >
          {([sellContact]: [string]) => <EmptyState />}
        </ResponseHandler>
      </Row>
    </Grid>
  )
}

export default EntryView
