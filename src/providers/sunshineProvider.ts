import {NewFormAttributes} from '../components/NewForm'

const OBJECT_TYPE = 'invoice'
export const RELATION_TYPE = 'deal_invoice'

export interface InvoiceResponse {
  data: InvoiceData
}
export interface InvoiceData {
  type: string
  id: string
  external_id: any
  attributes: InvoiceAttributes
  created_at: string
  updated_at: string
}

export interface InvoiceAttributes {
  invoice_number: string
  issue_date: string
  due_date: string
  due_amount: number
  is_paid: boolean
}

export interface RelationshipResponse {
  data: RelationshipData[]
  links: RelationshipLinks
}

export interface RelationshipData {
  id: string
  relationship_type: string
  source: string
  target: string
  created_at: string
}

interface RelationshipLinks {
  previous: any
  next: any
}

export const createInvoice = (client: any, attributes: NewFormAttributes) => {
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

export const deleteRelation = (client: any, relationId: string) => {
  return client?.request({
    url: `/api/sunshine/relationships/records/${relationId}`,
    method: 'DELETE',
  })
}

export const deleteObject = (client: any, objectId: string) => {
  return client?.request({
    url: `/api/sunshine/objects/records/${objectId}`,
    method: 'DELETE',
  })
}
