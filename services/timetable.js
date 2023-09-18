const admin = require('firebase-admin');
const db = admin.firestore();

async function get(page, from, to, level){
  const timetables = await db.collection('timetables')
  .where('date', ">=", from)
  .where('date', "<=", to)
  .where('level', "==", level)
  .get();

  const res = [];

  timetables.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function add(timetable){
  const ref = db.collection('timetables').doc();
  
  const data = {
    id: ref.id,
    date: timetable.date,
    level: timetable.level,
    cahierDeTexte: timetable.cahierDeTexte,
    subjectName: timetable.subjectName,
    termNumber: timetable.termNumber,
    timeEnd: timetable.timeEnd,
    timeStart: timetable.timeStart,
    weekNumber: timetable.weekNumber,
    recurrent: timetable.recurrent,
    files: timetable.files,
    school_year: timetable.school_year,
  };

  await db.collection("timetables").add(data);

  return data;
}

async function update(id, timetable){
  let res = {};

  const timetables = await db.collection('timetables').where('id', '==', id).get();
  timetables.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...timetable};
    doc.ref.update(timetable);
  });

  return res;
}

async function deleteById(id){
  const timetables = await db.collection('timetables').where('id', '==', id).get();
  timetables.forEach( doc => {
    doc.ref.delete();
  });

  return {
    message: 'timetable deleted successfully'
  };
}

module.exports = {
  get, add, update, deleteById
}