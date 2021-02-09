import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'
import {useHistory} from 'react-router-dom'

import {
  RELATION_TYPE,
  RelationshipResponse,
} from '../providers/sunshineProvider'
import Loader from './Loader'
import Delete from './Delete'

const DeleteView = () => {
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/relationships/records?type=${RELATION_TYPE}`,
  )

  const handleDelete = () => console.log('>> DELETE')
  const handleCancel = () => history.push('/')

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>Something went wrong!</div>}
    >
      {([response]: [RelationshipResponse]) => (
        <Delete
          relation={response.data[0]}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </ResponseHandler>
  )
}

export default DeleteView
