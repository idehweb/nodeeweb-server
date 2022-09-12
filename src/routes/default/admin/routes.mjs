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

}


]