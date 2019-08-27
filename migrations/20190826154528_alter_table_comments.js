
exports.up = function(knex) {
    return knex.schema.alterTable('comments', table => {
        table.integer('twittOwnerId').unsigned().references('id')
            .inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('comments', table => {
        table.dropColumn('twittOwnerId')
    })
};
