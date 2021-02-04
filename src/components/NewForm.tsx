import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col, Grid} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useState} from 'react'
import {Link} from 'react-router-dom'

export interface NewFormAttributes {
  dealId: number
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

const NewForm = ({
  dealId,
  onSubmittedForm,
}: {
  dealId: number
  onSubmittedForm: any
}) => {
  const [attributes, setAttributes] = useState({
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(),
    dueAmount: '',
    isPaid: false,
  })

  const handleSubmit = () => onSubmittedForm({...attributes, dealId})

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
              value={attributes.invoiceNumber}
              onChange={handleInvoiceNumber}
            />
          </Field>
          <Field>
            <Label>Issue date</Label>
            <Datepicker value={attributes.issueDate} onChange={handleIssueDate}>
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due date</Label>
            <Datepicker value={attributes.dueDate} onChange={handleDueDate}>
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due amount</Label>
            <Input
              value={attributes.dueAmount}
              type="number"
              onChange={handleDueAmount}
            />
          </Field>
          <Field>
            <Checkbox checked={attributes.isPaid} onChange={handleIsPaid}>
              <Label>Is paid</Label>
            </Checkbox>
          </Field>
        </Col>
      </Row>
      <Row>
        <Link to="/">
          <Button isDanger>Cancel</Button>
        </Link>
        <Button onClick={handleSubmit}>Create</Button>
      </Row>
    </Grid>
  )
}

export default NewForm
