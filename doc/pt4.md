## Building your first custom objects app for Sell- Part 4: Installing the app in Zendesk Sell

In the previous parts of this tutorial you learned how to run the application locally and walked through how CRUD actions are implemented in an app. In this part we will show you how to build and install the app directly on you Sell account using Apps framework.
      
1. [Validating and packaging the app](#validating-and-packaging-the-app])      
2. [Installing the app](#installing-app)      
3. [Next steps](#next-steps) 
      
This tutorial is the fourth part of a series on building a Zendesk app:      
      
- [Part 1: Laying the groundwork](https://develop.zendesk.com/hc/en-us/articles/...)      
- [Part 2: Setting up and testing the app](...)
- [Part 3: Implementation details](...)
- Part 4: Installing the app in Sell - YOU ARE HERE
  
<h3 id="validating-and-packaging-the-app">Validating and packaging the app</h3>

You can only upload and install private apps in Zendesk Sell on the Sell Professional plan or above.

**Note**: Before you start, make sure to stop running your app locally.

First, you validate the app and then package it for uploading in a zip file. In your command line run:

```  
$ npm run build  
```
  
The output will confirm that a new zip file has been generated. The file can be found in **dist/tmp/** folder. 

<h3 id="installing-app">Installing the app</h3>

See [Uploading and installing a private app in Zendesk Sell](https://develop.zendesk.com/hc/en-us/articles/360001069347#ariaid-title4) for information on installing a private app in Zendesk Sell. You can provide any name for your app.

Once you have your app installed, check if the app works and is displayed in the right place. You should be able to see it after navigating to a `Deal` object card. It will be in the same place where the locally run app was located and available to all users on this account.

<h3 id="next-steps">Next steps</h3>

As the next step you can play with the app locally and try to introduce some changes. You can also navigate to  **Admin Center** > **Sunshine** > **Objects** / **Relationships** and set up you own objects and relationship types and then use the API to play with them.

You can implement your own application based on [Sell custom objects app tutorial repository](https://github.com/zendesk/sell-custom-objects-app-tutorial) used in this tutorial or start completely from scratch by using the [Sell apps scaffold template](https://github.com/zendesk/sell-zaf-app-scaffold).
