/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
//I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
//The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };
    if (!issue.issue_title, !issue.issue_text, !issue.created_by){
      res.send("Missing values!")
    } else {
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.collection(project).insertOne(issue, function(err, doc){
        //console.log(doc);
        //console.log(issue);
        res.json(issue);
      })
    });
    }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var fields = req.body;
      var issue = req.body._id;
      delete req.body._id;
       for (var elem in fields) {
         if (!fields[elem]) {
           delete fields[elem];
         }
       }
      //console.log(fields.length);
      if (Object.keys(fields).length === 0) {
        console.log('no fields')
        res.send('no update field sent');
      } else {
          if (!issue) {
            res.send('_id not found');
          } else {
            MongoClient.connect(CONNECTION_STRING, function(err, db) {
              db.collection(project).findAndModify({_id: new ObjectId(issue)},{$set: fields}, {updated_on: new Date()}, {new: true}, function(err, doc){
                if (err) {
                  res.send('could not be updated ' + issue + err);
                } else {
                  //console.log(doc);
                  //console.log(issue);
                   res.send('successfully updated');
                  }
                 })
              })
            }
          }
        })
    
    .delete(function (req, res){
      var project = req.params.project;
      var issue = req.body._id;
      if (!issue) {
        res.send('_id error');
      } else {
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          db.collection(project).findAndRemove({_id: new ObjectId(issue), function(err,doc){
           if (err) {
            res.send('could not delete ' + issue + err);
           } else {
            res.send('deleted ' + issue);
           }
          }})
        })
    }
    });
    
};
  