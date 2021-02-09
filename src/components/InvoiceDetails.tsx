import * as React from 'react'
import moment from 'moment'
import {Body, Cell, Row, Table} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'

import {InvoiceData} from '../providers/sunshineProvider'

const InvoiceDetails = ({invoice}: {invoice: InvoiceData}) => {
  const {
    invoice_number,
    issue_date,
    due_date,
    due_amount,
    is_paid,
  } = invoice.attributes

  return (
    <Table>
      <Body>
        <Row>
          <Cell>
            <MD isBold>Invoice number</MD>
          </Cell>
          <Cell>{invoice_number}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Issue date</MD>
          </Cell>
          <Cell>{moment(issue_date).format('ll')}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Due date</MD>
          </Cell>
          <Cell>{moment(due_date).format('ll')}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Due amount</MD>
          </Cell>
          <Cell>${due_amount}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Status</MD>
          </Cell>
          <Cell>
            {is_paid ? (
              <Code hue="green">Paid</Code>
            ) : (
              <Code hue="red">Not Paid</Code>
            )}
          </Cell>
        </Row>
      </Body>
    </Table>
  )
}

export default InvoiceDetails
