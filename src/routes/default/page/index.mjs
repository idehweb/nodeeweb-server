import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "page",
    "model": model,
    "modelName": "Page",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "title", "type": "object", "key": "fa"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true,"pageBuilder":true}
            ],
            "url": "/admin/page/create-page",
            "pageBuilder": true

        },

        "create": {
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
                {name: "photos", type: "image"},
                {name: "thumbnail", type: "image"}
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
                {name: "photos", type: "image"},
                {name: "thumbnail", type: "image"}
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