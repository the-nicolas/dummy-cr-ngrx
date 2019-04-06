# Ionic POS Demo App
___
A POS Demo Written in Ionic and Angular
## Run With Ionic Cli
___
### Clone the repo
```sh
$ git clone reponamehere
$ cd my-proj
```
### Install npm packages and run with Ionic Cli
```sh
$ sudo npm install -g ionic
$ npm i
$ ionic serve
```
### Project Folder Structure

The modules folder houses the various feauture modules and the shared modules folder:
- cart
- product
- shared

Each feature module contains Components and Containers folders which houses the Presentation components and container components respectively.

The shared folder inside the modules houses the components, pipes,directives,api-mixins etc. that are used among multiple modules.

Each feature module has its own routing module which is currently not useful due to the single page nature of the app. 

At present the Cart Container is written inside the main app component to which the cart component is included. A separate Cart Container is written which is not used currently, but can be used when needed to display the cart in  a separate page or as a popup modal.
The Top Navigation bar compoenent is housed in the Shared modules Folder and included in the main app module

The home route displays the Product Container.

The store folder houses the ngrx store. The store for each feature is housed in separate folder. 
- authentication
- cart
- products

Each of these folder houses the actions,effects, reducers and selectors and required services for that particular feature.

The authentication folder contains the state management logic for login state.

The cart folder houses state management logic for the product cart which includes actions like adding a product to the cart, removing a product from the cart etc.

The products folder houses state management logic for products. A service is used to retrieve the products from the source and is kept in the store.  Entity is used to implement the state management for products which provides an API to manipulate and query entity collections without much boilerplate required for creating the needed reducers that manage a collection of models and provides performant CRUD operations for managing entity collections.

Currently the products are fetched from the data source and kept in the store on the loading of product container component. On subsequent needs of the products data it is accessed from the store. This can be further improved for huge volume of product data by retreving and storing only categories initially and then retrieving products and sub categories based on the selected main category.
The selected product at a given time and the products added to cart are added to the session storage as well along with the store , on firing the respective action and effects and then loaded  on page load if present in sessionstore for persistence of the said. 


The models folder inside the store folder houses interface definitions for the store.
A root store module is created onto which the feature store modules are exported and  single root store module is imported into the application’s main App Module.

app-routing.ts file contains the router logic.