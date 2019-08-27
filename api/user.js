const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não Informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha invalida')
            equalOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuario ja cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.send(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(msg))
    }

    const userTwitts = (req, res) => {
        app.db('twitts')
            .select('content', 'id', 'userId', 'createdAt')
            .where({ userId: req.params.id })
            .orderBy('twitts.createdAt', 'desc')
            .then(twitts => res.json(twitts))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {

            const commentsDeleted = await app.db('comments')
                .where({ userId: req.params.id}).orWhere({twittOwnerId: req.params.id}).del()
            try {
                existsOrError(commentsDeleted, 'Usuario sem comentarios')
            } catch (msg) {
                console.log(msg)
            }

            const twittsDeleted = await app.db('twitts')
                .where({ userId: req.params.id }).del()
            try {
                existsOrError(twittsDeleted, 'Usuario sem twitts')
            } catch (msg) {
                console.log(msg)
            }

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })

            try {
                existsOrError(rowsUpdated, 'Usuario não encontrado')
            } catch (msg) {
                res.status(400).send(msg)
            }

            res.status(204).send()

        } catch (msg) {
            res.status(500).send()
        }

    }

    return { save, get, getById, userTwitts, remove }
}