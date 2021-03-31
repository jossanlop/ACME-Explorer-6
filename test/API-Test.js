const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);
var id ="";
var ticker="";
var idApp="";
describe("API Testing", () => {
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
      .send({"name":"NewClerkName1","surname":"NewClerkSurname1","email":"new@fakemail11.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34612345679","address":"myAddress","role":"UNAUTHENTICATED"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else{
          id=res.body._id;
          done();
        }
      });
  });
  it("Put Actor", done => {
    chai
      .request(app)
      .put("/v1/actors/"+id)
      .send({"name":"NewUPDATED","surname":"NewUPDATED","email":"newUPDATED@fakemail11.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34612345679","address":"myAddress","role":"UNAUTHENTICATED"})
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
      .get("/v1/actors/"+id)
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
      .delete("/v1/actors/"+id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Get Trips", done => {
    chai
      .request(app)
      .get("/v1/trips")
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
      .end((err, res) => {
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
      .post("/v1/trips")
      .send({
            "title": "testing",
            "description":"desc of testing",
            "price":200,
            "requirements":[],
            "start_date": "2020-12-12T23:00:00.121Z",
            "end_date": "2021-01-12T23:00:00.131Z",
            "stages": []
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else{
          ticker=res.body.ticker;
          done();
        }
      });
  });
  it("Put Trip", done => {
    chai
      .request(app)
      .put("/v1/trips/"+ticker)
      .send({
        "title": "testingUpdated",
        "description":"desc of testing",
        "price":200,
        "requirements":[],
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
      .get("/v1/trips/"+ticker)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
  it("Delete Trip", done => {
    chai
      .request(app)
      .delete("/v1/trips/"+ticker)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Get FinderCollection", done => {
    chai
      .request(app)
      .get("/v1/finderCollection")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Delete Finder", done => {
    chai
      .request(app)
      .delete("/v1/finderCollection?keyword=keyword")
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Get Applications", done => {
    chai
      .request(app)
      .get("/v1/applications")
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
      .post("/v1/applications")
      .send({
            "manager_id":"60635f7e7093633c0444733f",
            "trip_id":"604fb867adaadd175844912c",
            "explorer_id":"60635f497093633c0444733e"
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else{
          idApp=res.body._id;
          done();
        }
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
  it("Get Application", done => {
    chai
      .request(app)
      .get("/v1/applications/"+idApp)
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
      .delete("/v1/applications/"+idApp)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

});

