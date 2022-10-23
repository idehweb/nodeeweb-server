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
                {"name": "siteActive", "type": "boolean"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true}

            ],
        },

        "create": {
            "fields": [
                {name: "title", type: "string"},
                {name: "siteName", type: "string"},
                {name: "description", type: "string"},
                {name: "data", type: "object"},
                {name: "siteActive", type: "boolean"},
                {name: "siteActiveMessage", type: "string"},
                {name: "logo", type: "string"},
                {name: "ADMIN_ROUTE", type: "string"},
                {name: "ADMIN_URL", type: "string"},
                {name: "SHOP_URL", type: "string"},
                {name: "BASE_URL", type: "string"},
                {name: "ZIBAL_TOKEN", type: "string"},
                {name: "ZARINPAL_TOKEN", type: "string"},
                {name: "primaryColor", type: "string"},
                {name: "secondaryColor", type: "string"},
                {name: "textColor", type: "string"},
                {name: "bgColor", type: "string"},
                {name: "footerBgColor", type: "string"},
                {name: "createdAt", type: "string"},
                {name: "activeCategory", type: "string"},
                {name: "dollarPrice", type: "string"},
                {name: "derhamPrice", type: "string"},
                {name: "sms_welcome", type: "string"},
                {name: "sms_register", type: "string"},
                {name: "sms_submitOrderNotPaying", type: "string"},
                {name: "sms_submitOrderSuccessPaying", type: "string"},
                {name: "sms_onSendProduct", type: "string"},
                {name: "sms_onGetProductByCustomer", type: "string"},
                {name: "sms_submitReview", type: "string"},
                {name: "sms_onCancel", type: "string"}
            ]
        },
        "edit": {
            "fields": [
                {name: "title", type: "string"},
                {name: "siteName", type: "string"},
                {name: "description", type: "string"},
                {name: "data", type: "object"},
                {name: "siteActive", type: "boolean"},
                {name: "siteActiveMessage", type: "string"},
                {name: "logo", type: "string"},
                {name: "ADMIN_ROUTE", type: "string"},
                {name: "ADMIN_URL", type: "string"},
                {name: "SHOP_URL", type: "string"},
                {name: "BASE_URL", type: "string"},
                {name: "ZIBAL_TOKEN", type: "string"},
                {name: "ZARINPAL_TOKEN", type: "string"},
                {name: "primaryColor", type: "string"},
                {name: "secondaryColor", type: "string"},
                {name: "textColor", type: "string"},
                {name: "bgColor", type: "string"},
                {name: "footerBgColor", type: "string"},
                {name: "createdAt", type: "string"},
                {name: "activeCategory", type: "string"},
                {name: "dollarPrice", type: "string"},
                {name: "derhamPrice", type: "string"},
                {name: "sms_welcome", type: "string"},
                {name: "sms_register", type: "string"},
                {name: "sms_submitOrderNotPaying", type: "string"},
                {name: "sms_submitOrderSuccessPaying", type: "string"},
                {name: "sms_onSendProduct", type: "string"},
                {name: "sms_onGetProductByCustomer", type: "string"},
                {name: "sms_submitReview", type: "string"},
                {name: "sms_onCancel", type: "string"}
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