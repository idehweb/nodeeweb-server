
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "customer",
    "model": model,
    "modelName": "Customer",
    "routes": routes,
    "admin": {
        "list": {
            "header":[
                {"name":"phoneNumber","type":"number"},
                {"name":"email","type":"email"},
                {"name":"activationCode","type":"number"},
                {"name":"nickname","type":"string"},
                {"name":"firstName","type":"string"},
                {"name":"lastName","type":"string"},
                {"name":"credit","type":"number"},
                {"name":"createdAt","type":"date"},
                {"name":"updatedAt","type":"date"},
                {"name":"actions","type":"actions"}
                ]
        },
        "create": {
            "fields":[{"name":"title"},]
        },
        "edit": {
            "fields":[{"name":"title"},]
        },
    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}