const OBJECT_TYPE = 'invoice'
const RELATION_TYPE = 'deal_invoice'

export const createInvoice = (
  client: any,
  invoiceNumber: string,
  date: Date,
  dueDate: Date,
  amount: string,
  isPaid: boolean,
) => {
  const body = {
    data: {
      type: OBJECT_TYPE,
      attributes: {
        invoice_number: invoiceNumber,
        invoice_date: date,
        date_due: dueDate,
        amount: parseFloat(amount),
        is_paid: isPaid,
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
