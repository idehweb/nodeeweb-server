import controller from './controller.mjs'

export default [{
    "path": "/login",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.login,

}, {
    "path": "/register",
    "method": "post",
    "access": "customer,admin",
    "controller": controller.register,

}


]