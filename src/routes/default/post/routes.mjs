import controller from './controller.mjs'
export default [
    {
        "path": "/importFromWordpress",
        "method": "post",
        "controller": controller.importFromWordpress,
    }, {
        "path": "/importFromWebzi/:offset/:limit",
        "method": "post",
        "controller": controller.importFromWebzi,
    },{
        "path": "/rewritePosts",
        "method": "post",
        "controller": controller.rewritePosts,
    },{
        "path": "/setPostsThumbnail",
        "method": "post",
        "controller": controller.setPostsThumbnail,
    }
]