import * as React from 'react'
import {
  ResponseHandler,
  useClientRequest,
  ZAFClientContext,
} from '@zendesk/sell-zaf-app-toolbox'
import {useHistory} from 'react-router-dom'
import {useCallback, useContext} from 'react'

import {deleteRelation, deleteObject, RelationshipData} from '../providers/sunshineProvider'

import {
  RELATION_TYPE,
  RelationshipResponse,
} from '../providers/sunshineProvider'
import Loader from './Loader'
import DeleteSection from './DeleteSection'

const DeleteView = ({dealId}: {dealId: string}) => {
  const client = useContext(ZAFClientContext)
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/relationships/records?type=${RELATION_TYPE}`,
  )

  const handleCancel = useCallback(() => history.push('/'), [])
  const handleDelete = useCallback(
    async (relationId: string, invoiceId: string) => {
      await deleteRelation(client, relationId)
      await deleteObject(client, invoiceId)
      history.push('/')
    },
    [],
  )

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
    >
      {([response]: [RelationshipResponse]) => (
        <DeleteSection
          relation={response.data.find((relation: RelationshipData) => relation.source === `zen:deal:${dealId}`) as RelationshipData}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </ResponseHandler>
  )
}

export default DeleteView
