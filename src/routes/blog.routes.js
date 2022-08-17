const router = require('express').Router();
const {
    create,
    getBlogs,
    get,
    putBlog,
    deleteBlog
} = require('../controllers/blog.controller');

const route = (app) => {
    router.route('/').get(getBlogs).post(create);
    router.route('/:id').get(get).put(putBlog).delete(deleteBlog);
    return app.use('/blog', router);
}
module.exports = route;