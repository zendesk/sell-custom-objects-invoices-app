import * as React from 'react'
import {ResponseHandler, useClientRequest} from '@zendesk/sell-zaf-app-toolbox'
import {Body, Cell, Row, Table} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'

import Loader from './Loader'
import EmptyState from './EmptyState'
import {InvoiceData, InvoiceResponse} from '../providers/sunshineProvider'

const InvoiceItem = ({invoiceData}: {invoiceData: InvoiceData}) => {
  console.log(invoiceData)
  const {attributes} = invoiceData

  const renderStatus = () =>
    attributes.is_paid ? (
      <Code hue="red">Not paid</Code>
    ) : (
      <Code hue="green">Paid</Code>
    )

  return (
    <div style={{overflowX: 'auto'}}>
      <Table style={{minWidth: 500}}>
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
            <Cell>{attributes.issue_date}</Cell>
          </Row>
          <Row>
            <Cell>
              <MD isBold>Due date</MD>
            </Cell>
            <Cell>{attributes.due_date}</Cell>
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
            <Cell>{renderStatus()}</Cell>
          </Row>
        </Body>
      </Table>
    </div>
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
