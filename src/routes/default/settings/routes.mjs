import controller from './controller.mjs'
export default [{
    "path": "/",
    "method": "get",
    "access": "customer_all",
    "controller": controller.last,

},{
    "path": "/restart",
    "method": "post",
    "access": "admin_user",
    "controller": controller.restart,

}]