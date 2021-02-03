import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useContext, useState} from 'react'
import {useClientHeight, ZAFClientContext} from '@zendesk/sell-zaf-app-toolbox'
import {Link} from 'react-router-dom'

import {
  createInvoice,
  createRelation,
  InvoiceResponse,
} from '../providers/sunshineProvider'

export interface NewFormAttributes {
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

const NewForm = () => {
  useClientHeight(400)
  const client = useContext(ZAFClientContext)

  const [attributes, setAttributes] = useState({
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(),
    dueAmount: '',
    isPaid: false,
  })

  const handleSubmit = (event: any) => {
    createInvoice(client, attributes).then((response: InvoiceResponse) =>
      createRelation(client, 19616494, response.data.id),
    )
    event.preventDefault()
  }

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
    <form onSubmit={handleSubmit}>
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
      <Link to="/">
        <Button isDanger>Cancel</Button>
      </Link>
      <Button type="submit">Create</Button>
    </form>
  )
}

export default NewForm
