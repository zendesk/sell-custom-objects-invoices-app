import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {useContext, useState} from 'react'
import {useClientHeight, ZAFClientContext} from '@zendesk/sell-zaf-app-toolbox'
import {Link} from 'react-router-dom'

const NewForm = () => {
  useClientHeight(400)
  const client = useContext(ZAFClientContext)

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [date, setDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [amount, setAmount] = useState('')
  const [isPaid, setIsPaid] = useState(false)

  const handleSubmit = (event: any) => {
    const body = {
      data: {
        type: 'invoice',
        attributes: {
          invoice_number: invoiceNumber,
          invoice_date: date,
          date_due: dueDate,
          amount: parseFloat(amount),
          is_paid: isPaid,
        },
      },
    }

    client?.request({
      url: `/api/sunshine/objects/records`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(body),
    })
    event.preventDefault()
  }

  const handleInvoiceNumber = (event: {target: {value: string}}) =>
    setInvoiceNumber(event.target.value)
  const handleInvoiceAmount = (event: {target: {value: string}}) =>
    setAmount(event.target.value)
  const handleInvoiceDate = (invoiceDate: Date) => setDate(invoiceDate)
  const handleInvoiceDueDate = (invoiceDueDate: Date) =>
    setDueDate(invoiceDueDate)
  const handleInvoiceIsPaid = () => setIsPaid(!isPaid)

  return (
    <form onSubmit={handleSubmit}>
      <Row justifyContent="center">
        <Col sm={5}>
          <Field>
            <Label>Invoice number</Label>
            <Input value={invoiceNumber} onChange={handleInvoiceNumber} />
          </Field>
          <Field>
            <Label>Invoice date</Label>
            <Datepicker value={date} onChange={handleInvoiceDate}>
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Due date</Label>
            <Datepicker value={dueDate} onChange={handleInvoiceDueDate}>
              <Input />
            </Datepicker>
          </Field>
          <Field>
            <Label>Amount</Label>
            <Input
              value={amount}
              type="number"
              onChange={handleInvoiceAmount}
            />
          </Field>
          <Field>
            <Checkbox checked={isPaid} onChange={handleInvoiceIsPaid}>
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
