
### Building your first Sell Custom Objects app in React- Part 3: Implementation details

In the previous part of tutorial from this series, you managed to setup Custom Objects schema on your account and run the showcase application locally. We hope you found some time to play with the application as well.
Now, when you get a grasp of how an example application maid on the top of Sunshine Custom Objects API may work, lest dive into details and see how it is implemented under the hood.
This part of the tutorial covers the following tasks: 

    
1. [Getting data from Sunshine API](#getting-data)    
2. [Create Objects & Relations via Sunshine API ](#create-objects)    
3. [Edit Objects via Sunshine API](#edit-objects)    
4. [Delete Objects & Relations via Sunshine API](#delete-objects)    
    
This tutorial is the second part of a series on building a Zendesk app:    
    
- [Part 1: Laying the groundwork](https://develop.zendesk.com/hc/en-us/articles/...)    
- [Part 2: Running showcase app locally]()  
- Part 3: Implementation details - YOU ARE HERE  

    
<h3 id="getting-data">Getting data from Sunshine API</h3>

You probably noticed that our application is a simple CRUD. In this section we will focus on Reading data using [Sunshine Custom Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api).
Open our main component `<App >` (**src/index.tsx**) and look at `return` method.
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
Within the `Router` section you can see that `EntryView` is rendered as our default path. Let's see the details of this component. Open **src/EntryView.tsx** in your favourite editor.

This is a simple component which makes HTTP request and then displays the data. 

***The convention within this tutorial assumes that `XyzView.tsx` components are responsible for gathering the data and performing actions (HTTP requests)***

  
```js  
export const EntryView = () => {
  useClientHeight(250)
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
  
The first request sits in the [useClientGet](https://github.com/zendesk/sell-zaf-app-toolbox#useclientgetpath) hook. It uses `client.get()` under the hood to get a Deal based on a current location. Simply put it will call `client.get('deal.id')` for our location.  
  
  
[useClientHeigh](https://github.com/zendesk/sell-zaf-app-toolbox#useclientheightheight) is another hook which is pretty useful when you need to manage an app height. It accepts a height value and calls `client.invoke(‘resize’ , {height})` underneath.  
  
`<ResponseHandler/>` component is responsible for handling asynchronous requests. Depending on a request status it can display a loader, an error state or an empty state. When the request has been finished successfully a child component with the response data is being rendered.  

At this point we already got `deal.id` and we can pass it to `DetailsView` component. Open **src/components/DetailsViews.tsx**.

```js
const DetailsView = ({dealId}: {dealId: string}) => {
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleEdit = useCallback(() => history.push('/edit'), [])
  const handleDelete = useCallback(() => history.push('/delete'), [])

  const isRelationEmpty = (response: {data: InvoiceResponse}) =>
    response.data.data.length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<EmptyState />}
      isEmpty={isRelationEmpty}
    >
      {([response]: [InvoiceResponse]) => (
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
This component is also responsible for gathering data based on provided `dealId` prop - it calls Sunshine API to find related record of  Custom Object  type `Invoice` for given `dealId`.

It uses [useClientRequest](https://github.com/zendesk/sell-zaf-app-toolbox#useclientrequesturl-options-dependencies-cachekey) hook to perform a `GET` request on [Related Object Records API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#list-related-object-records). As you probably remember we defined our 1:1 Relationship type as:
```
{
  key: 'deal_invoice',
  source: 'zen:deal',
  target: 'invoice',
  ....
}
```
An example request to fetch related `Invoice` for our Deal will look like this:

`https://..../api/sunshine/objects/records/zen:deal:21730067/related/deal_invoice`

Where `21730067` is a `dealId` of a Deal from our current location, provided as a prop and `deal_invoice` is a `relationship_type_key` that we are looking for.

In this case `<ResponseHandler/>` also covers asynchronous requests. Moreover it allows to provide a method  `isEmpty`  as a prop to check whether the response is empty or not. In case it's empty (no `Invoice` records created yet) component provided as`emptyView` prop will be rendered. In our case it is `<EmptyState />`.

When response in not empty `Invoice` record is passed to a **Details.js** component responsible for rendering its attributes.


<h3 id="create-objects">Create Object & Relation via Sunshine API</h3>

In this section we will talk about the situation when above's response is empty, so there is no `Invoice` yet and we would like to add new record. 
**EmptyState.tsx** component responsible for handling this scenario simply display a button to add new `Invoie` and navigates to **NewView.tsx** throughout  `/new` path. 

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

Like mentioned above adding new `Invoice` record is handled by **NewView.tsx**. 
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

This component renders `<NewForm>` and provides it with `dealId` and a `onSubmittedForm` prop that is invoked once form is submitted.

Function `handleSubmittedForm`  gets invoice attributes passed from the form and performs two actions - `createInvoice` and `createRelation`  implemented within `SunshineProvider.ts` .

**`createInvoice`**

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
This method makes a POST request to [Create Object record API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#create-object-record) and creates a new record of `Invoice`. A `client` performing the request is an instance of  [ZAF Client](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api) initialised in `<App>` component. 
As a response we get `Invoice` record and we can use it's `id` to create a relation between Deal na `Invoice`.


**`createRelation`**
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
This method runs just after we get the response from `createInvoice` and as a param requires `dealId` and `invoiceId` . As an outcome it makes a POST request to [Create Relationship record API](https://developer.zendesk.com/rest_api/docs/sunshine/relationships#create-relationship-record) and creates a new record of linking `Invoice` and Deal. A `client` performing the request (passed as a param) is also an instance of  [ZAF Client](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api) initialised in `<App>` component. 


At the end we navigate back to `EntryView` using `history.push('/')` available by using [React Router](https://reactrouter.com/). At this point it will load our newly created `Invoice` as described in [Getting data from Sunshine API](#getting-data)  

<h3 id="edit-objects">Edit Objects via Sunshine API</h3>

In this section  we will show how to edit Custom Object records using Sunshine API. It happens when you navigated  to `/edit`  form `<Details>`. This action is handled by `<EditView>`.

```js
const EditView = ({dealId}: {dealId: string}) => {
  useClientHeight(400)
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
At first we pull existing `Invoice` record from  [Related Object Records API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#list-related-object-records)
```js
const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )
```
in order to be able to edit its current  attributes. The response is  handled by `<ResponseHandler>` like before and passed to `<EditForm>` along with `onSubmittedForm` prop.
 
Similary to `Create` function `handleSubmittedForm` gets invoice attributes passed from the form and performs an action - `updaeInvoice` implemented within `SunshineProvider.ts` .

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
Based on `invoiceId` provided in params this method makes a `PATCH` request to [Update Object  Record API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#update-object-record). 
*Note `contentType: 'application/merge-patch+json'`

<h3 id="delete-objects">Delete Objects & Relations via Sunshine API</h3>

Last action available to perform in our showcase application is a detach of the `Invoice`  record from given Deal. It can be performed from `<Details>` view and by clicking Button that navigates  to `/delete`  path handled by `<DeleteView>` component.

```js
const DeleteView = ({dealId}: {dealId: string}) => {
  const client = useContext(ZAFClientContext)
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/relationships/records?type=${RELATION_TYPE}`,
  )

  const handleCancel = useCallback(() => history.push('/'), [])
  const handleDelete = useCallback(
    async (relationId: string, invoiceId: string) => {
      await deleteRelation(client, relationId)
      await deleteObject(client, invoiceId)
      history.push('/')
    },
    [],
  )
  const isRelationEmpty = (response: RelationshipListResponse) =>
    response.data.length === 0

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
                relation.source === `zen:deal:${dealId}`,
            ) as RelationshipData
          }
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </ResponseHandler>
  )
}
```

It works similar to `create` action - once `handleDelete` method is being invoked two actions - `deleteRelation` and `deleteInvoice`  implemented within `SunshineProvider.ts` are performed.
Sunshine API requires given order of those requests as we at first have to detach the relation and then we can remove Custom Object record.

**deleteRelation** & **deleteInvoice**
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

Both actions make `DELETE` request to APIs  - [Delete Object record](https://developer.zendesk.com/rest_api/docs/sunshine/resources#delete-object-record)  & [Delete  Relation record](https://developer.zendesk.com/rest_api/docs/sunshine/relationships#delete-relationship-record) and requires `id` of given object.
Like before a `client` performing the request is an instance of  [ZAF Client](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api) initialised in `<App>` component and passed as argument.


### Summary
In this part of tutorial we have guided you throughout the implementation of the showcase  application and explained how to perform  basic  CRUD actions on [Custom  Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api) from within Sell App framework  app.

In the last Part 4 of the tutorial we will show you how to install the app as private and prepare production build.
