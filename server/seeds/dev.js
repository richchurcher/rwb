const faker = require('faker')

exports.seed = knex =>
  knex('users').del()
    .then(() => knex('users').insert([
      // First, a test user so we always have a known email to log in with
      {
        email: "test@example.com",
        // This is a salted hash for the password `password` (base64 encoding)
        hash: 'JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJDNQdzZQZUVidStvVnhmVDdZVTJtOEEkQWtTNkQ1T3RKMk5VcTFQb2lVSXk0VUpnd0lJTllxTjRmdEpnUEZXLy9CTQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        avatar_url: faker.internet.avatar(),
        display_name: 'Test User'
      }
    ]))
    .then(() => knex('users').insert(
      // This syntax may be unfamiliar. JavaScript lacks a `range` keyword, so a workaround
      // is to create a fixed size array using the Array constructor, then spread it using ...
      // and map the result. So this seeds 10 fake users with the password 'password'
       [ ...new Array(10) ].map(() => ({
        email: faker.internet.email(),
        hash: 'JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJDNQdzZQZUVidStvVnhmVDdZVTJtOEEkQWtTNkQ1T3RKMk5VcTFQb2lVSXk0VUpnd0lJTllxTjRmdEpnUEZXLy9CTQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        avatar_url: faker.internet.avatar(),
        display_name: faker.name.findName()
      }))
    ))
