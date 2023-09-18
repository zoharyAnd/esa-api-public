const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function get(page){
  const grades = await db.collection('grades').get();
  const res = [];

  grades.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function search(filter){
  const grades = await db.collection('grades')
    .where('codeEleve', '==', filter.codeEleve)
    .where('term', '==', filter.term)
    .where('schoolYear', '==', filter.schoolYear).get();

  const res = [];
  grades.forEach( doc => {
    res.push(doc.data());
  });

  if (res.length === 0) {
    return [{
      codeEleve: filter.codeEleve,
      name: filter.name,
      level: filter.level,
      term: filter.term,
      schoolYear: filter.schoolYear,
      gradeQuiz: [],
      gradeExam: [],
      reportData: [],
    }];
  } else {
    return res;
  }  
}

async function add(grade){
  const ref = db.collection('grades').doc();
  
  const data = {
    id: ref.id,
    codeEleve: grade.codeEleve,
    gradeExam: grade.gradeExam,
    gradeQuiz: grade.gradeQuiz,
    reportData: grade.reportData,
    level: grade.level,
    name: grade.name,
    schoolYear: grade.schoolYear,
    term: grade.term 
  };

  await db.collection("grades").add(data);

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "grade",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return data;
}

async function update(id, grade){
  let res = {};

  const grades = await db.collection('grades').where('id', '==', id).get();
  grades.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...grade};
    doc.ref.update(grade);
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "update",
    entity: "grade",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function deleteById(id){
  let deletedItem = {};

  const grades = await db.collection('grades').where('id', '==', id).get();
  grades.forEach( doc => {
    const temp = doc.data();
    deletedItem = { ...temp };
    doc.ref.delete();
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "delete",
    entity: "invoice",
    payload: JSON.stringify(deletedItem),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });
  
  return {
    message: 'Grade deleted successfully'
  };
}

module.exports = {
  get, search, update, add, deleteById
}