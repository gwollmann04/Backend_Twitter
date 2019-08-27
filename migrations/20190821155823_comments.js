
exports.up = function (knex) {
    return knex.schema.createTable('comments', table => {
        table.increments('id').primary()
        table.string('content', 140).notNull()
        table.timestamp('createdAt')
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
        table.integer('twittId').unsigned().references('id')
            .inTable('twitts').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('comments')
};
