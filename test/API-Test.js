const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

// var authController = require('../controllers/authController');
// var actorController = require('../controllers/actorController');


var customToken = "";
var idToken = "";

const { expect } = chai;
chai.use(chaiHttp);
var id = "";
var ticker = "";
var idApp = "";
describe("API Testing", () => {
  it("Login with Admin Actor", done => {
    chai
      .request(app)
      .post("/v2/login")
      .send({
        "email": "freditoadmin@us.es",
        "password": "mypass"
      })
      .end((err, res) => {
        customToken = res.body.customToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get admin idToken", done => {
    chai
      .request(app)
      .get("/v2/custom/" + customToken)
      .end((err, res) => {
        idToken = res.body.idToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get Actors", done => {
    chai
      .request(app)
      .get("/v1/actors")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  //Cogemos el id del actor en el post para hacer el get y el delete del mismo
  it("Post Actor", done => {
    chai
      .request(app)
      .post("/v1/actors")
      .send({ "name": "NewClerkName1", "surname": "NewClerkSurname1", "email": "new@fakemail11.com", "password": "$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO", "phone": "+34612345679", "address": "myAddress", "role": "UNAUTHENTICATED" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else {
          id = res.body._id;
          done();
        }
      });
  });
  it("Put Actor", done => {
    chai
      .request(app)
      .put("/v1/actors/" + id)
      .send({ "name": "NewUPDATED", "surname": "NewUPDATED", "email": "newUPDATED@fakemail11.com", "password": "$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO", "phone": "+34612345679", "address": "myAddress", "role": "UNAUTHENTICATED" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get Actor", done => {
    chai
      .request(app)
      .get("/v1/actors/" + id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Delete Actor", done => {
    chai
      .request(app)
      .delete("/v1/actors/" + id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Get Trips", done => {
    chai
      .request(app)
      .get("/v2/trips")
      .set("Authorization",idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Get Trips with Search", done => {
    chai
      .request(app)
      .get("/v1/trips?keyWord=keyword")
      .set("Authorization", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Login with Admin Actor", done => {
    chai
      .request(app)
      .post("/v2/login")
      .send({
        "email": "freditomanager@us.es",
        "password": "mypass"
      })
      .end((err, res) => {
        customToken = res.body.customToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get admin idToken", done => {
    chai
      .request(app)
      .get("/v2/custom/" + customToken)
      .end((err, res) => {
        idToken = res.body.idToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  //Cogemos el id del actor en el post para hacer el get y el delete del mismo
  it("Post Trip", done => {
    chai
      .request(app)
      .post("/v2/trips")
      .set("idtoken", idToken)
      .send({
        "title": "testing3",
        "description": "desc of testing",
        "price": 200,
        "requirements": [],
        "start_date": "2020-12-12T23:00:00.121Z",
        "end_date": "2021-01-12T23:00:00.131Z",
        "stages": [],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
        ticker = res.body.ticker;
        tripId = res.body._id;
        managerId = res.body.manager_id;
      });
  });
  it("Put Trip", done => {
    chai
      .request(app)
      .put("/v2/trips/" + ticker)
      .set("idtoken", idToken)
      .send({
        "title": "testingUpdated",
        "description": "desc of testing",
        "price": 200,
        "requirements": [],
        "start_date": "2020-12-12T23:00:00.121Z",
        "end_date": "2021-01-12T23:00:00.131Z",
        "stages": []
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get Trip", done => {
    chai
      .request(app)
      .get("/v2/trips/" + ticker)
      .set("idtoken", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Login with Admin Actor", done => {
    chai
      .request(app)
      .post("/v2/login")
      .send({
        "email": "rod@us.es",
        "password": "aaaaaa"
      })
      .end((err, res) => {
        customToken = res.body.customToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get explorer idToken", done => {
    chai
      .request(app)
      .get("/v2/custom/" + customToken)
      .end((err, res) => {
        idToken = res.body.idToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get FinderCollection", done => {
    chai
      .request(app)
      .get("/v2/finderCollection")
      .set("idtoken", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  // it("Delete Finder", done => {
  //   chai
  //     .request(app)
  //     .delete("/v2/finderCollection?keyword="+keyword)
  //     .set("idtoken",idToken)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       if (err) done(err);
  //       else done();
  //     });
  // });

  it("Get Applications", done => {
    chai
      .request(app)
      .get("/v2/applications")
      .set("idtoken", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post Application", done => {
    chai
      .request(app)
      .post("/v2/applications")
      .set("idtoken", idToken)
      .send({
        "manager_id": managerId,
        "trip_id": tripId,
        "explorer_id": "607088b919ae3d3c649e9069"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
        idApp = res.body._id;
      });
  });
  // No tiene mucho sentido el update de los ids?
  // it("Put Application", done => {
  //   chai
  //     .request(app)
  //     .put("/v1/applications/"+id)
  //     .send(
  //       {
  //         "manager_id":"60635f7e7093633c0444733f",
  //         "trip_id":"604fb867adaadd175844912c",
  //         "explorer_id":"60635f497093633c0444733e"
  //       })
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect('Content-Type', /json/);
  //       if (err) done(err);
  //       else done();
  //     });
  // });
  it("Login with Manager Actor", done => {
    chai
      .request(app)
      .post("/v2/login")
      .send({
        "email": "freditomanager@us.es",
        "password": "mypass"
      })
      .end((err, res) => {
        customToken = res.body.customToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get manager idToken", done => {
    chai
      .request(app)
      .get("/v2/custom/" + customToken)
      .end((err, res) => {
        idToken = res.body.idToken;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Get Application", done => {
    chai
      .request(app)
      .get("/v2/applications/" + idApp)
      .set("idtoken", idToken)
      .send({ "trip_id": tripId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Delete Application", done => {
    chai
      .request(app)
      .delete("/v2/applications/" + idApp)
      .set("idtoken", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
  it("Delete Trip", done => {
    chai
      .request(app)
      .delete("/v2/trips/" + ticker)
      .set("idtoken", idToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

});

