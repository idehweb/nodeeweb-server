import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "settings",
    "model": model,
    "modelName": "Settings",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "title", "type": "boolean"},
                {"name": "active", "type": "boolean"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true}

            ],
        },

        "create": {
            "fields": [
                {name: "title", type: "object"},
                {name: "siteName", type: "object"},
                {name: "description", type: "object"},
                {name: "data", type: "object"},
                {name: "siteActive", type: "object"},
                {name: "siteActiveMessage", type: "function"},
                {name: "logo", type: "function"},
                {name: "ADMIN_ROUTE", type: "function"},
                {name: "ADMIN_URL", type: "function"},
                {name: "SHOP_URL", type: "function"},
                {name: "BASE_URL", type: "function"},
                {name: "ZIBAL_TOKEN", type: "function"},
                {name: "ZARINPAL_TOKEN", type: "function"},
                {name: "primaryColor", type: "function"},
                {name: "secondaryColor", type: "function"},
                {name: "textColor", type: "function"},
                {name: "bgColor", type: "function"},
                {name: "footerBgColor", type: "function"},
                {name: "createdAt", type: "object"},
                {name: "activeCategory", type: "object"},
                {name: "dollarPrice", type: "function"},
                {name: "derhamPrice", type: "function"},
                {name: "sms_welcome", type: "object"},
                {name: "sms_register", type: "object"},
                {name: "sms_submitOrderNotPaying", type: "object"},
                {name: "sms_submitOrderSuccessPaying", type: "object"},
                {name: "sms_onSendProduct", type: "object"},
                {name: "sms_onGetProductByCustomer", type: "object"},
                {name: "sms_submitReview", type: "object"},
                {name: "sms_onCancel", type: "object"}
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