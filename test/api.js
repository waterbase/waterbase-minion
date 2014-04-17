var request = require('request');
var expect = require('expect.js');
var request = require('supertest');
var host = 'http://localhost:12345'

describe('testing minion server', function(){
  it('should respond to list', function(done) {
    request(host)
      .get('/animals')
      .expect(200)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body).to.be.ok();
        done();
      });
  });

  it('should respond to delete all', function(done) {
    request(host)
      .del('/animals')
      .expect(204)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        done();
      });
  });

  //group updates
  describe('should respond to update all', function(done) {
    before(function(done){
      request(host)
        .del('/animals')
        .end(function(){
          done();
        });
    });

    before(function(done){
      request(host)
        .post('/animals')
        .send({
          name: 'spot',
          type: 'dog'
        })
        .end(done);
    });

    before(function(done){
      request(host)
        .post('/animals')
        .send({
          name: 'sparky',
          type: 'dog'
        })
        .end(done);
    });

    before(function(done){
      request(host)
        .post('/animals')
        .send({
          name: 'scratchy',
          type: 'cat'
        })
        .end(done);
    });

    before(function(done){
      console.log('putting')
      request(host)
        .put('/animals')
        .send({
          where: {
            type: 'dog'
          },
          set: {
            awesome: true
          }
        })
        //.expect(204)
        .end(function(err, res){
          console.log('end putting');
          expect(err).to.not.be.ok();
          done();
        });
    });

    it('should update all that fits where, and only ones that fits where', function(done){
      request(host)
        .get('/animals')
        .end(function(err, res){
          res.body.forEach(function(animal){
            expect(animal.good).to.be(animal.type === 'dog');
          })
        });
    });
  });

  //create
  it('should respond to create with current schema', function(done) {
    request(host)
      .post('/animals')
      .send({
        name: 'spot',
        type: 'dog'
      })
      .expect(201)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body.name).to.be('spot');
        expect(res.body._id).to.be.ok();
        done();
      });
  });

  it('should respond to create with extra attribute', function(done) {
    request(host)
      .post('/animals')
      .send({
        name: 'spot',
        type: 'dog',
        fur: 'spotted'
      })
      .expect(201)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body.fur).to.be('spotted');
        expect(res.body._id).to.be.ok();
        done();
      });
  });

  it('should respond to create in new collection', function(done) {
    request(host)
      .post('/mammals')
      .send({
        name: 'spot',
        type: 'dog',
        fur: 'spotted'
      })
      .expect(201)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body.fur).to.be('spotted');
        expect(res.body._id).to.be.ok();
        done();
      });
  });

  //elements
  describe('elements', function(){
    var animal;
    beforeEach(function(done){
      request(host)
        .del('/animals')
        .end(function(){
          request(host)
            .post('/animals')
            .send({
              name: 'spot',
              type: 'dog'
            })
            .end(function(err, res) {
              animal = res.body;
              done();
            });
        });
    });

    afterEach(function(done){
      request(host)
        .del('/animals')
        .end(done);
    })


    it('should respond to show', function(done) {
      console.log('testing show')
      request(host)
        .get('/animals/'+animal._id)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.not.be.ok();
          expect(res.body.name).to.be('spot');
          done();
        });
    });

    it('should respond to updateOne', function(done) {
      request(host)
        .put('/animals/'+animal._id)
        .send({
          name: 'spotty'
        })
        .expect(204)
        .end(function(err, res) {
          expect(err).to.not.be.ok();
          request(host)
            .get('/animals/'+animal._id)
            .expect(200)
            .end(function(err, res) {
              expect(err).to.not.be.ok();
              expect(res.body.name).to.be('spotty');
              done();
            });
        });
    });

    it('should respond to deleteOne', function(done) {
      request(host)
        .del('/animals/'+animal._id)
        .expect(204)
        .end(function(err) {
          expect(err).to.not.be.ok();
          request(host)
            .get('/animals/'+animal._id)
            .expect(404)
            .end(function() {
              done();
            });
        });
    });
  });
});