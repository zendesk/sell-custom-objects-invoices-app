import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col, Grid} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import {InvoiceData} from 'src/providers/sunshineProvider'

export interface EditFormAttributes {
  dealId: number
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

const Edit = ({
  invoice,
  onSubmittedForm,
}: {
  invoice: InvoiceData
  onSubmittedForm: any
}) => {
  const invoiceAttributes = invoice.attributes
  const [attributes, setAttributes] = useState({
    invoiceNumber: invoiceAttributes.invoice_number,
    issueDate: new Date(invoiceAttributes.issue_date),
    dueDate: new Date(invoiceAttributes.due_date),
    dueAmount: invoiceAttributes.due_amount.toString(),
    isPaid: invoiceAttributes.is_paid,
  })

  const handleSubmit = () => onSubmittedForm(invoice.id, {...attributes})

  const handleInvoiceNumber = (event: {target: {value: string}}) =>
    setAttributes({...attributes, invoiceNumber: event.target.value})

  const handleIssueDate = (issueDate: Date) =>
    setAttributes({...attributes, issueDate})

  const handleDueDate = (dueDate: Date) =>
    setAttributes({...attributes, dueDate})

  const handleDueAmount = (event: {target: {value: string}}) =>
    setAttributes({...attributes, dueAmount: event.target.value})

  const handleIsPaid = () =>
    setAttributes({...attributes, isPaid: !attributes.isPaid})

  return (
    <Grid>
      <Row justifyContent="center">
        <Col sm={5}>
          <Field>
            <Label>Invoice number</Label>
            <Input
              data-test-id="invoice-number"
              value={attributes.invoiceNumber}
              onChange={handleInvoiceNumber}
            />
          </Field>
          <Field>
            <Label>Issue date</Label>
            <Datepicker value={attributes.issueDate} onChange={handleIssueDate}>
              <Input data-test-id="invoice-issue-date" />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due date</Label>
            <Datepicker value={attributes.dueDate} onChange={handleDueDate}>
              <Input data-test-id="invoice-due-date" />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due amount</Label>
            <Input
              data-test-id="invoice-due-amount"
              value={attributes.dueAmount}
              type="number"
              onChange={handleDueAmount}
            />
          </Field>
          <Field>
            <Checkbox
              data-test-id="invoice-is-paid"
              checked={attributes.isPaid}
              onChange={handleIsPaid}
            >
              <Label>Is paid</Label>
            </Checkbox>
          </Field>
        </Col>
      </Row>
      <Row>
        <Link to="/">
          <Button data-test-id="invoice-update-cancel" isDanger>
            Cancel
          </Button>
        </Link>
        <Button data-test-id="invoice-update" onClick={handleSubmit}>
          Update
        </Button>
      </Row>
    </Grid>
  )
}

export default Edit
