  
## Build your first custom objects app for Sell - Part 1: Laying the groundwork

<!--
Title: Build your first custom objects app for Sell - Part 1: Laying the groundwork
-->

 In this tutorial series, you'll build a simple custom objects app for Zendesk Sell.  
The app will use [Custom Objects API](https://developer_v2.zendesk.com/documentation/sunshine/custom-objects/custom-objects-api/) to interact with the Custom Objects resources management.  
This part of the tutorial covers the following steps:    
    
- [What you'll need](#what-youll-need)
- [Enabling custom objects](#enabling-custom-objects)
- [Planning the app](#planning-the-app)
- [Setting up the app scaffold template](#setting-up-the-app-scaffold-template)
- [Installing the Zendesk CLI](#installing-zcli)
- [App files overview](#app-files-overview)    
    
The other tutorials in the series teach you how to build and install the app:    
- Part 1: Laying the groundwork - YOU ARE HERE
- [Part 2: Running the app locally](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...) 
- [Part 3: Implementation details](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)
- [Part 4: Installing the app in Sell](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...) 

<!--TODO Add links when URL on the new site is confirmed-->
This tutorial series uses the Zendesk app scaffold to build an app. It is intended for experienced web developers who are comfortable working with advanced web tooling such as Webpack, Node, and npm packages, among other technologies.

Because the tutorials build upon each other, it's recommended you tackle them in order and finish each tutorial before moving on to the next one. 

<!-- TODO Add when file package is provided:
To download the completed source code of the app in this tutorial, click APP_PACKAGE_FILE.zip. You can review the code as you follow along or check your work.
-->
        
**Note**: Zendesk provides this article for instructional purposes only. Zendesk does not provide support for the content. Please post any issue in the comments section below or in the [Zendesk Apps community](https://develop.zendesk.com/hc/en-us/community/topics/...), or search for a solution online.    


<h3 id="what-youll-need">What you'll need</h3>    

To build and upload a private app in Sell, you must have the following:    
    
- Zendesk Sell on the Team plan or above    
- A Zendesk Suite plan to use custom objects 

If you're interested in becoming a Zendesk developer partner, you can convert a trial account into a sponsored Zendesk Support account. See [Getting a trial or sponsored account for development](https://developer_v2.zendesk.com/documentation/developer-tools/getting-started/getting-a-trial-or-sponsored-account-for-development/).

<h3 id="enabling-custom-objects">Enabling custom objects</h3> 

Custom objects must be enabled by an administrator in Zendesk Support. If you're not an admin, ask one to enable them for you. For more information, see [Enablng custom objects](https://support.zendesk.com/hc/en-us/articles/360037716253-Sunshine-custom-objects-guide-for-admins#topic_fk5_wyl_mjb).  


<h3 id="planning-the-app">Planning the app</h3>    

The app you'll build is designed to manage an invoice record assigned to a Sell Deal object. It will appear on the Zendesk Sell Deal page. 

The app has a one-to-one relationship between the Sell Deal object and custom object record which is an invoice. It allows you to peform the following actions: 

- Create a new invoice and connect it to the viewed deal    
- Edit an invoice attached to the deal    
- Delete an invoice that is attached to the deal    

<!--TODO Add app screenshots-->    
When a user opens a deal, the app will make an HTTP GET request to the Sunshine Custom Objects API to fetch the invoice associated to it. If the record exists, it will be displayed in the app with options to edit or delete the record. If an invoice related to the deal doesn't exist, a button to create a new invoice will be shown.    
    
<h3 id="Setting-up-the-app-scaffold-template">Setting up the app scaffold template</h3>

A Zendesk app scaffold template is provided to help you build the app.
To develop the app, it is recommended to use nodeJS v14.15.3 and npm v6.14.9.

**Disclaimer**: Zendesk can't provide support for third-party technologies such as Webpack, Node.js, or npm packages, nor can Zendesk debug custom scaffold configurations or code.

**Set up your app project**

1. In your command line tool, clone the [app scaffold template](https://github.com/zendesk/sell-custom-objects-app-tutorial) for the app to your local machine and open the project
    ```    
	$ git clone git@github.com:zendesk/sell-custom-objects-app-tutorial.git        
	```    
2. Run the following command to install the necessary packages:
	```    
	$ npm install
	$ npm install node-fetch
	```    

<h3 id="installing-zcli">Installing the Zendesk CLI</h3>
    
 In this section, you'll install the [Zendesk CLI](https://github.com/zendesk/zcli) (also known as ZCLI). Some of the tasks it can perform include:    
    
- Automatically create all the necessary files and folders for a new app    
- Testing your app locally in a browser    
- Validating your app    
- Packaging your app for upload    
    
Installing the tools is a one-time task. Once installed, you can use ZCLI for all your Zendesk app projects.  Follow the instructions in [Installing and updating ZCLI](https://developer.zendesk.com/apps/docs/developer-guide/zcli#installing-and-updating-zcli) in Using Zendesk Command Line (ZCLI). After you're done, return here to continue the tutorial. If you have already installed Zendesk CLI, make sure you are using the latest version.
    
Read the [ZCLI apps section](https://github.com/zendesk/zcli/blob/master/docs/apps.md) to get familiar with the tool, but don’t run `$ zcli apps:new` command since the template we’re using includes all starter files necessary to build the app. 

Inside your cloned app project, ZCLI commands are available as npm scripts which you can run in your command line tool. They can be found in the **package.json** file under `'script'` property. For example, if you want to build your app you will simply run `$ npm run build` which runs `$ zcli apps:validate` and `$ zcli apps:package` to validate and package your app. You'll use these commands later.
    
<h3 id="app-files-overview">App files overview</h3>  
  
 Open the app scaffold template you cloned in your favorite editor and go to the **dist/** folder. The folder contains all the [required files](https://developer.zendesk.com/apps/docs/developer-guide/setup#file-requirements) in an app package to install it in a Zendesk product. The **src/** folder is a place where the source code lives. You can add as many files as you need when you're building your app, but for now it's all you need to start building an app.   
    
In the next tutorial, you'll test if the app works as expected and learn how to develop the app locally. Get started: [Part 2: Running the app locally](https://developer_v2.zendesk.com/documentation/apps/build-an-app/build-your-first-custom-objects-app-for_sell...)
<!-- TODO Add link when URL on the new site is confirmed-->

