import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "admin",
    "model": model,
    "modelName": "Admin",
    "routes": routes,
    "admin": {
        "list": {
            "header": [{"name": "email"}, {"name": "username"}, {"name": "nickname"}, {"name": "active"}, {"name": "createdAt"}, {"name": "updatedAt"}],

        },

        "create": {
            "fields": [
                {name: "email", type: "string"},
                {name: "username", type: "string"},
                {name: "nickname", type: "string"},
                {name: "password", type: "string"},
                {name: "type", type: "string"},
                {name: "token", type: "string"},
                {name: "createdAt", type: "date"},
                {name: "active", type: "boolean"}
            ]
        },
        "edit": {
            "fields": [{"name": "title"},]
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