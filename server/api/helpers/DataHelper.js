const knex = require('../services/index.js').knex;
const util = require('util');
//var ipedsId = '110662';
const jsonToCsv = require('json2csv');
let dataMap = {};

let Helper = {};

let seenRows = [];

Helper.joinUserHeartsToProfile = (schoolId, userId) => {
  if (schoolId && userId) {
    return new Promise((resolve, reject) => {
      knex
        .vbdash('user_pinned_schools')
        .select('*')
        .where('id_ipeds', schoolId)
        .andWhere('first_pinned_date', '>=', '2017-04-01')
        .andWhere('first_pinned_date', '<=', '2017-04-30')
        .innerJoin(
          'user_profile_testing',
          'user_pinned_schools.user_id',
          '=',
          'user_profile_testing.customer_id'
        )
        .then(function(rows) {
          resolve(rows);
        })
        .catch(function(error) {
          console.log(util.inspect(error));
          reject();
        });
    });
  } else {
  }
};

Helper.updateSeenLeads = (jsonArray, schoolId) => {
  if (seenRows && seenRows[0] && seenRows[0].ipeds_id === schoolId) {
    let schoolLeads = seenRows[0].leads;
    jsonArray.forEach(function(profile) {
      schoolLeads.push(profile.customer_id);
    });
    knex
      .vbdash('seen_leads')
      .where('ipeds_id', schoolId)
      .update({
        leads: JSON.stringify(schoolLeads)
      })
      .then(function(result) {
        console.log(result);
      });
  } else {
    Helper.getSeenLeads(schoolId).then(function(rows) {
      jsonArray.forEach(function(profile) {
        rows[0].leads.push(profile.customer_id);
      });
      knex
        .vbdash('seen_leads')
        .where('ipeds_id', schoolId)
        .update({
          leads: JSON.stringify(rows[0].leads)
        })
        .then(function(result) {
          console.log(result);
        });
    });
  }
};

Helper.exportUserHeartsAndProfile = (schoolId, start, end) => {
  if (schoolId && start && end) {
    let key = `${schoolId}::${start}::${end}`;
    if (dataMap[key]) {
      let data = dataMap[key];
      console.log('key found with data');
      return new Promise((resolve, reject) => {
        try {
          let result = jsonToCsv({ data: data });
          resolve(result);
        } catch (error) {
          console.error(error.message);
          reject(error);
        }
      });
    } else {
      console.log('key not found, doing more sql');
      return new Promise((resolve, reject) => {
        Helper.joinUserHeartsAndProfile(schoolId, start, end)
          .then(function(rows) {
            try {
              let result = jsonToCsv({ data: rows });
              resolve(result);
            } catch (error) {
              console.error(error.message);
              reject(error);
            }
          })
          .catch(function(error) {
            // let error = new Error('unable to join hearts and user profile!');
            reject(error);
          });
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      let error = new Error('Missing parameters!');
      reject(error);
    });
  }
};

Helper.joinUserHeartsAndProfile = (schoolId, start, end) => {
  if (schoolId && start && end) {
    return new Promise((resolve, reject) => {
      let sql = knex
        .vbdash('user_pinned_schools')
        .select('*')
        .where('id_ipeds', schoolId)
        .andWhere('first_pinned_date', '>=', `${start}`)
        .andWhere('first_pinned_date', '<=', `${end}`)
        .innerJoin('user_profile', function() {
          this.on(
            'user_pinned_schools.user_id',
            '=',
            'user_profile.customer_id'
          );
        })
        .whereNot('firstName', '')
        .andWhereNot('lastName', '')
        .andWhereNot('email', '')
        .orderBy('first_pinned_date', 'asc')
        .toString();
      console.log(sql);
      knex
        .vbdash('user_pinned_schools')
        .select('*')
        .where('id_ipeds', schoolId)
        .andWhere('first_pinned_date', '>=', `${start}`)
        .andWhere('first_pinned_date', '<=', `${end}`)
        .innerJoin('user_profile', function() {
          this.on(
            'user_pinned_schools.user_id',
            '=',
            'user_profile.customer_id'
          );
        })
        .whereNot('firstName', '')
        .andWhereNot('lastName', '')
        .andWhereNot('email', '')
        .orderBy('first_pinned_date', 'asc')
        .then(function(rows) {
          dataMap = {};
          dataMap[`${schoolId}::${start}::${end}`] = rows;
          resolve(rows);
        })
        .catch(function(error) {
          console.log(util.inspect(error));
          reject(error);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      let error = new Error('No parameters!');
      reject(error);
    });
  }
};

Helper.getListOfViewbookSchools = () => {
  return new Promise((resolve, reject) => {
    knex
      .stageDb('School')
      .select('*')
      .where('is_premium', 'TRUE')
      .then(function(rows) {
        resolve(rows);
      })
      .catch(function(error) {
        console.log(util.inspect(error));
        reject();
      });
  });
};

Helper.getSchool = schoolId => {
  if (schoolId) {
    return new Promise((resolve, reject) => {
      knex
        .stageDb('School')
        .select('*')
        .where('id_ipeds', schoolId.toString())
        .then(function(row) {
          resolve(row);
        })
        .catch(function(error) {
          console.log(util.inspect(error));
          reject();
        });
    });
  } else {
  }
};

module.exports = Helper;
