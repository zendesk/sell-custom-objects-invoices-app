import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col, Grid} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useCallback, useState} from 'react'
import {Link} from 'react-router-dom'
import {InvoiceData} from 'src/providers/sunshineProvider'

import css from './Form.css'

export interface EditFormAttributes {
  dealId: number
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

const EditForm = ({
  invoice,
  onSubmittedForm,
}: {
  invoice: InvoiceData
  onSubmittedForm: (invoiceId: string, attributes: EditFormAttributes) => void
}) => {
  const invoiceAttributes = invoice.attributes
  const [attributes, setAttributes] = useState({
    invoiceNumber: invoiceAttributes.invoice_number,
    issueDate: new Date(invoiceAttributes.issue_date),
    dueDate: new Date(invoiceAttributes.due_date),
    dueAmount: invoiceAttributes.due_amount.toString(),
    isPaid: invoiceAttributes.is_paid,
  })

  const handleSubmit = useCallback(
    () => onSubmittedForm(invoice.id, {...attributes} as EditFormAttributes),
    [attributes],
  )

  const handleInvoiceNumber = useCallback(
    (event: {target: {value: string}}) =>
      setAttributes({...attributes, invoiceNumber: event.target.value}),
    [attributes],
  )

  const handleIssueDate = useCallback(
    (issueDate: Date) => setAttributes({...attributes, issueDate}),
    [attributes],
  )

  const handleDueDate = useCallback(
    (dueDate: Date) => setAttributes({...attributes, dueDate}),
    [attributes],
  )

  const handleDueAmount = useCallback(
    (event: {target: {value: string}}) =>
      setAttributes({...attributes, dueAmount: event.target.value}),
    [attributes],
  )

  const handleIsPaid = useCallback(
    () => setAttributes({...attributes, isPaid: !attributes.isPaid}),
    [attributes],
  )

  const isButtonDisabled = () =>
    attributes.invoiceNumber.length === 0 || attributes.dueAmount.length === 0

  return (
    <Grid className={css.Form}>
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
        <Col textAlign="end">
          <Link to="/">
            <Button data-test-id="invoice-update-cancel">Cancel</Button>
          </Link>
          <Button
            data-test-id="invoice-update"
            onClick={handleSubmit}
            isPrimary
            disabled={isButtonDisabled()}
          >
            Update
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default EditForm
