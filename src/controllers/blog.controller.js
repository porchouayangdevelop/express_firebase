const {
    realtimeDB
} = require('../config/firebase');
const db = realtimeDB;

module.exports = {

    create: async (req, res) => {
        try {
            const {
                title,
                description
            } = req.body;
            await db.ref('blog').push({
                    title: title,
                    description: description,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                .then(() => {
                    res.status(201).json({
                        message: 'blog have been created successfully',
                        data: {
                            title: title,
                            description: description
                        }
                    })
                })
                .catch((e) => {
                    res.status(500).send('Something went wrong...created fail');
                })

        } catch (e) {
            res.status(500).send('Something went wrong....');
        }
    },
    getBlogs: async (req, res) => {
        try {
            const blog = await db.ref('blog').once('value');
            const data = blog.val();

            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                res.status(200).json({
                    message: 'Blog retrieved successfully',
                    list
                })
            } else {
                res.status(400).json('No blog found!');
            }
        } catch (e) {
            res.status(500).send('Something went wrong...');
        }
    },

    get: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            await db.ref(`blog/${id}`).once('value', (snapshot) => {
                snapshot.val();
            }).then(result => {
                res.status(200).json({
                    message: 'blog retrieved successfully',
                    Request: {
                        method: 'GET',
                        url: `http://localhost:3000/blog/${id}`
                    },
                    Response: {
                        result: result
                    }
                })
            }).catch((e) => {
                res.status(404).send({
                    message: e.message
                })
            })
        } catch (e) {
            res.status(500).send('Something went wrong...');
        }
    },

    putBlog: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const {
                title,
                description
            } = req.body;

            db.ref(`blog/${id}`).update({
                title: title,
                description: description,
                updatedAt: new Date().toISOString()
            }).then(() => {
                res.status(200).json({
                    message: 'Blog updated successfully',
                    title: title,
                    description: description,
                })
            }).catch((e) => {
                res.status(500).send({
                    message: e.message
                })
            })

        } catch (e) {
            res.status(500).send({
                message: e.message
            })
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            db.ref(`blog/${id}`).remove()
                .then(result => {

                    res.status(200).json({
                        message: 'Blog deleted successfully',
                        id: result.id
                    })
                }).catch((e) => {
                    res.status(404).send('No blog found!');
                })
        } catch (e) {
            res.status(500).send('Something went wrong...');
        }
    }

}