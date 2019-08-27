module.exports = app => {
    const { existsOrError, equalOrError } = app.api.validation

    const save = async (req, res) => {


        const twitt = { ...req.body }
        if (req.params.id) twitt.id = req.params.id

        try {
            existsOrError(twitt.content, 'Twitt em branco')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (twitt.id) {
            const twittId = await app.db('twitts')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(twittId.userId, req.user.id, 'Usuário não tem permissão para alterar twitts de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.db('twitts')
                .update(twitt)
                .where({ id: twitt.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
                
        } else {
            twitt.createdAt = new Date()
            twitt.userId = req.user.id
            app.db('twitts')
                .insert(twitt)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('twitts')
            .select('id', 'content', 'userId', 'createdAt')
            .orderBy('twitts.createdAt', 'desc')
            .then(twitts => res.json(twitts))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('twitts')
            .select('id', 'content', 'userId', 'createdAt')
            .where({ id: req.params.id })
            .first()
            .then(twitt => res.json(twitt))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const commentsDeleted = await app.db('comments')
                .where({ twittId: req.params.id }).del()
            try {
                existsOrError(commentsDeleted, 'Twitt sem comentarios')
            } catch (msg) {
                console.log(msg)
            }

            const twittId = await app.db('twitts')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(twittId.userId, req.user.id, 'Usuário não tem permissão para deletar twitts de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            } 

            const rowsDeleted = await app.db('twitts')
                .where({ id: req.params.id }).del()
            try {
                existsOrError(rowsDeleted, 'Twitt não encontrado')
            } catch (msg) {
                res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return { save, get, getById, remove }
}