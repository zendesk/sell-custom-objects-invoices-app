import * as React from 'react'
import {
  useClientHeight,
  ResponseHandler,
  useClientGet,
} from '@zendesk/sell-zaf-app-toolbox'
import {Row, Grid} from '@zendeskgarden/react-grid'

import Loader from './components/Loader'
import InvoiceView from './components/InvoiceView'
import css from './App.css'

export const EntryView = () => {
  useClientHeight(400)
  const dealIdResponse = useClientGet('deal.id')

  return (
    <Grid gutters={false} className={css.App}>
      <Row>
        <ResponseHandler
          response={dealIdResponse}
          loadingView={<Loader />}
          errorView={<div>Something went wrong!</div>}
          emptyView={<div>There is no Deal</div>}
        >
          {([dealId]: [string]) => <InvoiceView dealId={dealId} />}
        </ResponseHandler>
      </Row>
    </Grid>
  )
}

export default EntryView
