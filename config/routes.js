const userValidate = require('./userValidate')

module.exports = app => {
    //Cadastrar Usuario, Logar usuario, validar um token
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    //Ver todos usuarios
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.user.get)

    //Ver todos twitts de um usuario
    app.route('/users/:id/twitts')
        .all(app.config.passport.authenticate())
        .get(app.api.user.userTwitts)


    //Editar um usuario especifico, ver um usuario especifico, remove um usuario especifico(e todos comentarios/twitts associados a ele)
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(userValidate(app.api.user.save))
        .get(app.api.user.getById)
        .delete(userValidate(app.api.user.remove))

    //Postar twitt, ver todos twits
    app.route('/twitts')
        .all(app.config.passport.authenticate())
        .post(app.api.twitts.save)
        .get(app.api.twitts.get)

    //Editar twitt especifico, ver um twit especifico, remover twitt especifico(junto com todos comentarios associados a ele)
    app.route('/twitts/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.twitts.save)
        .get(app.api.twitts.getById)
        .delete(app.api.twitts.remove)

    //Posta comentarios
    app.route('/comments')
        .all(app.config.passport.authenticate())
        .post(app.api.comments.save)

    //Visualiza comentario especifico, edita comentario especifico, deleta comentario especifico
    app.route('/comments/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comments.getById)
        .put(app.api.comments.save)
        .delete(app.api.comments.remove)

    //Visualiza comentarios de um usuario
    app.route('/comments/user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comments.getByUserId)

    //Visualiza comentarios de uma publicação
    app.route('/comments/twitts/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comments.getByTwittId)

}