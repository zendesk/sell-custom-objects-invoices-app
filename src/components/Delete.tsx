import * as React from 'react'
import {Grid, Row} from '@zendeskgarden/react-grid'
import {LG} from '@zendeskgarden/react-typography'
import {Button} from '@zendeskgarden/react-buttons'

import {RelationshipData} from '../providers/sunshineProvider'

const Delete = ({
  relation,
  onCancel,
  onDelete,
}: {
  relation: RelationshipData
  onCancel: any
  onDelete: any
}) => {
  const handleDelete = () => onDelete(relation.id, relation.target)

  return (
    <Grid>
      <Row>
        <LG>Do you want to remove Invoice?</LG>
      </Row>
      <Row>
        <Button onClick={onCancel}>Cancel</Button>
        <Button isDanger onClick={handleDelete}>
          Delete
        </Button>
      </Row>
    </Grid>
  )
}

export default Delete
