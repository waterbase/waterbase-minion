var expect = require('expect.js');
var request = require('supertest');
var host = 'http://localhost:12345';

describe('auth api', function() {
  var userId;
  var userJson = {
    name: 'Fake User 2',
    email: 'test@test.com',
    password: 'password'
  };

  before(function(done){
    request(host)
      .del('/api/user')
      .end(done);
  });

  it('should create user', function(done) {
    request(host)
      .post('/api/user')
      .send(userJson)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        userId = res.body._id;
        expect(userId).to.be.ok();
        done();
      });
  });

  it('should get by id', function(done) {
    request(host)
      .get('/api/user/'+userId)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.be(userId);
        done();
      });
  });

  it('should log out', function(done){
    request(host)
      .del('/api/session')
      .expect(204)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.not.be.ok();
        done();
      });
  })

  it('should log in', function(done){
    request(host)
      .post('/api/session')
      .send(userJson)
      .expect(204)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.be(userId);
        done();
      });
  })

  it('should change password', function(done) {
    request(host)
    .post('/api/user/'+userId)
    .send({
      oldPassword: 'password',
      newPassword: 'password2'
    })
    .expect(204)
    .end(function(err, res){
      request(host)
        .del('/api/session')
        .end(function(err, res){
          request(host)
            .post('/api/session')
              .send(userJson)
              .expect(401)
              .end(function(err, res) {
                expect(err).to.not.be.ok();
                expect(res.body._id).to.not.be.ok();
                done();
              });
        });
    });
  });
});