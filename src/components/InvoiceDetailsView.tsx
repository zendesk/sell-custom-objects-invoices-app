import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'

import Loader from './Loader'
import EmptyState from './EmptyState'
import {InvoiceResponse} from '../providers/sunshineProvider'
import InvoiceDetails from './InvoiceDetails'

const InvoiceDetailsView = ({dealId}: {dealId: string}) => {
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleEdit = () => console.log('>>> EDIT')
  const handleDelete = () => console.log('>>> DELETE')
  const isRelationEmpty = (response: any) => response.data.data.length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<EmptyState />}
      isEmpty={isRelationEmpty}
    >
      {([response]: [InvoiceResponse]) => (
        <InvoiceDetails
          invoice={response.data[0]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  )
}

export default InvoiceDetailsView
