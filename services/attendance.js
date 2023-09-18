const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function get(page) {
  const attendances = await db.collection('attendances').get();
  const res = [];

  attendances.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function search(search){
  const attendances = await db.collection('attendances').where('codeEleve', '==', search.codeEleve).get();

  const res = [];
  attendances.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function add(attendance) {
  const ref = db.collection('attendances').doc();
  
  const data = {
    id: ref.id,
    codeEleve: attendance.codeEleve,
    date: attendance.date,
    reason: attendance.reason,
    type: attendance.type,
    term: attendance.term,
    schoolYear: attendance.schoolYear.includes('/') ? attendance.schoolYear.replace(/\//g, '-') : attendance.schoolYear,
  };

  await db.collection("attendances").add(data);

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "attendances",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return data;
}

async function update(id, attendance){
  let res = {};

  const attendances = await db.collection('attendances').where('id', '==', id).get();
  attendances.forEach( doc => {
    const temp = doc.data();
    const tmpAttendance = {
      ...attendance,
      schoolYear: attendance.schoolYear.includes('/') ? attendance.schoolYear.replace(/\//g, '-') : attendance.schoolYear,
    }
    res = { ...temp, ...tmpAttendance};
    doc.ref.update(tmpAttendance);
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "update",
    entity: "attendances",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function deleteById(id){
  let deletedItem = {};

  const attendances = await db.collection('attendances').where('id', '==', id).get();
  attendances.forEach( doc => {
    const temp = doc.data();
    deletedItem = { ...temp };
    doc.ref.delete();
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "delete",
    entity: "attendances",
    payload: JSON.stringify(deletedItem),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return {
    message: 'Attendance deleted successfully'
  };
}

async function getStats(params) {
  const schoolYear_slash = params.schoolYear.includes('/') ? params.schoolYear : params.schoolYear.replace(/-/g, '/');
  const schoolYear_dash = params.schoolYear.includes('-') ? params.schoolYear : params.schoolYear.replace(/\//g, '-');

  const attendances = await db.collection('attendances').where('codeEleve', '==', params.codeEleve).where('term', '==', params.term).where('schoolYear', 'in', [schoolYear_slash, schoolYear_dash]).get();

    let nbDelays = 0;
  let nbAbsences = 0;

  attendances.forEach( doc => {
    if (doc.data().type === 'delay') {
      nbDelays++;
    }
    if (doc.data().type === 'absence') {
      nbAbsences++;
    }
  });

  return {
    delays: nbDelays,
    absences: nbAbsences,
  };
}


module.exports = {
  get, getStats, search, add, update, deleteById
}