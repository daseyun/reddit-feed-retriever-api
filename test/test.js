process.env.NODE_ENV = "test";

var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("Init: May fail depending on timeout based on reddit servers. Rerun test if so.", function() {
  describe("/api/", () => {
    it("it should be empty when started first time", done => {
      chai
        .request(server)
        .get("/api")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("/api/r/news/", () => {
    it("should fetch 26 items. if this fails, it's because reddit api changed.", done => {
      chai
        .request(server)
        .get("/api/r/news/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(26);
          done();
        });
    });
  });
  describe("/api/r/news/3", () => {
    it("should fetch up to 4 items. (0,1,2,3)", done => {
      chai
        .request(server)
        .get("/api/r/news/3")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(4);
          done();
        });
    });
  });
});

var test_uid;
describe("GET", function() {
  describe("/api/objects", () => {
    it("it should return all links", done => {
      chai
        .request(server)
        .get("/api")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(4);
          test_uid = res.body[1].uid;
          done();
        });
    });
  });
  describe("/api/objects/<UID>", () => {
    it("should fetch one specific json object of same uid", done => {
      chai
        .request(server)
        .get("/api/objects/" + test_uid)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.subreddit.should.be.eql("news");
          res.body.uid.should.be.eql(test_uid);
          done();
        });
    });
  });
  describe("/api/objects/<UID> with unexisting uid", () => {
    it("should throw an error", done => {
      chai
        .request(server)
        .get("/api/objects/14213")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a("Object");
          done();
        });
    });
  });
});

describe("POST", function() {
  describe("/api/objects", () => {
    var new_test_obj = {
      age: 12,
      year: 2012
    };
    it("it should return added object", done => {
      chai
        .request(server)
        .post("/api/objects")
        .send(new_test_obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.age.should.equal(12);
          res.body.year.should.be.equal(2012);

          done();
        });
    });
  });
  describe("/api/objects", () =>
    it("objects length should now be 5", done => {
      chai
        .request(server)
        .get("/api/objects")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.equal(5);

          done();
        });
    }));
});

describe("PUT", function() {
  describe("/api/objects", () => {
    var new_test_obj = {
      age: 12,
      year: 2012
    };
    it("it should return updated and have same uid object", done => {
      chai
        .request(server)
        .put("/api/objects/" + test_uid)
        .send(new_test_obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.uid.should.be.equal(test_uid);
          res.body.age.should.equal(12);
          res.body.year.should.be.equal(2012);

          done();
        });
    });
  });
  describe("/api/objects", () => {
    var new_test_obj = {
      age: 12,
      year: 2012
    };
    it("bad uid should return error", done => {
      chai
        .request(server)
        .put("/api/objects/" + 1412)
        .send(new_test_obj)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });
  describe("/api/objects", () =>
    it("objects length should remain same", done => {
      chai
        .request(server)
        .get("/api/objects")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.equal(5);

          done();
        });
    }));
});

describe("DELETE", function() {
  describe("/api/objects", () => {
    it("it should return no response", done => {
      chai
        .request(server)
        .delete("/api/objects/" + test_uid)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("/api/objects", () => {
    it("bad uid should return error", done => {
      chai
        .request(server)
        .delete("/api/objects/" + 1234)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("/api/objects", () =>
    it("objects length should now be 4", done => {
      chai
        .request(server)
        .get("/api/objects")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.equal(4);
          done();
        });
    }));
});
