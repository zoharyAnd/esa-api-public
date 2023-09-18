const admin = require('firebase-admin');
const db = admin.firestore();

async function get(page){
  const subjects = await db.collection('subjects').get();
  const res = [];

  subjects.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function search(filter){
  const subjects = await db.collection('subjects').where('value', '==', filter.value).get();
  
  const res = [];
  subjects.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function add(subject){
  const ref = db.collection('subjects').doc();
  
  const data = {
    id: ref.id,
    label: subject.label,
    value: subject.value
  };

  await db.collection("subjects").add(data);

  return data;
}

async function update(id, subject){
  let res = {};

  const subjects = await db.collection('subjects').where('id', '==', id).get();
  subjects.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...subject};
    doc.ref.update(subject);
  });

  return res;
}

async function deleteById(id){
  const subjects = await db.collection('subjects').where('id', '==', id).get();
  subjects.forEach( doc => {
    doc.ref.delete();
  });

  return {
    message: 'subject deleted successfully'
  };
}

module.exports = {
  get, search, update, add, deleteById
}