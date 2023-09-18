const admin = require('firebase-admin');
const db = admin.firestore();

async function get(query){
  let levels = await db.collection('levels').get();
  if (query.name) {
    levels = await db.collection('levels').where('label', '==', query.name).get();
  }
  const res = [];

  levels.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function search(filter){
  const levels = await db.collection('levels').where('value', '==', filter.value).get();
  
  const res = [];
  levels.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function add(level){
  const ref = db.collection('levels').doc();
  
  const data = {
    id: ref.id,
    label: level.label,
    value: level.value
  };

  await db.collection("levels").add(data);

  return data;
}

async function update(id, level){
  let res = {};

  const levels = await db.collection('levels').where('id', '==', id).get();
  levels.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...level};
    doc.ref.update(level);
  });

  return res;
}

async function deleteById(id){
  const levels = await db.collection('levels').where('id', '==', id).get();
  levels.forEach( doc => {
    doc.ref.delete();
  });

  return {
    message: 'level deleted successfully'
  };
}

module.exports = {
  get, search, update, add, deleteById
}