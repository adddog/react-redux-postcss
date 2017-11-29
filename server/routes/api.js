'use strict';
const express = require('express');
const router = new express.Router();
const DataHelper = require('../api/helpers/DataHelper');
const util = require('util');
const _ = require('lodash');

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

router.get('/exportuserheartsjoin', (req, res) => {
  console.log('/exportuserheartsjoin');
  var id = req.query.id;
  var start = req.query.start;
  var end = req.query.end;

  DataHelper.exportUserHeartsAndProfile(id, start, end)
    .then(function(result) {
      return res.status(200).json({
        success: true,
        output: result
      });
    })
    .catch(function(error) {
      console.log('Error in /exportuserheartsjoin::error ->', error.message);
      return res.status(500).json({
        success: false,
        message: 'Something is wrong with /exportuserheartsjoin'
      });
    });
});

router.get('/userheartsjoin', (req, res) => {
  console.log('/userheartsjoin');
  let id = req.query.id;
  let start = req.query.start;
  let end = req.query.end;

  console.log('school id', id);

  Promise.all([DataHelper.joinUserHeartsAndProfile(id, start, end)])
    .then(function(data) {
      const rows = data[0];
      var deDupeMap = {};
      // Dont filter if there is nothing to filter or nothing to filter upon
      if (rows || rows.length) {
        var filteredRows = _.reject(rows, function(o) {
          if (deDupeMap[o.customer_id]) {
            return true;
          } else {
            deDupeMap[o.customer_id] = o;
            return false;
          }
        });
        return Promise.resolve(filteredRows);
      } else {
        return Promise.resolve(rows);
      }
    })
    .then(function(filteredRows) {
      return res.status(200).json({
        success: true,
        data: filteredRows
      });
    })
    .catch(function(error) {
      console.log('Error in /userheartsjoin::error -> ', error.message);
      return res.status(500).json({
        success: false,
        message: 'Something is wrong with /userheartsjoin'
      });
    });
});

router.get('/vbschools', (req, res) => {
  console.log('/vbschools');
  DataHelper.getListOfViewbookSchools()
    .then(function(rows) {
      var map = new Object();
      rows.forEach(function(school) {
        map[school.id_ipeds] = school;
      });

      return res.status(200).json({
        success: true,
        data: rows,
        map: map
      });
    })
    .catch(function(error) {
      console.log('Error in /vbschools::error -> ', error.message);
    });
});

router.get('/school/:id', (req, res) => {
  console.log('/school');
  DataHelper.getSchool(req.params.id)
    .then(function(row) {
      return res.status(200).json({
        success: true,
        school: row[0]
      });
    })
    .catch(function(error) {
      console.log('Error in /school::error --> ', error.message);
    });
});

//TODO
/*router.get("/viewbook/:id", (req, res) => {
  console.log("/viewbook")
  return res.status(200).json({
    success: true,
    data: [
      "https://storage.googleapis.com/samrad-chewb/images/1.jpg",
      "https://storage.googleapis.com/samrad-chewb/images/2.jpg"
      "https://storage.googleapis.com/samrad-chewb/images/3.jpg"
      "https://storage.googleapis.com/samrad-chewb/images/4.jpg"
    ]
  })
})*/

module.exports = router;
