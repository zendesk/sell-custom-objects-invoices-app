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
  return (
    <Grid>
      <Row>
        <LG>Do you want to remove Invoice?</LG>
      </Row>
      <Row>
        <Button onClick={onCancel}>Cancel</Button>
        <Button isDanger onClick={onDelete}>
          Delete
        </Button>
        {/*<pre>{JSON.stringify(relation, null, 2)}</pre>*/}
      </Row>
    </Grid>
  )
}

export default Delete
