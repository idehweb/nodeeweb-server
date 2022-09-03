export default {
    routes: [{
        "path": "/login",
        "method": "get",
        "access": "customer,admin",
        "controller": (req, res, next) => {
            console.log('controllerrrrrr');
            res.show()
        },

    }]
}