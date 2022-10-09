import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "post",
    "model": model,
    "modelName": "Post",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "title", "type": "string"},
                {"name": "slug"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true,"pageBuilder":true}
            ],
            "url": "/admin/page/create-page",
            "pageBuilder": true

        },

        "create": {
            "fields": [
                {name: "title", type: "object"},
                {name: "slug", type: "string"},
                {name: "excerpt", type: "object"},
                {name: "views", type: "object"},
                {name: "elements", type: "object"},
                {name: "kind", type: "string"},
                {name: "maxWidth", type: "string"},
                {name: "status", type: "string"},
            ]
        },
        "edit": {
            "fields": [
                {name: "createdAt", type: "date"},
                {name: "active", type: "boolean"},
                {name: "data", type: "object"},
                {name: "description", type: "object"},
                {name: "excerpt", type: "object"},
                {name: "views", type: "object"},
                {name: "slug", type: "string"},
                {name: "title", type: "object"},
                {name: "elements", type: "object"},
                {name: "kind", type: "string"},
                {name: "status", type: "string"},
                {name: "maxWidth", type: "string"}
            ]
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