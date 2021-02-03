import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useContext, useState} from 'react'
import {useClientHeight, ZAFClientContext} from '@zendesk/sell-zaf-app-toolbox'
import {Link} from 'react-router-dom'

import {createInvoice, createRelation} from '../providers/sunshineProvider'

const NewForm = () => {
  useClientHeight(400)
  const client = useContext(ZAFClientContext)

  const [attributes, setAttributes] = useState({
    number: '',
    date: new Date(),
    dueDate: new Date(),
    amount: '',
    isPaid: false,
  })

  const handleSubmit = (event: any) => {
    createInvoice(client, attributes).then((response: any) =>
      createRelation(client, 19616494, response.data.id),
    )
    event.preventDefault()
  }

  const handleInvoiceNumber = (event: {target: {value: string}}) =>
    setAttributes({...attributes, number: event.target.value})

  const handleInvoiceAmount = (event: {target: {value: string}}) =>
    setAttributes({...attributes, amount: event.target.value})

  const handleInvoiceDate = (invoiceDate: Date) =>
    setAttributes({...attributes, date: invoiceDate})

  const handleInvoiceDueDate = (invoiceDueDate: Date) =>
    setAttributes({...attributes, dueDate: invoiceDueDate})

  const handleInvoiceIsPaid = () =>
    setAttributes({...attributes, isPaid: !attributes.isPaid})

  return (
    <form onSubmit={handleSubmit}>
      <Row justifyContent="center">
        <Col sm={5}>
          <Field>
            <Label>Invoice number</Label>
            <Input value={attributes.number} onChange={handleInvoiceNumber} />
          </Field>
          <Field>
            <Label>Invoice date</Label>
            <Datepicker value={attributes.date} onChange={handleInvoiceDate}>
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due date</Label>
            <Datepicker
              value={attributes.dueDate}
              onChange={handleInvoiceDueDate}
            >
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Amount</Label>
            <Input
              value={attributes.amount}
              type="number"
              onChange={handleInvoiceAmount}
            />
          </Field>
          <Field>
            <Checkbox
              checked={attributes.isPaid}
              onChange={handleInvoiceIsPaid}
            >
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
