## Build your first custom objects app for Sell - Part 2: Setting up and testing the app  

<!--
Title: Build your first custom objects app for Sell - Part 2: Setting up and testing the app
-->
  
In the previous tutorial from this series, you read about the app design requirements and installed the Zendesk CLI. Also, you downloaded the starter files to build and install the app in Zendesk Sell. 

In this tutorial, you'll set the app location in Zendesk Sell, create the schema for the custom object, and learn how to test the app locally. The tutorial covers the following tasks:      
      
- [Setting the app's location in Sell](#setting-app-location)      
- [Review the template files](#review-template-files)      
- [Creating the custom objects schema](#creating-custom-objects-schema)           
- [Testing the app](#test-app)      
      
This tutorial is the second part of a series on building an app for Zendesk Sell:      
      
- [Part 1: Laying the groundwork](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)      
- Part 2: Setting up and testing the app - YOU ARE HERE  
- [Part 3: Implementation details](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)
- [Part 4: Installing the app in Sell ](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)  
  
<!--TODO: Add dev doc links-->
<h3 id="setting-app-location">Setting the app's location in Sell</h3>

 You can run an app in [different locations](https://developer.zendesk.com/apps/docs/apps-sell-api/introduction) in the Sell user interface. In this tutorial,  the app's location is on the right side of the Deal card:   
      
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/developer/3.deal_sidebar.png" alt="Deal card location" width="600"/>          
     

The **manifest.json** file in your app scaffold template folder (**/dist/manifest.json**) is where you set the app location. It is pre-configured to the Deal card location.     
      
```      
"location": {
  "sell": {
    "deal_card": "assets/index.html"
  }
}, 
```       
      
<h3 id="reviewing-template-files">Reviewing the template files</h3>
      
Your Zendesk app will live in an iframe on the `deal_card` location that you configured in the previous section. Like any iframe app, developing a Zendesk app consists of combining static and dynamic elements in the HTML file to be displayed in the iframe.      
      
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

 The client provides an interface between your app and a host application such as Zendesk Sell. The client gives you a number of methods to interact with the Apps framework. Use the `get()` and `set()` methods to read and write data in the framework APIs. Use the `invoke()` method to run methods in the framework APIs. Use the `request()` method to make HTTP requests to any REST API. Use the `on()` method to listen to [events](https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#working-with-framework-events). 
 
 For more details, see the [ZAF Client API doc](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api).
 
 Note that due to the nature of cross-frame communication, every interaction between your iframe and the framework happens asynchronously.      
      
The client is initialized in the **src/index.tsx** file inside a root `<App/>` component. To initialize the client only once, you use the React [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) hook.      
      
```js      
declare var ZAFClient: {    
  init: () => Client }    
    
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
      
The `<App/>` component is rendered in the `div` container with id `'app'`.      
      
```js      
ReactDOM.render(<App />, document.getElementById('app'))      
```      
      
The `div` element is defined in the **index.html** file between the `<body>` tags.      
      
The[React Context](https://reactjs.org/docs/context.html) is used to make the `client` accessible to the component tree without having to pass it down manually at every level.      
      
```js      
<ZAFClientContextProvider value={client}>      
```      
      
`<ZAFClientContextProvider>` is a part of [@zendesk/sell-zaf-app-toolbox](https://github.com/zendesk/sell-zaf-app-toolbox) package which consists of many useful methods, hooks, and components that help you build and integrated React apps with Zendesk Sell quicker and with less effort.      
      
For this app,  [Zendesk Garden](https://garden.zendesk.com/) as the UI framework. Zendesk Garden is designed to be a common baseline of styles and components between all Zendesk products. For example, it provides[customizable React components](https://garden.zendesk.com/components) such as spinners and buttons which can be included in the project. Use the Zendesk Garden assets if you would like your app to match the look and feel of other Zendesk products.      
      
All components are wrapped in `<ThemeProvider>` delivered by [@zendeskgarden/react-theming](https://github.com/zendeskgarden/react-components/tree/main/packages/theming) package to provide a default global theme for nested components.      
      
```js      
<ThemeProvider>    
  <Router>    
   ....    
  </Router>    
</ThemeProvider>    
```      
      
You don't have to use Zendesk Garden in your future projects. The choice is yours. For example, you could import the popular [Bootstrap CSS](http://getbootstrap.com/css/). In this tutorial, we'll stick with the Zendesk Garden styles.     
    
For the purposes of this tutorial, an external common library is used to manage navigation between application views. For more details, see https://reactrouter.com/.      
      
Next, you'll run the app in your Zendesk Sell instance and check how it works.      
      
<h3 id="creating-schema-for-custom-object">Creating the schema for the custom object</h3>

The first part of developing the app is creating the schema to create and maintain object records of a certain type. The custom object type is an invoice and there is a one-to-one relationship between the standard Sell Object (`zen:deal` ) and `invoice`.          
    
You can create [Object Types](https://developer.zendesk.com/rest_api/docs/sunshine/resource_types) and [Relationships](https://developer.zendesk.com/rest_api/docs/sunshine/relationship_types) in **Admin Center** or by using the [Custom Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api). But to make the process quicker, you'll use the `custom_objects_schema_setup.js` script that will automatically create the schema for you. The script is available in the project's main directory.     

**Create the schema**

1. Open the **custom_objects_schema_setup.js** file in your text editor. 
2. Provide details for the following properties:    
   * `ACCESS_TOKEN` - API tokens are managed in the Support admin interface at **Admin** > **Channels** > **API**. If needed, create a new API token paste it in the script. Be careful to not expose your token publicly.  
   * `MAIL` - Your account email address
   * `SUBDOMAIN` - Your Zendesk Sell subdomain            
3. From the project root directory, run `$ node custom_objects_schema_setup.js`.
   You should see the following output.    
   ```    
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
   ```    

Your schema is created. You can review the created object type and relationship in **Admin Center** > **Sunshine** > **Objects** and **Admin Center** > **Sunshine** > **Relationships**.    
   
    
<h3 id="test-application">Testing the app</h3>

The Zendesk CLI (ZCLI) includes a local web server so you can run and test your apps locally as you're developing it. Run it often to test your latest changes. 
 
**Note**: It is recommended to use private browsing or the Incognito mode in your browser when testing and developing apps. Your browser may cache certain files used by the app. If a change is not working in your app, the browser might be using an older cached version of the file. With private browsing, files aren't cached.

 **Test your app**
 
1. In your command-line interface, navigate to the **sell-custom-objects-app-tutorial** folder.    
    
2. Install dependencies:    
    
   `$ npm install`
    
3. Start your app:    
    
   `$ npm start`
    
4. Open a new window in your command line tool and start the server:    
    
   `$ npm run server` 
5. Go to the Deals page and select a deal from the list to open a deal card. The URL should look something like this:

   `https://app.futuresimple.com/sales/deals/123` 
6. Append `?zcli_apps=true` to the Deal card URL and press **Enter**. Example:

   `https://app.futuresimple.com/sales/deals/123?zcli_apps=true`
   
7. If you're using the Chrome browser, the content of your app may be blocked. Click the lock icon on the left side of the address bar and select **Site settings**. On the Settings page, scroll to the **Insecure Content** section, and select **Allow**. 

    **Note:** Firefox doesn't block app content but Safari does and has no option to disable blocking.

In the next tutorial, you'll learn how about the app implementation details. Get started: [Part 3: Implementation details](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)
<!--TODO: Add dev doc link-->
