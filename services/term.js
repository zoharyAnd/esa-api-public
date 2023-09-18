const admin = require('firebase-admin');
const db = admin.firestore();

async function get(schoolYear){
  const grades = await db.collection('terms').where('schoolYear', '==', schoolYear).get();
  
  const res = [];
  grades.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function getSchoolYears(){
  const years = await db.collection('terms').get();
  
  const res = [];
  years.forEach( doc => {
    res.push(doc.data().schoolYear);
  });
  return res;
}

async function add(schoolYear, terms){
  const ref = db.collection('terms').doc();
  
  const data = {
    id: ref.id,
    schoolYear: schoolYear,
    terms: terms.terms
  };

  await db.collection("terms").add(data);

  return data;
}

async function update(schoolYear, term){
  let res = {};

  const terms = await db.collection('terms').where('schoolYear', '==', schoolYear).get();
  terms.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...term};
    doc.ref.update(term);
  });

  return res;
}

module.exports = {
  get, add, update, getSchoolYears
}