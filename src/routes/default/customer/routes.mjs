import controller from "./controller.mjs";

export default [ {
    "path": "/authCustomer",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.authCustomer,

},{
    "path": "/activateCustomer",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.activateCustomer,

},{
    "path": "/authCustomerWithPassword",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.authCustomerWithPassword,

},{
    "path": "/authCustomerForgotPass",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.authCustomerForgotPass,

},{
    "path": "/setPassword",
    "method": "post",
    "access": "customer",
    "controller": controller.setPassword,

},]

// Zxcd1245#$%^