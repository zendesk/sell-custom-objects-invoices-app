
## Building your first Sell Custom Objects app in React- Part 2: Running showcase app locally   
In the previous tutorial from this series, you installed the Zendesk CLI and get a grasp of how our app will work. Also, we went through the starter files that are required in order to install it successfully in a Zendesk product. In this tutorial, you'll see in what location in Zendesk Sell interface the app will be displayed and learn how to run the app locally. The tutorial covers the following tasks:  
  
1. [Setting the app's location in Sell](#setting-app-location)  
2. [Review the template files](#reviewing-template-files)  
3. [Setup Custom Objects schema](#setup-custom-objects-schema)  
4. [Run the application locally](#run-the-app-locally)  
5. [Test the application](#test-application)  
  
This tutorial is the second part of a series on building a Zendesk app:  
  
- [Part 1: Laying the groundwork](https://develop.zendesk.com/hc/en-us/articles/...)  
- Part 2: Running showcase app locally - YOU ARE HERE  
- [Part 3: OAuth 2.0 setup](https://develop.zendesk.com/hc/en-us/articles/...)  
- [Part 4: Creating audiences in Mailchimp](https://develop.zendesk.com/hc/en-us/articles/...)  
- [Part 5: Getting data from the Mailchimp API](https://develop.zendesk.com/hc/en-us/articles/...)  
  
<h3 id="setting-app-location">Setting the app's location in Sell</h3>  
  
You can run a Zendesk app in [different locations](https://developer.zendesk.com/apps/docs/apps-sell-api/introduction) in the Zendesk Sell user interface. In this tutorial, we set the app's location to the sidebar of the Deal page that opens after an opening a Deal card:  
  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/person_card_location.png" alt="Person card location" width="600"/>  
  
**App locations in Sell**  
  
- Open the file named **manifest.json** in your app folder ( **/dist/manifest.json** ).  
   The **manifest.json** file is used to configure the app.  
- You will see a location property with the following value:  
  
```json  
{
  ....
  "location":{
    "sell":{
      "deal_card":"assets/index.html"
    }
  }
  ....
}
```  
  
- In the future you can add different locations such as:
```json=
{
   ....
   "location":{
      "sell":{
         "lead_card":{
            "url":"assets/index.html"
         },
         "person_card":{
            "url":"assets/index.html"
         },
         "company_card":{
            "url":"assets/index.html"
         },
         "deal_card":{
            "url":"assets/index.html"
         }
      }
   }
   ....
}
``` 
  
<h3 id="reviewing-template-files">Reviewing the template files</h3>  
  
Your Zendesk app will live in an iframe on the `deal_card` location that we specified in the previous section. Like any iframe app, developing a Zendesk app consists of combining static and dynamic elements in the HTML file to be displayed in the iframe.  
  
Open the **index.html** file in your favourite code editor.  
  
```html  
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8" />  
    <title>Invoice</title>  
    <script src="https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js"></script>  
    <link  
      rel="stylesheet"  
      href="https://assets.zendesk.com/apps/sdk-assets/css/0/zendesk_garden.css"  
      type="text/css"  
    />  
  </head>  
  <body>  
    <div id="app"></div>
  </body>  
</html>  
  
```  
  
To interact with the Apps framework, the HTML file imports the ZAF SDK library in a script tag:  
  
```html  
<script src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"></script>  
```  
  
The SDK provides a ZAFClient global object that allows cross-frame communication between your app and the host Zendesk product. After importing the SDK, you can use the `ZAFClient.init()` method to create an apps API client:  
  
`const client = ZAFClient.init()`  
  
The client provides an interface between your app and a host application such as Zendesk Sell. The client gives you a number of methods to interact with the Apps framework. Use the `get()` and `set()` methods to read and write data in the framework APIs. Use the `invoke()` method to run methods in the framework APIs. Use the `request()` method to make HTTP requests to any REST API. Use the `on()` method to listen to [events](https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#working-with-framework-events). For details, see the [ZAF Client API doc](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api). Due to the nature of cross-frame communication, every interaction between your iframe and the framework happens asynchronously.  
  
We initialize the client in the **src/index.tsx** file inside a root `<App/>` component. To initialize the client only once we use React [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) hook.  
  
```js  
declare var ZAFClient: {
  init: () => Client
}

const App = () => {
  const client = useMemo(() => ZAFClient.init(), [])
  return (
    <ZAFClientContextProvider value={client}>
      <ThemeProvider>
        <Router>
          <Switch>
            <Route exact path="/new" component={NewView} />
            <Route exact path="/edit" component={EditEntryView} />
            <Route exact path="/delete" component={DeleteView} />
            <Route component={EntryView} />
          </Switch>
        </Router>
      </ThemeProvider>
    </ZAFClientContextProvider>
  )
}
```  
  
The `<App/>` component is going to be rendered in the div container with id `'app'`.  
  
```js  
ReactDOM.render(<App />, document.getElementById('app'))  
```  
  
The div is defined in the **index.html** within the `<body>` tag.  
  
Then we use [React Context](https://reactjs.org/docs/context.html) to make the `client` accessible to the component tree without having to pass it down manually at every level.  
  
```js  
<ZAFClientContextProvider value={client}>  
```  
  
`<ZAFClientContextProvider>` is a part of [@zendesk/sell-zaf-app-toolbox](https://github.com/zendesk/sell-zaf-app-toolbox) package which consists of many useful methods, hooks and components that help you build React apps integrated with Zendesk Sell quicker and with less effort.  
  
We also use [Zendesk Garden](<(https://garden.zendesk.com/)>) as the UI framework. Zendesk Garden is designed to be a common baseline of styles and components between all Zendesk products. It provides, for example, [customizable React components](https://garden.zendesk.com/components) such as spinners, buttons etc., that can be easily included in the project. Use the Zendesk Garden assets if you want your app to match the look and feel of Zendesk products.  
  
As you can see, all components are wrapped in `<ThemeProvider>` delivered by [@zendeskgarden/react-theming](https://github.com/zendeskgarden/react-components/tree/main/packages/theming) package to provide a default global theming for nested components.  
  
```js  
<ThemeProvider>
  <Router>
	....
  </Router>
</ThemeProvider>
```  
  
You don't have to use Zendesk Garden in your future projects. The choice is yours. For example, you could import the popular [Bootstrap CSS](http://getbootstrap.com/css/). For this tutorial, you'll stick with the Zendesk Garden styles. 

For the purpose of this Tutorial we have also used an external common library to manage navigation between application views. See more details here: https://reactrouter.com/  
  
Now, when you're familiar with the main concept of the application, let’s run the app in your Zendesk Sell instance and check how it works!  
  
<h3 id="setup-custom-objects-schema">Setup Custom Objects schema</h3>

In order to be able to use our showcase application you have to create a Custom Object type representing an `invoice`  and setup `Relationship` between standard Sell Object (`zen:deal` ) and `invoice` .



You can use **Admin Center** to manually create [Objects Types](https://developer.zendesk.com/rest_api/docs/sunshine/resource_types) and [Relationships](https://developer.zendesk.com/rest_api/docs/sunshine/relationship_types), but in our case to make sure there won't be any mistakes let's run the script that will automatically create the schema for you. The script is available  in main directory - `custom_objects_schema_setup.js`

Open `custom_objects_schema_setup.js` file in your editor
At the top of the file provide necessary details:
* SUBDOMAIN
* E-MAIL
* ACCESS_TOKEN - API tokens are managed in the Support admin interface at **Admin** > **Channels** > **API**.  Add new API token if need and place it in the script (remember to not expose your token publicly)

In our project root directory run:
`$ node custom_objects_schema_setup.js` 

As a result you should see:
```json
Object type:
 {
  key: 'invoice',
  schema: {
    properties: {
      invoice_number: [Object],
      issue_date: [Object],
      due_date: [Object],
      due_amount: [Object],
      is_paid: [Object]
    },
    ....
}

Relation type:
 {
  key: 'deal_invoice',
  source: 'zen:deal',
  target: 'invoice',
  created_at: '2021-02-16T14:21:14.000Z',
  updated_at: '2021-02-16T14:21:14.000Z'
}

Setup is ready. Please follow the next steps of tutorial.
```
Now your schema is all set. You can review created Object Type and relation in **Admin Center** > **Sunshine** > **Objects** / **Relationships** and we can proceed to running the app locally.

<h3 id="run-the-app-locally">Run the app locally</h3>
Using your command-line interface navigate to the folder containing the app you want to test.

Install dependencies if necessary:

`$ npm install`

Start your app with the following command:

`$ npm start`

Open a new window in your terminal and start the server:

`$ npm run server`

Optionally: In your browser's Address bar, click the shield icon on the right (Chrome) or lock icon on the left (Firefox) and agree to load an unsafe script (Chrome) or to disable protection (Firefox).

Note: Safari has no option to disable protection.

<h3 id="test-application">Test application</h3>

Once you have your app running locally, let’s see if the app works and is displayed in the right place. First, we have to create a Deal and then visit its card, because this is the place where the app is supposed to be visible. Click **Add** button on the topbar and choose **Deal** option from the dropdown.  
  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/add_contact_person_in_sell.png" alt="Add a contact person to Sell" width="600"/>  
  
Fill in the form with at least **Deal Name** and **Primary Contact** then click **Save & view deal**.  
  
 You will land on your new Deal page. In order to see our locally running application please append  `?zcli_apps=true`  to the URL. Example:  [https://app.futuresimple.com/sales/deals/123?zcli_apps=true](https://app.futuresimple.com/sales/deals/123?zcli_apps=true)
 
At this point the tutorial app should be there!
  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/app_on_person_card.png" alt="Add a contact person to Sell" width="600"/> 

***You can now play with the showcase app and try to Create/ Edit / Remove an Invoice!***
