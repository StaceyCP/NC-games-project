const { getApi } = require('../controllers/app_controller');
const {
    reviewsRouter, 
    categoriesRouter,
    userRouter,
    commentsRouter
} = require('./')

const apiRouter = require('express').Router();

apiRouter.get('/', getApi);

apiRouter.use('/reviews', reviewsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter;