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