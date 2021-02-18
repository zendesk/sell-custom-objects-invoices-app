import * as React from 'react'
import {Col, Grid, Row} from '@zendeskgarden/react-grid'
import {LG} from '@zendeskgarden/react-typography'
import {Button} from '@zendeskgarden/react-buttons'

import {RelationshipData} from '../providers/sunshineProvider'
import css from './DeleteSection.css'

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
    <Grid className={css.DeleteSection}>
      <Row justifyContent="center" alignItems="center">
        <Col textAlign="center">
          <LG>Do you want to remove Invoice?</LG>
          <Button data-test-id="invoice-delete-cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            isDanger
            isPrimary
            data-test-id="invoice-delete-confirm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default DeleteSection
