
## Building your first custom objects app for Sell- Part 3: Implementation details

<!--
Title: Build your first custom objects app for Sell - Part 3: Implementation details 
-->

In the previous tutorial of this series, you created the custom objects schema and learnt how to test your app locally.

In this tutorial, you'll learn about how to create, read, update, or delete (CRUD) records using the Custom Objects API in the app.

This part of the tutorial covers the following tasks: 
    
- [Getting data](#getting-data)    
- [Creating objects and relationships](#create-objects)    
- [Editing objects](#edit-objects)    
- [Deleting objects and relationships](#delete-objects)    
    
This tutorial is the third part of a series on building a Zendesk app:    
    
- [Part 1: Laying the groundwork](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)    
- [Part 2: Testing the app](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)  
- Part 3: Implementation details - YOU ARE HERE
- [Part 4: Installing the app in Sell ](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)    

    
<h3 id="getting-data">Getting data</h3>

In this section, you'll learn how data is read using the [Custom Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api).

In **sell-custom-objects-app-tutorial** > **src**, the **index.tsx** file contains a `return` method.
```js
return (
	...   
        <Router>
          <Switch>
            <Route exact path="/new" component={NewView} />
            <Route exact path="/edit" component={EditEntryView} />
            <Route exact path="/delete" component={DeleteView} />
            <Route component={EntryView} />
          </Switch>
        </Router>
    ...
  )
```
In the `Router` section, "EntryView" is defined as the default path. If you view the **src/EntryView.tsx** file, it is a component which makes an HTTP request and then displays the data. All **`name`View.tsx** files are responsible for gathering the data and HTTP requests.
  
```js  
export const EntryView = () => {
  useClientHeight(215)
  const dealIdResponse = useClientGet('deal.id')

  return (
    <Grid gutters={false} className={css.App}>
      <Row>
        <ResponseHandler
          response={dealIdResponse}
          loadingView={<Loader />}
          errorView={<div>Something went wrong!</div>}
          emptyView={<div>There is no Deal</div>}
        >
          {([dealId]: [string]) => <DetailsView dealId={dealId} />}
        </ResponseHandler>
      </Row>
    </Grid>
  )
}
```  
  
The first request is in the [useClientGet](https://github.com/zendesk/sell-zaf-app-toolbox#useclientgetpath) hook. It uses the `client.get()` method to retrieve a deal based on a current location. That is, it calls `client.get('deal.id')` for the location.  
  
[useClientHeight](https://github.com/zendesk/sell-zaf-app-toolbox#useclientheightheight) is another hook that is useful when you need to manage an app's height. It accepts a height value and calls `client.invoke(‘resize’ , {height})`.  
  
`<ResponseHandler/>` component is responsible for handling asynchronous requests. Depending on a request status it can display a loader, an error state, or an empty state. When the request has finished successfully, a child component with the response data will be rendered.  

At this point, there's a `deal.id` which can be passed to the `DetailsView` component. Open **src/components/DetailsViews.tsx**.

```js
const DetailsView = ({dealId}: {dealId: string}) => {
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleEdit = useCallback(() => history.push('/edit'), [])
  const handleDelete = useCallback(() => history.push('/delete'), [])

  const isInvoiceListEmpty = (response: {data: InvoiceListResponse}) =>
    response.data.data.length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<EmptyState />}
      isEmpty={isInvoiceListEmpty}
    >
      {([response]: [InvoiceListResponse]) => (
        <Details
          invoice={response.data[0]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  )
}
```
This component is responsible for gathering data based on the provided `dealId` prop. It calls the Custom Objects API to find the related record of custom object type `invoice` for a given `dealId`.

It uses the [useClientRequest](https://github.com/zendesk/sell-zaf-app-toolbox#useclientrequesturl-options-dependencies-cachekey) hook to perform a `GET` request on the [Related Object Records API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#list-related-object-records). As previously mentioned, the one-to-one relationship type is:
```
{
  key: 'deal_invoice',
  source: 'zen:deal',
  target: 'invoice',
  ....
}
```
An example request to fetch a related invoice for the deal would look like this:

`https://{your_sell_subdomain}/api/sunshine/objects/records/zen:deal:21730067/related/deal_invoice`

where `21730067` is the `dealId` of a deal from the current location. It is provided as a prop and `deal_invoice` is the relationship type key.

In this scenario, `<ResponseHandler/>` also covers asynchronous requests. It also provides an `isEmpty` method as a prop to check whether the response is empty or not. If no invoice records are created, an `emptyView` prop is rendered which is an `<EmptyState/>` component.

When the response is not empty, an `invoice` record is passed to a **Details.js** component responsible for rendering its attributes.

<h3 id="create-objects">Creating an custom object and relationship</h3>

In this section we will talk about the situation when above's response is empty, so there is no `Invoice` yet and we would like to add new record. 
**EmptyState.tsx** component responsible for handling this scenario displays a button to add a new `Invoice` and navigates to **NewView.tsx** via  `/new` path. 

```js
const EmptyState = () => {
  return (
   ...
        <Link to="/new">
          <Button data-test-id="invoice-new">Add Invoice</Button>
        </Link>
   ...
  )
}
```

We use standard `Garden UI` components such as `Button` which you can find here: https://garden.zendesk.com/components/button

As mentioned above, adding a new `Invoice` record is handled by **NewView.tsx**. 
```js
const NewView = () => {
  useClientHeight(400)
  const history = useHistory()
  const dealIdResponse = useClientGet('deal.id')
  const client = useContext(ZAFClientContext)

  const handleSubmittedForm = useCallback(
    async (attributes: NewFormAttributes) => {
      const invoiceResponse = (await createInvoice(
        client,
        attributes,
      )) as InvoiceResponse
      await createRelation(client, attributes.dealId, invoiceResponse.data.id)
      history.push('/')
    },
    [],
  )

  return (
    <ResponseHandler
      responses={[dealIdResponse]}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>There's nothing to see yet.</div>}
    >
      {([dealId]: [number]) => (
        <NewForm dealId={dealId} onSubmittedForm={handleSubmittedForm} />
      )}
    </ResponseHandler>
  )
}
```

This component renders `<NewForm>` with a `dealId` and a `onSubmittedForm` prop that is invoked once form is submitted.

The `handleSubmittedForm` function gets invoice attributes passed from the form and performs two actions - `createInvoice` and `createRelation` implemented in **src** > **providers** > **SunshineProvider.ts**.

**createInvoice**

```js
export const createInvoice = (
  client: Client | undefined,
  attributes: NewFormAttributes,
) => {
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
```

A POST request is made to [Create Object Record API](/rest_api/docs/sunshine/resources#create-object-record) endpoint and creates a new record of `Invoice`. A client performing the request is an instance of  [ZAF Client](/apps/docs/core-api/client_api#zaf-client-api) initialised in `<App>` component. 

In the response, the `id` in the `Invoice` record is used to create a relationship between deal and invoice.

**createRelation**

```js
export const createRelation = (
  client: Client | undefined,
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
```
This method runs after the `createInvoice` response and as a parameter requires the `dealId` and `invoiceId` parameters. It then makes a POST request to the [Create Relationship Record API](/rest_api/docs/sunshine/relationships#create-relationship-record) endpoint and creates a new record of linking `Invoice` and Deal. A client performing the request (passed as a parameter) is also an instance of [ZAF Client](/apps/docs/core-api/client_api#zaf-client-api) initialised in an `<App>` component. 

In the end, you navigate back to `EntryView` using `history.push('/')` available by using [React Router](https://reactrouter.com/). At this point it will load the newly created `Invoice` as described in earlier in this section.  

<h3 id="edit-objects">Editing objects</h3>

In this section, you'll learn how to edit object records using Custom Objects API. It happens when you navigate  to `/edit`  from `<Details>`. This action is handled by `EditView` function in **EditView.tsx** file.
<!--Not sure what the above paragraph means?-->

```js
const EditView = ({dealId}: {dealId: string}) => {
  const history = useHistory()
  const client = useContext(ZAFClientContext)

  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleSubmittedForm = useCallback(
    async (invoiceId: string, attributes: EditFormAttributes) => {
      await updateInvoice(client, invoiceId, attributes)
      history.push('/')
    },
    [],
  )
  const isInvoiceListEmpty = (response: {data: InvoiceListResponse}) =>
    response.data.data.length === 0

  return (
    <ResponseHandler
      responses={[sunshineResponse]}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>Couldn't find any related invoices</div>}
      isEmpty={isInvoiceListEmpty}
    >
      {([response]: [InvoiceListResponse]) => (
        <EditForm
          invoice={response.data[0]}
          onSubmittedForm={handleSubmittedForm}
        />
      )}
    </ResponseHandler>
  )
}
```
First, you can retrieve an `Invoice` record from the [Related Object Records API](/rest_api/docs/sunshine/resources#list-related-object-records) to edit its current attributes:
```js
const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )
```
The response is handled by `<ResponseHandler>` like before and passed to `<EditForm>` along with the `onSubmittedForm` prop.
 
Similarly to the `Create` function `handleSubmittedForm`, invoice attributes are passed from the form and performs an action where the `updateInvoice` implemented within the **SunshineProvider.ts** file.

**updateInvoice**

```js
export const updateInvoice = (
  client: Client | undefined,
  invoiceId: string,
  attributes: EditFormAttributes,
) => {
  const body = {
    data: {
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
    url: `/api/sunshine/objects/records/${invoiceId}`,
    method: 'PATCH',
    contentType: 'application/merge-patch+json',
    data: JSON.stringify(body),
  })
}
```
Based on `invoiceId` provided in parameters, this method makes a PATCH request to the [Update Object Record](/rest_api/docs/sunshine/resources#update-object-record) endpoint. Note, the Content-Type is specified as "application/merge-patch+json".

<h3 id="delete-objects">Deleting objects and relationships</h3>

The last action available in the app is detaching the invoice record from a deal. It can be performed from `<Details>` view by clicking the button which navigates to the `/delete` path handled by `<DeleteView>` component.

```js
const DeleteView = ({dealId}: {dealId: string}) => {
  const dealRelationName = `zen:deal:${dealId}`
  const client = useContext(ZAFClientContext)
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/relationships/records?type=${RELATION_TYPE}`,
  )

  const handleDelete = useCallback(
    async (relationId: string, invoiceId: string) => {
      await deleteRelation(client, relationId)
      await deleteObject(client, invoiceId)
      history.push('/')
    },
    [],
  )
  const isRelationEmpty = (response: {data: RelationshipListResponse}) =>
    response.data.data.filter(
      (relation: RelationshipData) => relation.source === dealRelationName,
    ).length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>Couldn't find any related invoices</div>}
      isEmpty={isRelationEmpty}
    >
      {([response]: [RelationshipListResponse]) => (
        <DeleteSection
          relation={
            response.data.find(
              (relation: RelationshipData) =>
                relation.source === dealRelationName,
            ) as RelationshipData
          }
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  )
}
```

It works similar to `create` action. Once the `handleDelete` method is invoked, two actions, `deleteRelation` and `deleteInvoice` are implemented in the **SunshineProvider.ts** file. Requests to the Custom Objects API are made in this order to first detach the relationship, then remove the Custom Object record.

**deleteRelation and deleteInvoice**
```js
export const deleteRelation = (
  client: Client | undefined,
  relationId: string,
) => {
  return client?.request({
    url: `/api/sunshine/relationships/records/${relationId}`,
    method: 'DELETE',
  })
}

export const deleteObject = (client: Client | undefined, objectId: string) => {
  return client?.request({
    url: `/api/sunshine/objects/records/${objectId}`,
    method: 'DELETE',
  })
}
```

DELETE requests are made to the [Delete Object record](/rest_api/docs/sunshine/resources#delete-object-record) and [Delete  Relation record](/rest_api/docs/sunshine/relationships#delete-relationship-record) endpoints, requiring the `id` of given object.

As before, a `client` performing the request is an instance of  [ZAF Client](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api) initialised in `<App>` component and passed as an argument.


This tutorial has explained app implementation details how to perform basic CRUD actions using the [Custom  Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api) from within the App framework for Sell.

In Part 4 of the tutorial, you will install the app as a private app in Sell and prepare a production build. Get started: []()
