const OBJECT_TYPE = 'invoice'
const RELATION_TYPE = 'deal_invoice'

export const createInvoice = (client: any, attributes: any) => {
  const body = {
    data: {
      type: OBJECT_TYPE,
      attributes: {
        invoice_number: attributes.number,
        invoice_date: attributes.date,
        date_due: attributes.dueDate,
        amount: parseFloat(attributes.amount),
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
