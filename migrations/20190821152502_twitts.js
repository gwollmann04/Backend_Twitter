
exports.up = function(knex) {
    return knex.schema.createTable('twitts', table => {
        table.increments('id').primary()
        table.string('content', 140).notNull()
        table.timestamp('createdAt')
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('twitts')
};
