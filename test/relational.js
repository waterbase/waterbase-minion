var request = require('request');
var expect = require('expect.js');
var request = require('supertest');
var host = 'http://localhost:12345'

describe('testing relational', function(){
  before(function(done){
    request(host)
      .del('/animal')
      .end(done);
  });

  before(function(done){
    request(host)
      .del('/pet')
      .end(done);
  });

  before(function(done){
    request(host)
      .post('/animal')
      .send({
        type: 'dog'
      })
      .end(function(){
        done();
      });
  });

  before(function(done){
    request(host)
      .post('/pet')
      .send({
        name: 'spot',
        animal: {
          type: 'dog'
        }
      })
      .end(done);
  });

  it('should recognize references', function(done){
    request(host)
      .get('/pet')
      .expect(200)
      .end(function(err, res){
        expect(err).to.not.be.ok();
        console.log('pets', res.body);
      });
  });
});