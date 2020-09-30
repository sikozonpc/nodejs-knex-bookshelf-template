
exports.up = function (knex) {
  return knex.schema
    .createTable('user', function (table) {
      table.increments().primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 255).notNullable()
      table
        .boolean('account_verified')
        .notNullable()
        .defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('user')
};
