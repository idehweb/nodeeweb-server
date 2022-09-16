import controller from './controller.mjs'

export default [{
    "path": "/login",
    "method": "post",
    "access": "admin",
    "controller": controller.login,

}, {
    "path": "/register",
    "method": "post",
    "access": "admin",
    "controller": controller.register,

}, {
    "path": "/resetAdmin",
    "method": "post",
    "access": "",
    "controller": controller.resetAdmin,

}


]