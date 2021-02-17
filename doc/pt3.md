
### Building your first Sell Custom Objects app in React- Part 3: Running showcase app locally

In the previous part of tutorial from this series, you managed to setup Custom Objects schema on your account and run the showcase application locally. We hope you found some time to play with the application as well.
Now when you get a grasp of how an example application build on the top of Sunshine Custom Objects may work, lest dive into details and see how it is under the hood.
This part of the tutorial covers the following tasks: 

    
1. [Getting data from Sunshine API](#getting-data)    
2. [Create Object & Relations via Sunshine API ](#create-objects)    
3. [Edit Objects via Sunshine API](#edit-objects)    
4. [Delete Objects & Relations via Sunshine API](#delete-objects)    
    
This tutorial is the second part of a series on building a Zendesk app:    
    
- [Part 1: Laying the groundwork](https://develop.zendesk.com/hc/en-us/articles/...)    
- [Part 2: Running showcase app locally]()  
- Part 3: Implementation details - YOU ARE HERE  

    
<h3 id="getting-data">Getting data from Sunshine API</h3>

You probably noticed that our application is a simple CRUD. In this section we will focus on Reading data using Sunshine API.
Open our main component `<App >` (`src/index.tsx`) one more time and look at `return` method.
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

At this point we already get `deal.id` and we can pass it to `DetailsView` component. Open **src/components/DetailsViews.tsx**.

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
This component is also responsible for gathering the data based on provided `dealId` - it uses Sunshine API to find related Custom Objects `Invoice` record for given `dealId`.

It uses [useClientRequest](https://github.com/zendesk/sell-zaf-app-toolbox#useclientrequesturl-options-dependencies-cachekey) hook to perform a `GET` request on [Related Object Records API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#list-related-object-records). As you probably remember we defined our 1:1 Relationship type as:
```
{
  key: 'deal_invoice',
  source: 'zen:deal',
  target: 'invoice',
  ....
}
```

In this case `<ResponseHandler/>` also covers asynchronous requests. Moreover it allows to provide a method as a  `isEmpty` prop to check whether the response is empty or not. In case it's empty (no `Invoice` record created yet) component provided as`emptyView` prop will be rendered. In our case it is `<EmptyState />`.


<h3 id="create-objects">Create Object & Relations via Sunshine API</h3>

<h3 id="edit-objects">Edit Objects via Sunshine API</h3>

<h3 id="delete-objects">Delete Objects & Relations via Sunshine API</h3>
