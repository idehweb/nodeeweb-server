
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "user",
    "model": model,
    "modelName": "User",
    "routes": routes,

    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}