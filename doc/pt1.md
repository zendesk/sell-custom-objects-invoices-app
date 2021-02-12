## Building your first React Sell Custom Objects app - Part 1: Laying the groundwork

In this tutorial series, you'll learn how to build your first React Zendesk Sell Custom Objects app. The app will use [Sunshine API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api) in order to intetact with custom objects resources management. This tutorial covers the first steps to building the app:

- [Product requirements](#product-requirements)
- [Development requirements](#development-requirements)
- [Planning the app](#planning-the-app)
- [Using the scaffold template](#using-the-scaffold-template)
- [Installing dependencies](#installing-dependencies)
- [Installing the Zendesk CLI](#installing-zcli)
- [Quick app files overview](#app-files-overview)

The other tutorials in the series teach you how to build and install the app:

- [Part 2: Installing the app in Zendesk Sell](https://develop.zendesk.com/hc/en-us/articles/...)
<!-- - [Part 3: OAuth 2.0 setup](https://develop.zendesk.com/hc/en-us/articles/...)
- [Part 4: Creating audiences in Mailchimp](https://develop.zendesk.com/hc/en-us/articles/...)
- [Part 5: Getting data from the Mailchimp API](https://develop.zendesk.com/hc/en-us/articles/...)

Because the tutorials build on each other, tackle them in order and finish each tutorial before moving on to the next one.

To download the completed source code of the app in this tutorial, click [list_mailchimp_audiences_sell_app.zip](). You can review the code as you follow along or check your work. -->

**Note**: Zendesk provides this article for instructional purposes only. Zendesk does not provide support for the content. Please post any issue in the comments section below or in the [Zendesk Apps community](https://develop.zendesk.com/hc/en-us/community/topics/...), or search for a solution online.

<h3 id="product-requirements">Product requirements</h3>

Before we start diving into the tutorial, we need to make sure you have required products on your account:

1. Zendesk Support Enterprise
2. Sell Professional/Enterprise/Elite

<h3 id="development-requirements">Development requirements</h3>

Here is a list of libraries with recommended versions that will be using for development of this tutirial app:

1. nodeJS v14.15.3
2. npm v6.14.9

<h3 id="planning-the-app">Planning the app</h3>

We will create a simple app on Sell deals page. It will allow users to manage invoices assigned to Sell deals:

1. <b>Create</b> a new invoice and connect it to the viewed deal
2. <b>Edit</b> an invoice attached to the deal
3. <b>Delete</b> an invoice and detach it from the deal

When a user opens a deal, the app will automatically make a HTTP GET request to the Sunshine Custome Objects API to fetch invoice related to it. If such invoice exist, it will be shown in the app and edit/delete actions will be performable on it. If an invoice related to the deal doesn't exist, a button for creating a new invoice will be shown.

<h3 id="using-the-scaffold-template">Using the scaffold template</h3>

Use the [template](https://github.com/zendesk/sell-zaf-app-scaffold) to create a repository for your app. Then clone the repository to your local machine and open the project.

<h3 id="installing-dependencies">Installing dependencies</h3>

In your terminal run the following command to install all necessary packages:

```
$ npm install
```

<h3 id="installing-zcli">Installing the Zendesk CLI</h3>

In this section, you'll install the [Zendesk CLI](https://github.com/zendesk/zcli) (also known as ZCLI). Among other tasks, the tools let you perform the following tasks:

- Automatically create all the necessary files and folders for a new app
- Test your app locally in a browser
- Validate your app
- Package your app for upload

Installing the tools is a one-time task. Once installed, you can use ZCLI for all your Zendesk app projects. Follow the [instructions](https://developer.zendesk.com/apps/docs/developer-guide/zcli#using-zendesk-command-line-zcli). After you're done, return here to continue the tutorial. If you have already installed Zendesk CLI, make sure you are using the latest version.

Read the [ZCLI apps section](https://github.com/zendesk/zcli/blob/master/docs/apps.md) to get familiar with the tool, but don’t run `$ zcli apps:new` command since the template we’re using includes all starter files necessary to build the app. Inside the app project, ZCLI commands are available as **npm scripts** which you can run in your terminal. They can be found in the **package.json** file under `'script'` property. For example, if you want to build your app you can simply run `$ npm run buil` which will execute properly parametrized `$ zcli apps:validate` and `$ zcli apps:package` under the hood. We’ll be using those commands in the next sections.

<h3 id="app-files-overview">Quick app files overview</h3>

Open your file browser and go to the **dist/** folder. The folder contains all [required files](https://developer.zendesk.com/apps/docs/developer-guide/setup#file-requirements) which have to be included in an app to install it successfully in a Zendesk product.

**src/** folder is a place where the source code lives. You can add as many files as you need while you're building your app, but for now there is all you need to start off.

The project also includes **README.md** where you can find useful information in terms of creating an app integrated with Zendesk Sell.

In the next tutorial, you'll specify the app location and then install the app as private in Zendesk Sell to test if it works at this stage. You’ll also get to know how to develop the app locally. Get started: [Part 2: Installing the app in Zendesk Sell](https://develop.zendesk.com/hc/en-us/articles/...).
