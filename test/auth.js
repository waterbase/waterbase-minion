var expect = require('expect.js');
var request = require('supertest');
var Session = require('supertest-session')({app:app});
var host = 'http://localhost:12345';

describe('auth', function() {
  var userId;
  var userJson = {
    name: 'Fake User 2',
    email: 'test@test.com',
    password: 'password'
  };

  before(function(done){
    request(host)
      .del('/user')
      .end(done);
  });

  it('should create user', function(done) {
    request(host)
      .post('/admin/user')
      .send(userJson)
      .expect(201)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        userId = res.body._id;
        expect(userId).to.be.ok();
        done();
      });
  });

  it('should get by id', function(done) {
    request(host)
      .get('/admin/user/'+userId)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.be(userId);
        done();
      });
  });

  it('should log out', function(done){
    request(host)
      .del('/admin/session')
      .expect(204)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.not.be.ok();
        done();
      });
  })

  it('should log in', function(done){
    request(host)
      .post('/admin/session')
      .send(userJson)
      .expect(201)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.user).to.be.ok();
        expect(res.user._id).to.be(userId);
        done();
      });
  })

  it('should not log in with incorrect credentials', function(done){
    request(host)
      .post('/admin/session')
      .send({
        email: 'werwerwerwer',
        password: 'werwrewerwer'
      })
      .expect(401)
      .end(done);
  })

  describe('changing password', function(done) {

    before(function(done){
      request(host)
      .post('/admin/session')
      .send(userJson)
      .end(function(err, res) {
        expect(err).to.not.be.ok();
        expect(res.body._id).to.be(userId);
        done();
      });
    })

    before(function(done){
      request(host)
        .put('/admin/user/'+userId)
        .send({
          oldPassword: 'password',
          newPassword: 'password2'
        })
        .expect(204)
        .end(done);
    })

    before(function(done){
      request(host)
        .del('/admin/session')
        .expect(204)
        .end(done)
    })

    it('should login with new password', function(done){
      request(host)
        .post('/admin/session')
        .send({
          email: 'test@test.com',
          password: 'password2'
        })
        .expect(201)
        .end(function(err, res) {
          expect(err).to.not.be.ok();
          expect(res.body._id).to.be.ok();
          done();
        });
    });

    it('should not login with original password', function(done){
      request(host)
        .post('/admin/session')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
        .expect(401)
        .end(function(err, res){
          expect(err).to.not.be.ok();
          done();
        });
    });
  });
});