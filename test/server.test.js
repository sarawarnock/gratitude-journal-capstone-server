const knex = require('knex')
const app = require('../src/app');

describe('Users API', function () {
    let db
    let users = [
      { "id": 1, "username": "testuser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"},
      { "id": 2, "username": "newuser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"},
      { "id": 3, "username": "testeruser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"}
    ]
  
    before('make knex instance', () => {  
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    });
    
    //before('cleanup', () => db.raw('TRUNCATE TABLE entries RESTART IDENTITY CASCADE;'));
    before('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE;'));
  
    afterEach('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE;')); 
  
    after('disconnect from the database', () => db.destroy()); 
  
    describe('GET /api/users', () => {
  
      beforeEach('insert some users', () => {
        return db('users').insert(users);
      })
  
      it('should respond to GET `/api/users` with an array of users and status 200', function () {
        return supertest(app)
          .get('/api/users')
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(users.length);
          });
      });
    });
  
    describe('POST /api/users', function () {
  
      it('should create and return a new user when provided valid data', function () {
        const newUser = {
          'id': 4,
          'email': 'newuser@gmail.com',
          'password': 'NewPassword2',
          'first_name': 'NewUser',
          'last_name': 'Last'
        };
  
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.be.a('object');
          });
      });
  
      it('should respond with 400 status when given bad data', function () {
        const badUser = {
          foobar: 'broken user'
        };
        return supertest(app)
          .post('/api/users')
          .send(badUser)
          .expect(400);
      });
  
    });
});

describe('Entries API:', function () {
    let db;

    let users = [
        { "id": 1, "username": "testuser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"},
        { "id": 2, "username": "newuser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"},
        { "id": 3, "username": "testeruser", "password": "Testpassword1", "first_name": "Test", "last_name": "User"}
      ]

    let entries = [
        {
            "id": 1,
            "user_id": 1,
            "title": "test title",
            "bullet_1": "test bullet 1",
            "bullet_2": "test bullet 2",
            "bullet_3": "test bullet 3",
            "mood": "happy",
            "is_public": 0
        },
        {
            "id": 2,
            "user_id": 1,
            "title": "test title",
            "bullet_1": "test bullet 1",
            "bullet_2": "test bullet 2",
            "bullet_3": "test bullet 3",
            "mood": "sad",
            "is_public": 0
        },
        {
            "id": 3,
            "user_id": 1,
            "title": "test title",
            "bullet_1": "test bullet 1",
            "bullet_2": "test bullet 2",
            "bullet_3": "test bullet 3",
            "mood": "ok",
            "is_public": 0
        }
  ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    });

    before('cleanup', () => db.raw('TRUNCATE TABLE entries RESTART IDENTITY CASCADE;'));

    beforeEach('insert some users', () => {
        return db('users').insert(users);
    })

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE entries RESTART IDENTITY CASCADE;'));

    after('disconnect from the database', () => db.destroy());

    describe('GET all entries', () => {

        beforeEach('insert some entries', () => {
            return db('entries').insert(entries);
        })
        //relevant
        it('should respond to GET `/api/entries` with an array of entries and status 200', function () {
            return supertest(app)
                .get('/api/entries')
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.length(entries.length);
                });
        });

    });


    describe('GET entries by id', () => {

        beforeEach('insert some entries', () => {
            return db('entries').insert(entries);
        })

        it('should return correct entry when given an id', () => {
            let entry;
            return db('entries')
                .first()
                .then(entry => {
                    entry = entry
                    return supertest(app)
                        .get(`/api/entries/${entry.id}`)
                        .expect(200);
                })
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.include.keys('id', 'title', 'user_id', 'bullet_1', 'bullet_2', 'bullet_3', 'is_public');
                    // expect(res.body.id).to.equal(entry.id);
                    // expect(res.body.title).to.equal(entry.title);
                    // expect(res.body.completed).to.equal(entry.completed);
                });
        });

        it('should respond with a 404 when given an invalid id', () => {
            return supertest(app)
                .get('/api/entries/aaaaaaaaaaaa')
                .expect(404);
        });

    });


    describe('POST (create) new entry', function () {

        //relevant
        it('should create and return a new entry when provided valid data', function () {
            const newItem = {
                "id": 4,
                "user_id": 1,
                "title": "new title",
                "bullet_1": "new bullet 1",
                "bullet_2": "new bullet 2",
                "bullet_3": "new bullet 3",
                "mood": "happy",
                "is_public": 0
            };

            return supertest(app)
                .post('/api/entries')
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('id', 'title', 'user_id', 'bullet_1', 'bullet_2', 'bullet_3', 'is_public');
                    //expect(res.body.title).to.equal(newItem.title);
                    expect(res.headers.location).to.equal(`/api/entries/${res.body.id}`)
                });
        });

        it('should respond with 400 status when given bad data', function () {
            const badItem = {
                foobar: 'broken item'
            };
            return supertest(app)
                .post('/api/entries')
                .send(badItem)
                .expect(400);
        });

    });


    describe('PATCH (update) entry by id', () => {

        beforeEach('insert some entries', () => {
            return db('entries').insert(entries);
        })

        //relevant
        // it('should update item when given valid data and an id', function () {
        //     const item = {
        //         'title': 'New Entry'
        //     };

        //     let doc;
        //     return db('entries')
        //         .first()
        //         .then(_doc => {
        //             doc = _doc
        //             return supertest(app)
        //                 .patch(`/api/entries/${doc.id}`)
        //                 .send(item)
        //                 .expect(200);
        //         })
        //         .then(res => {
        //             expect(res.body).to.be.a('object');
        //             expect(res.body).to.include.keys('id', 'title', 'completed');
        //             expect(res.body.title).to.equal(item.title);
        //             expect(res.body.completed).to.be.false;
        //         });
        // });

        // it('should respond with 400 status when given bad data', function () {
        //     const badItem = {
        //         foobar: 'broken item'
        //     };

        //     return db('pancake')
        //         .first()
        //         .then(doc => {
        //             return supertest(app)
        //                 .patch(`/api/pancakes/${doc.id}`)
        //                 .send(badItem)
        //                 .expect(400);
        //         })
        // });

        // it('should respond with a 404 for an invalid id', () => {
        //     const item = {
        //         'title': 'New entry'
        //     };
        //     return supertest(app)
        //         .patch('/api/entries/aaaaaaaaaaaaaaaaaaaaaaaa')
        //         .send(item)
        //         .expect(404);
        // });

    });

    describe('DELETE an entry by id', () => {

        beforeEach('insert some entries', () => {
            return db('entries').insert(entries);
        })

        //relevant
        it('should delete an item by id', () => {
            return db('entries')
                .first()
                .then(doc => {
                    return supertest(app)
                        .delete(`/api/entries/${doc.id}`)
                        .expect(204);
                })
        });

        it('should respond with a 404 for an invalid id', function () {

            return supertest(app)
                .delete('/api/entries/aaaaaaaaaaaaaaaaaaaaaaaa')
                .expect(404);
        });
    });
});