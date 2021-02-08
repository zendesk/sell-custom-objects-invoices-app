import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {
  ResponseHandler,
  useClientGet,
  useClientHeight,
  ZAFClientContext,
} from '@zendesk/sell-zaf-app-toolbox'
import {useContext} from 'react'

import {
  createInvoice,
  createRelation,
  InvoiceResponse,
} from '../providers/sunshineProvider'
import Loader from './Loader'
import NewForm, {NewFormAttributes} from './NewForm'

const NewFormView = () => {
  useClientHeight(400)
  const history = useHistory()
  const dealIdResponse = useClientGet('deal.id')
  const client = useContext(ZAFClientContext)

  const handleSubmittedForm = (attributes: NewFormAttributes) => {
    createInvoice(client, attributes).then((response: InvoiceResponse) => {
      createRelation(client, attributes.dealId, response.data.id).then(() =>
        history.push('/'),
      )
    })
  }

  return (
    <ResponseHandler
      responses={[dealIdResponse]}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>There's nothing to see yet.</div>}
    >
      {([dealId]: [number]) => (
        <NewForm dealId={dealId} onSubmittedForm={handleSubmittedForm} />
      )}
    </ResponseHandler>
  )
}

export default NewFormView
