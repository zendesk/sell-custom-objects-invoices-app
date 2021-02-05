import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'
import {Body, Cell, Row, Table} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'
import moment from 'moment'

import Loader from './Loader'
import EmptyState from './EmptyState'
import {InvoiceData, InvoiceResponse} from '../providers/sunshineProvider'

const InvoiceItem = ({invoiceData}: {invoiceData: InvoiceData}) => {
  const {attributes} = invoiceData

  return (
    <Table>
      <Body>
        <Row>
          <Cell>
            <MD isBold>Invoice number</MD>
          </Cell>
          <Cell>{attributes.invoice_number}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Issue date</MD>
          </Cell>
          <Cell>{moment(attributes.issue_date).format('ll')}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Due date</MD>
          </Cell>
          <Cell>{moment(attributes.due_date).format('ll')}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Due amount</MD>
          </Cell>
          <Cell>${attributes.due_amount}</Cell>
        </Row>
        <Row>
          <Cell>
            <MD isBold>Status</MD>
          </Cell>
          <Cell>
            {attributes.is_paid ? (
              <Code hue="red">Not paid</Code>
            ) : (
              <Code hue="green">Paid</Code>
            )}
          </Cell>
        </Row>
      </Body>
    </Table>
  )
}

const InvoiceView = ({dealId}: {dealId: string}) => {
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

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
        <InvoiceItem invoiceData={response.data[0]} />
      )}
    </ResponseHandler>
  )
}

export default InvoiceView
