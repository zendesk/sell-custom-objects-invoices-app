const OBJECT_TYPE = 'invoice'
const RELATION_TYPE = 'deal_invoice'

interface InvoiceAttributes {
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

export const createInvoice = (client: any, attributes: InvoiceAttributes) => {
  const body = {
    data: {
      type: OBJECT_TYPE,
      attributes: {
        invoice_number: attributes.invoiceNumber,
        issue_date: attributes.issueDate,
        due_date: attributes.dueDate,
        due_amount: parseFloat(attributes.dueAmount),
        is_paid: attributes.isPaid,
      },
    },
  }

  return client?.request({
    url: `/api/sunshine/objects/records`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(body),
  })
}

export const createRelation = (
  client: any,
  dealId: number,
  invoiceId: string,
) => {
  const data = {
    data: {
      relationship_type: RELATION_TYPE,
      source: `zen:deal:${dealId}`,
      target: invoiceId,
    },
  }

  return client?.request({
    url: `/api/sunshine/relationships/records`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  })
}
