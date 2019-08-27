module.exports = app => {
    const { existsOrError, equalOrError } = app.api.validation

    const save = async (req, res) => {

        const comment = { ...req.body }
        if (req.params.id) comment.id = req.params.id

        try {
            existsOrError(comment.content, 'Comentario vazio')
            existsOrError(comment.twittId, 'Id do twitt não informado')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (comment.id) {

            const commentId = await app.db('comments')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(commentId.userId, req.user.id, 'Usuário não tem permissão para alterar comentarios de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.db('comments')
                .update(comment)
                .where({ id: comment.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).msg(err))
        } else {
            comment.createdAt = new Date()
            comment.userId = req.user.id

            const ownerTwittId = await app.db('twitts')
                .where({ id: comment.twittId })
                .first()
            comment.twittOwnerId = ownerTwittId.userId

            app.db('comments')
                .insert(comment)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const getById = (req, res) => {
        app.db('comments')
            .select('content', 'id', 'userId', 'twittId', 'createdAt')
            .where({ id: req.params.id })
            .orderBy('comments.createdAt', 'desc')
            .then(comment => res.json(comment))
            .catch(err => res.status(500).send(err))
    }

    const getByUserId = (req, res) => {
        app.db('comments')
            .select('content', 'id', 'userId', 'twittId', 'twittOwnerId', 'createdAt')
            .where({ userId: req.params.id })
            .orderBy('comments.createdAt', 'desc')
            .then(comment => res.json(comment))
            .catch(err => res.status(500).send(err))
    }

    const getByTwittId = (req, res) => {
        app.db('comments')
            .select('content', 'id', 'userId', 'twittId', 'twittOwnerId', 'createdAt')
            .where({ twittId: req.params.id })
            .orderBy('comments.createdAt', 'desc')
            .then(comment => res.json(comment))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const commentId = await app.db('comments')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(commentId.userId, req.user.id, 'Usuário não tem permissão para alterar comentarios de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            const rowsDeleted = await app.db('comments')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Comentario não encontrado')
            } catch (msg) {
                res.status(400).send(msg)
            }
            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return { save, getById, getByUserId, getByTwittId, remove }
}