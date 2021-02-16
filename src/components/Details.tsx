import * as React from 'react'
import moment from 'moment'
import {Body, Cell, Row as TableRow, Table} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'
import {Grid, Row, Col} from '@zendeskgarden/react-grid'
import {Dropdown, Menu, Item, Trigger} from '@zendeskgarden/react-dropdowns'
import {IconButton} from '@zendeskgarden/react-buttons'
import MenuIcon from '@zendeskgarden/svg-icons/src/16/menu-fill.svg'

import {InvoiceData} from '../providers/sunshineProvider'

enum InvoiceActions {
  Delete = 'delete',
  Edit = 'edit',
}

const Details = ({
  invoice,
  onEdit,
  onDelete,
}: {
  invoice: InvoiceData
  onEdit: () => void
  onDelete: () => void
}) => {
  const {
    invoice_number,
    issue_date,
    due_date,
    due_amount,
    is_paid,
  } = invoice.attributes

  const handleSelect = (item: string) => {
    switch (item) {
      case InvoiceActions.Delete:
        onDelete()
        break
      case InvoiceActions.Edit:
        onEdit()
        break
    }
  }

  return (
    <Grid>
      <Row>
        <Col textAlign="end">
          <Dropdown onSelect={handleSelect}>
            <Trigger>
              <IconButton data-test-id="invoice-actions" aria-label="plant">
                <MenuIcon />
              </IconButton>
            </Trigger>
            <Menu>
              <Item value={InvoiceActions.Edit} data-test-id="invoice-edit">
                Edit
              </Item>
              <Item value={InvoiceActions.Delete} data-test-id="invoice-delete">
                Delete
              </Item>
            </Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Table>
          <Body>
            <TableRow>
              <Cell>
                <MD isBold>Invoice number</MD>
              </Cell>
              <Cell data-test-id="invoice-number-value">{invoice_number}</Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Issue date</MD>
              </Cell>
              <Cell data-test-id="invoice-issue-date-value">
                {moment(issue_date).format('ll')}
              </Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Due date</MD>
              </Cell>
              <Cell data-test-id="invoice-due-date-value">
                {moment(due_date).format('ll')}
              </Cell>
            </TableRow>
            <TableRow>
              <Cell data-test-id="invoice-due-amount-value">
                <MD isBold>Due amount</MD>
              </Cell>
              <Cell>${due_amount}</Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Status</MD>
              </Cell>
              <Cell data-test-id="invoice-is-paid-value">
                {is_paid ? (
                  <Code hue="green">Paid</Code>
                ) : (
                  <Code hue="red">Not Paid</Code>
                )}
              </Cell>
            </TableRow>
          </Body>
        </Table>
      </Row>
    </Grid>
  )
}

export default Details
