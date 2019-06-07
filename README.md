# Serko's sample login screen

This is the app architecture that presents the preparation once we start a project. This information will help developers understand the overall concept and start building a highly scalable product.

## Index

1.	Root store and Module stores concept
2.	Document structure
3.	Naming convention for stores / models
4.	Authentication configuration
5.	Language store and usage
6.	Debugger mode for all environments
7.	Built configuration for different environments
8.	Unit test and E2E test

## Root store and Module store concepts
For application structure, we split the app stores into 2 groups:
- RootStore
- Module stores

### What is Root store:
There is only one Root store at the root level of the application, this store contains:
- The snapshot of application settings / information at the current time
- The web token, authentication information
- The current locale / language store
- Common contents (e.g: General User information: Name, Email, ContactNo, etc…)

### What is Module stores:

The store belongs to a modules inside an application; if that module developed in different package outside the application, it becomes the "Root store" in that instance.
 
The module store is dedicated to its container and have no direct relationship to the Root store, it can communicate by sending the information via store methods inside the template. Some sample of the Module stores:
- Private pages (for registered users only)
- Profile manage (updating profile information and passwords)
- Purchased order
- etc…

## Document Structure

We start build the big application from small modules and smaller components, by designing as below structure, we can make it scalable, easily for parallelly development and testing:

![A boilerplate structure for one application](http://kreativefactory.com/App_boilerplate.jpeg)
A boilerplate structure for one application


### app.config and app.routes
- The `app.config.js` contains site settings/configuration, constant name at the app level
- The `app.routes.js` contains site router configuration for lazy loaded modules / components

### module.config and module.rotes
They are exactly the configuration and router settings inside a module.

### App /index.js and Module /index.js
The `index.js` acts like the entry point for the app or module, it’s useful when we want to integrate and use the module without further settings.

### .JS vs .JSX
We need to define the content type from its name:
- by using JS, this file contains the logics and integration only;
- by using JSX, we have templating inside and the return is mostly a React Component type.

## Naming convention for stores / models
When working with stores and models, we should have a standard communication for properties, methods and computed attributes. Following the guideline will help we talk less for the usage / purpose.

### Model:
This is the lowest unit of a store, a good model design should not contain other model. A Model can have many computed attributes and actions that related to itself. A model code is likely:

```javascript
import { types } from 'mobx-state-tree';

const LocaleModel = types
    .model('LocaleModel',{
        default: false, // boolean type and false by default
        id: types.string, // mandatory in string type
        label: '', //string type and '' by default
        items: types.optional( types.frozen(), {}),
    })
    .views( self => ({
        __getLabelById(id){
            return self.items[id] ? self.items[id] : null;
        }
    }))

export default LocaleModel;
```

### Store:
Contains many models and complex logic, this will perform all actions that designed for the components / functions
- A Sample Store

```javascript
import { types, flow } from 'mobx-state-tree';

import LocaleModel from './models/LocaleModel';
const LocaleStore = types
    .model('LocaleStore', {
        locales: types.array( LocaleModel, []),
        lang: 'en'
    })
    .views( self => ({
        get __currentSnapshot(){
            // return the current locale based on the self.lang
        },
    }))
    .actions( self => ({
        fetchLocale: flow( function* fetchLocale({cancelToken=null}){
            try {
                // yield request to the API
                // update the self.locales
            } catch (error) {
                // throw error
            }
        }),
    }))

export default LocaleStore;
```

### Common Actions:
A collection of the same configuration actions to use with the store. The actions are wrapped with the axios headers configuration, so that we don’t need to declare at each store

Can read the action here: `./stores/actions.js`

### Naming convention:
Store attributes:
- state: having some basic states: ‘initial’, ‘loaded’, ‘fetching’, ‘error’
- stateTarget: will content the target of state inside the store, mostly used for conditional render inside the template
Computed attributes:
- __ready: a signal to let template component knows that the state already completed the initial stage
- __data: a snapshot of raw JSON for the store when we want to communicate with other tool
- __<name of the objet>: return the object snapshot based on current store attributes, not have any input.

### Computed methods:
- __get<name of the object>: using to retrieve the desired content from the current snapshot, the logic inside this method will not change anything to the store attributes.
- e.g: __getLabelById(id)

## Authentication configuration

## Language store and usage

## Debugger mode for all environments

For enable the debug mode in all environment, we need to write this value inside the localStorage:
debug=dev_env:*
Built configuration for different environments
We have 3 environment for automation building the app, they are located at
- <root>/.env => for development environment
- <root>/.staging.env => for staging server
- <root>/.production.env => for PROD environment

## Unit test and E2E test
