import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'

import {useHistory} from 'react-router-dom'

import Loader from './Loader'
import EmptyState from './EmptyState'
import {InvoiceResponse} from '../providers/sunshineProvider'
import Details from './Details'

const DetailsView = ({dealId}: {dealId: string}) => {
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleEdit = () => console.log('>>> EDIT')
  const handleDelete = () => history.push('/delete')

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
        <Details
          invoice={response.data[0]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  )
}

export default DetailsView
