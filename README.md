# [Nodeeweb | create website, CMS, or application with nodejs reactjs mongodb](https://idehweb.com/product/creare-website-or-application-with-nodeeweb/)

Nodeeweb is a free and open source WebApplication Builder , a [CMS] which helps building and handling pages, products, posts and other models.
It is powerful and fast. many modules are built-in and ready to use, it is modular and easily you can join modules or plugins, you can export android and iOS applications too.
You can do many things.


## Table of contents

* [Features](#features)
* [Download](#download)
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



## How to start? (download)

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