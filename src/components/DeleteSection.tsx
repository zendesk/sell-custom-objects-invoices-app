import * as React from 'react'
import {Grid, Row} from '@zendeskgarden/react-grid'
import {LG} from '@zendeskgarden/react-typography'
import {Button} from '@zendeskgarden/react-buttons'

import {RelationshipData} from '../providers/sunshineProvider'

const DeleteSection = ({
  relation,
  onCancel,
  onDelete,
}: {
  relation: RelationshipData
  onCancel: () => void
  onDelete: (relationId: string, invoiceId: string) => void
}) => {
  const handleDelete = () => onDelete(relation.id, relation.target)

  return (
    <Grid>
      <Row>
        <LG>Do you want to remove Invoice?</LG>
      </Row>
      <Row>
        <Button data-test-id="invoice-delete-cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isDanger
          data-test-id="invoice-delete-confirm"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Row>
    </Grid>
  )
}

export default DeleteSection
