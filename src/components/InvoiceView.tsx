import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'

import Loader from './Loader'
import EmptyState from './EmptyState'

const InvoiceView = ({dealId}: {dealId: string}) => {
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const isRelationEmpty = (response: any) => response.data.data.length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<EmptyState />}
      isEmpty={isRelationEmpty}
    >
      {([invoice]: [string]) => <pre>{JSON.stringify(invoice, null, 2)}</pre>}
    </ResponseHandler>
  )
}

export default InvoiceView
