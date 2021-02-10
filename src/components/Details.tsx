import * as React from 'react'
import moment from 'moment'
import {Body, Cell, Row as TableRow, Table} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'
import {Grid, Row, Col} from '@zendeskgarden/react-grid'
import {Dropdown, Menu, Item, Trigger} from '@zendeskgarden/react-dropdowns'
import {IconButton} from '@zendeskgarden/react-buttons'
import MenuIcon from '@zendeskgarden/svg-icons/src/16/menu-fill.svg'

import {InvoiceData} from '../providers/sunshineProvider'

const Details = ({
  invoice,
  onEdit,
  onDelete,
}: {
  invoice: InvoiceData
  onEdit: any
  onDelete: any
}) => {
  const {
    invoice_number,
    issue_date,
    due_date,
    due_amount,
    is_paid,
  } = invoice.attributes

  const handleSelect = (item: string) =>
    item === 'delete' ? onDelete() : onEdit()

  return (
    <Grid>
      <Row>
        <Col textAlign="end">
          <Dropdown onSelect={handleSelect}>
            <Trigger>
              <IconButton aria-label="plant">
                <MenuIcon />
              </IconButton>
            </Trigger>
            <Menu>
              <Item value="edit" data-test-id="invoice-edit">
                Edit
              </Item>
              <Item value="delete" data-test-id="invoice-delete">
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
              <Cell>{invoice_number}</Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Issue date</MD>
              </Cell>
              <Cell>{moment(issue_date).format('ll')}</Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Due date</MD>
              </Cell>
              <Cell>{moment(due_date).format('ll')}</Cell>
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Due amount</MD>
              </Cell>
              <Cell>${due_amount}</Cell>
            </TableRow>
            <TableRow>
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
            </TableRow>
          </Body>
        </Table>
      </Row>
    </Grid>
  )
}

export default Details
