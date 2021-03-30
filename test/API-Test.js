const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);
var id ="";
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
      .send({"name":"NewClerkName1","surname":"NewClerkSurname1","email":"clerk123@fakemail11.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34612345679","address":"myAddress","role":"UNAUTHENTICATED"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else{
          id=res.body._id;
          done();
        }
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

});

