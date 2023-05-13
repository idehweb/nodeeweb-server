# [Nodeeweb | create website, CMS, or application with nodejs reactjs mongodb](https://idehweb.com/product/creare-website-or-application-with-nodeeweb/)

Nodeeweb is a free and open source WebApplication Builder , a [CMS] which helps building and handling pages, products, posts and other models.
It is powerful and fast. many modules are built-in and ready to use, it is modular and easily you can join modules or plugins, you can export android and iOS applications too.
You can do many things.


## Table of contents

* [Features](#features)
* [Install](#Install)
* [Usage](#usage)
* [Development](#development)
* [Documentation](#documentation)
* [API](#api)
* [Testing](#testing)
* [Plugins](#plugins)
* [Support](#support)
* [Changelog](https://github.com/idehweb/nodeeweb-server/releases)
* [Contributing](https://github.com/idehweb/nodeeweb-server/blob/master/CONTRIBUTING.md)
* [License](#license)
* [Changelogs](#Changelogs)




## Features

* Handle a shop , blog , a CMS ...
* Contains page builder
* Export application or PWA
* Default built-in modules
* Add plugins , modular



## How to start? (Install)

### 0. create package.json file or run:
```bash
npm init
```
and then:
```bash
npm install @nodeeweb/server
```

### 1. Create index.mjs file in root of your project and put this line inside it:
```jsx static
import Server from '@nodeeweb/server'
Server();
```
then:
```bash
npm start
```

### 2. now open http://localhost:3000

### 3. You can change .env.local values and then run server

For the development purpose you should follow instructions below.

## Usage

```html


```

For a more practical example I'd suggest looking up the code inside this demo: https://idehweb.com/demo.html


## Development



## Documentation

Check the getting started guide here: [Documentation]


## API

API References could be found here: [API-Reference]
These routes are your default routes:
<details>
    <summary>API List</summary>
    GET      /
    GET      /login
    GET      /theme
    GET      /admin
    GET      /admin/routes
    POST     /customer/admin/login
    POST     /customer/admin/register
    POST     /customer/admin/resetAdmin
    GET      /customer/admin
    GET      /customer/admin/count
    GET      /customer/admin/:offset/:limit
    GET      /customer/admin/:id
    POST     /customer/admin
    PUT      /customer/admin/:id
    DELETE   /customer/admin/:id
    POST     /admin/admin/login
    POST     /admin/admin/register
    POST     /admin/admin/resetAdmin
    GET      /admin/admin
    GET      /admin/admin/count
    GET      /admin/admin/:offset/:limit
    GET      /admin/admin/:id
    POST     /admin/admin
    PUT      /admin/admin/:id
    DELETE   /admin/admin/:id
    GET      /customer/settings
    GET      /customer/settings/count
    GET      /customer/settings/:offset/:limit
    GET      /customer/settings/:id
    POST     /customer/settings
    PUT      /customer/settings/:id
    DELETE   /customer/settings/:id
    GET      /admin/settings
    GET      /admin/settings/count
    GET      /admin/settings/:offset/:limit
    GET      /admin/settings/:id
    POST     /admin/settings
    PUT      /admin/settings/:id
    DELETE   /admin/settings/:id
    GET      /customer/page
    GET      /customer/page/count
    GET      /customer/page/:offset/:limit
    GET      /customer/page/:id
    POST     /customer/page
    PUT      /customer/page/:id
    DELETE   /customer/page/:id
    GET      /admin/page
    GET      /admin/page/count
    GET      /admin/page/:offset/:limit
    GET      /admin/page/:id
    POST     /admin/page
    PUT      /admin/page/:id
    DELETE   /admin/page/:id
    GET      /customer/menu
    GET      /customer/menu/count
    GET      /customer/menu/:offset/:limit
    GET      /customer/menu/:id
    POST     /customer/menu
    PUT      /customer/menu/:id
    DELETE   /customer/menu/:id
    GET      /admin/menu
    GET      /admin/menu/count
    GET      /admin/menu/:offset/:limit
    GET      /admin/menu/:id
    POST     /admin/menu
    PUT      /admin/menu/:id
    DELETE   /admin/menu/:id
    POST     /customer/customer/authCustomer
    POST     /customer/customer/activateCustomer
    POST     /customer/customer/authCustomerWithPassword
    POST     /customer/customer/authCustomerForgotPass
    POST     /customer/customer/setPassword
    GET      /customer/customer
    GET      /customer/customer/count
    GET      /customer/customer/:offset/:limit
    GET      /customer/customer/:id
    POST     /customer/customer
    PUT      /customer/customer/:id
    DELETE   /customer/customer/:id
    POST     /admin/customer/authCustomer
    POST     /admin/customer/activateCustomer
    POST     /admin/customer/authCustomerWithPassword
    POST     /admin/customer/authCustomerForgotPass
    POST     /admin/customer/setPassword
    GET      /admin/customer
    GET      /admin/customer/count
    GET      /admin/customer/:offset/:limit
    GET      /admin/customer/:id
    POST     /admin/customer
    PUT      /admin/customer/:id
    DELETE   /admin/customer/:id
</details>
## presets , examples , demo


## Sponsors

If you like the project and you wish to see it grow, please consider supporting us with a donation of your choice or become a backer/sponsor.

<a href="https://arvandguarantee.shop" target="_blank"><img src="https://idehweb.com/sponsers/arvand-logo.jpg"></a>


## License

Nodeeweb is licensed under the GNU GENERAL PUBLIC LICENSE, sponsored and supported by [https://idehweb.com](idehweb.com)

[Documentation]: <https://idehweb.com/nodeeweb/>
[API-Reference]: <https://idehweb.com/nodeeweb/api/>
[CMS]: <https://en.wikipedia.org/wiki/Content_management_system>

## Changelogs

- 0.1.40
    * reset to default
    
- 0.1.39
    * form tracking code (front)
    * dynamic entities in menu (admin)
    * form filters

- 0.1.38
    * add formStatus

- 0.1.33
    * create/edit form
    * export customers/products &...
    * captcha

- 0.1.13
    * add level 3 of menus

- 0.1.12
    * handle schedule in plugins

- 0.1.11
    * product category seo

- 0.1.10
    * update theme config
    
- 0.1.09
    * add telegram more complete

- 0.1.08
    * add cron and schedules job

- 0.1.01
    * add fixed image style

- 0.0.9892
    * add products top sale

- 0.0.9891
    * add price limit
    * add metatitle

- 0.0.9889
    * get actions

- 0.0.9888
    * submit actions

- 0.0.9886
    * remove bugs of product

- 0.0.9879
    * add product category description

- 0.0.9877
    * add break points

- 0.0.9876
    * change theme function

- 0.0.9875
    * add offset and limit query
    * rebuild pagination
    * work on filters

- 0.0.9874
    * add telegram notification

- 0.0.9871
    * bugs of my orders, show my orders and my order details page

- 0.0.9869
    * resolve search issues
    * show from in prices in list

- 0.0.9867
    * filter by order count

- 0.0.9865
    * add $lt to order and add export to orders

- 0.0.9864
    * update filters

- 0.0.9863
    * add my orders
    * add perPage to slider
    * add classes to child level of grid and slider

- 0.0.9862
    * for Pouriya ;-) , grid element

- 0.0.9861
    * bugs of front

- 0.0.9860
    * bugs of sitemap

- 0.0.9859
    * create payment link

- 0.0.9858
    * remove limit of category in adding product in admin

- 0.0.9857
    * change default link behaviour
    
- 0.0.9855
    * add multiple site map
    * remove some extra packages
    * resolve dependencies

- 0.0.9854
    * make search bar stylable in front
    * improve order chart in admin

- 0.0.9851
    * update front

- 0.0.985
    * update technical seo
    * add post category
    * add `product/:slug` and `post/:slug` global routes
    * add `category` to Post model and remove firstCategory, secondCategory, thirdCategory
    * add `schema` code of google in article, products, posts...

- 0.0.983
    * update transaction and order on buy
    * decrease stock quantity

- 0.0.982
    * added tasks, notes, customer status, documents

- 0.0.980
    add first buy of customer, add orders filter

- 0.0.976
    factore and print details

- 0.0.973
    add transaction to public route

- 0.0.971
    add drag & drop, remove bugs of front

- 0.0.970
    add showInMobile & showInDesktop to templates

- 0.0.969
    remove bugs of custom query and objects

- 0.0.966
    change admin ui, add dragging, add field, remove field

- 0.0.965
    add transaction verify

- 0.0.962
    update gateway

- 0.0.961
    add sms gateways, send sms parts , change gateway edit and create

- 0.0.960
    add order reports to admin dashboard

- 0.0.959
    tax && taxAmount

- 0.0.958
    remove title,phone number from adding address
    go to page 2 in checkout always

- 0.0.957
    remove bugs of front

- 0.0.956
    select attributes to filters

- 0.0.955
    add expire, exclude products, exclude product categories to discounts

- 0.0.954
    change sidebar behaviour

- 0.0.953
    add tax

- 0.0.95
    remove price part bugs in front

- 0.0.94
    update discount code
    update sidebar attrs and cats

- 0.0.93
    update admin, add favicon

- 0.0.92
    add orders, notifications, addresses to customer details in admin
    add export products and import products
    add new filters to admin , order parts
    add new filters to admin , customer parts

- 0.0.91
    add self-update button and route in admin

- 0.0.90
    add self-update
    
- 0.0.88
    add weight to product
    add rial

- 0.0.87
    enhance front
    add currency system

- 0.0.86
    add gateways

- 0.0.85
    add form and entry

- 0.0.84
    add order by admin

- 0.0.83
    add birthdate

- 0.0.82
    add pagination

- 0.0.81
    add attributes part to products

- 0.0.80
    remove babel

- 0.0.79
    add source to customers

- 0.0.78
    add plugins

- 0.0.77
    add body and head tags support

- 0.0.75
    update admin , enhance admin UI/UX

- 0.0.74
    add sitemap

- 0.0.72
    add forms and entry to admin
    add dark mode and change theme button
    change menu app bar
    

- 0.0.71
    add bg to the-body
      
- 0.0.70   
    remove some little bugs
     
- 0.0.69        
    add extra button to products, add header settings for ssr 

- 0.0.68    
    copy whole admin folder

- 0.0.67
    remove 'builder' link bugs
    update config.js in admin folder on every run server

- 0.0.66
    update admin folder

- 0.0.65
    add product ssr

- 0.0.64
    add menu border and box shadow

- 0.0.63
    update classes

- 0.0.62
    add class .f-d-c-r

- 0.0.61
    remove front bugs

- 0.0.60
    add responsive menu
    
- 0.0.59    
    add thumbnail to product single

- 0.0.58
    update front

- 0.0.57
    update front

- 0.0.56
    update front,admin

- 0.0.55
    add pagination to table
    add total count

- 0.0.54
    gateways

- 0.0.53
    front edits

- 0.0.52
    add filter

- 0.0.51
    convert "./" to "/"

- 0.0.50
    register new admin problem
    update front
    now we can delete elements

- 0.0.49
    add restart function to settings
    add req.query. `filters` to 'all' in controller

- 0.0.48
    update front

- 0.0.47
    solve routes problem

- 0.0.46
    solve routes problem

- 0.0.45
    add customerGroup to customer list
    add custom routes

- 0.0.44
    add customer group

- 0.0.43
    slider bug

- 0.0.42
    update slider children bugs
    add array field

- 0.0.41
    add multi language functionality
    update theme admin part
    update post rules

- 0.0.40
    update admin, create product, add multilang field

- 0.0.39
    add 3rd level menu to front

- 0.0.38
    add transction callback

- 0.0.37
    remove some bugs
    update front

- 0.0.36
    add notification model
    add sms option

- 0.0.35
    import function

- 0.0.34
    update front , create comments part in front, add buttons border radius

- 0.0.33
    update front
    
- 0.0.32
    breakable front change
    change page builder - component children structure

- 0.0.31
    add import function

- 0.0.30
    add route /a/:_entities/:_offset/:_limit

- 0.0.29
    update front, debug login page

- 0.0.28
    add checkout page

- 0.0.27
    change home layout to DefaultLayout
    change front
    
- 0.0.26 
    add new routes config

- 0.0.25 
    add contacts and data property to customer

- 0.0.24 
    update front / page builder
      
- 0.0.23       
    update front /chat page

- 0.0.22       
    update front

- 0.0.21    
    update theme json , remove header & footer

- 0.0.20
    replace "./" with "/"

- 0.0.19
    update theme

- 0.0.18
    update front/admin

- 0.0.17
    add maxWidth to pages

- 0.0.16
    add post model
    
- 0.0.15
    change theme route

- 0.0.14
    update build folder - update front - admin

- 0.0.13
    add templates

- 0.0.12
    remove comments, update frontend & admin

- 0.0.11
    add sponser

- 0.0.10
    update theme folder

- 0.0.9
    remove post model from defaults
    add page model to defaults
    
- 0.0.8 
    update readme, license

- 0.0.7 
    added rules parameter
    
- 0.0.6 
    stable