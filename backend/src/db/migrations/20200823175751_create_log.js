
exports.up = function(knex) {
    return knex.schema.createTable('log', function(table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.integer('user_id');
        table.integer('org_id')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('id').inTable('user')
        table.foreign('org_id').references('id').inTable('organization');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('log');
};
