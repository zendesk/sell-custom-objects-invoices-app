## Building your first Sell Custom Objects app in React- Part 4: Installing app in Sell

In the previous parts of tutorial you learned how to run the application locally and walked throughout the implementation of basic CRUD actions. In this part we will show you how to build and install the app directly on you Sell account via App Framework.
      
1. [Production build](#production-build)      
2. [Installing the app](#installing-app)      
3. [Next steps](#next-steps) 
      
This tutorial is the second part of a series on building a Zendesk app:      
      
- [Part 1: Laying the groundwork](https://develop.zendesk.com/hc/en-us/articles/...)      
- [Part 2: Running showcase app locally](...)
- [Part 3: Implementation details](...)
- Part 4: Installing the app in Sell - YOU ARE HERE
  
<h3 id="production-build">Production build</h3>

You can only upload and install private apps in Zendesk Sell on the Sell Professional or Enterprise plan.

***Note**: Before we start make sure to close locally running application.

Once ready, we have to validate the app and then package it for uploading in a zip file. To make it happen we’re going to use one of the `npm` scripts. In your command line run:

```  
$ npm run build  
```
  
  As an output you should get a confirmation that a new zip file has been generated. The file can be found in **dist/tmp/** folder. Once the file is there we can proceed to the installation.
  

<h3 id="installing-app">Installing the app</h3>

 Follow [this](https://develop.zendesk.com/hc/en-us/articles/360001069347#ariaid-title4) guide to install a private app in Zendesk Sell. You can name it whatever you want.
 
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/sell_private_app_upload.png" alt="Sell private app upload" width="500"/>  
  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/sell_private_app_installation.png" alt="Sell private app installation" width="400"/>

Once you have your app installed, let’s see if the app works and is displayed in the right place. You should be able to see it after navigating to a Deal object card. It will be in the same place where the locally run app had been placed, the difference is that you no longer need to add the `?zcli_apps=true` to the URL and the App will be also available to all users on this account.

<h3 id="next-steps">Next steps</h3>

**And.... That's it!**

We have covered all the steps of the tutorial app lifecycle. I hope you enjoyed our journey throughout the application and its implementation and you found it usefully.

As a next step you can play with the app locally and try to introduce some changes.
You may also navigate to  **Admin Center** > **Sunshine** > **Objects** / **Relationships** and setup you own types and then use the API to play with it!

You can implement your own application based on [showcase repository]([https://github.com/zendesk/sell-custom-objects-app-tutorial](https://github.com/zendesk/sell-custom-objects-app-tutorial)) used in this tutorial or start completely from scratch by using [this template](https://github.com/zendesk/sell-zaf-app-scaffold).
