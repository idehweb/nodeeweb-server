import controller from './controller.mjs'
export default [
    {
        "path": "/importFromWordpress",
        "method": "post",
        "controller": controller.importFromWordpress,
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