const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function getAll(){

  const prices = await db.collection('prices').get();

  const res = [];
  prices.forEach( doc => {
    res.push(doc.data());
  });
  return {
    data: res
  };
}

async function search(filters){

  const prices = await db.collection('prices').get();

  const res = [];
  prices.forEach( doc => {
    res.push(doc.data());
  });
  return {
    data: res
  };
}

async function add(price){
  
  const ref = db.collection('prices').doc();
  
  const data = {
    id: ref.id,
    code: price.code,
    description: price.description,
    amount: price.amount,
    category: price.category ? price.category : false,
    cursusDaycare: price.cursusDaycare ? price.cursusDaycare : false,
    cursusPreschool: price.cursusPreschool ? price.cursusPreschool : false,
    cursusPrimary: price.cursusPrimary ? price.cursusPrimary: false,
    cursusMiddleschool: price.cursusMiddleschool ? price.cursusMiddleschool : false,
  };

  await db.collection("prices").add(data);
  
  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "prices",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return data;
}

async function update(id, price){
  let res = {};

  const prices = await db.collection('prices').where('id', '==', id).get();
  prices.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...price};
    doc.ref.update(price);
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "update",
    entity: "prices",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function deleteById(id){
  let deletedItem = {};

  const prices = await db.collection('prices').where('id', '==', id).get();
  prices.forEach( doc => {
    const temp = doc.data();
    deletedItem = { ...temp };
    doc.ref.delete();
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "delete",
    entity: "prices",
    payload: JSON.stringify(deletedItem),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });


  return {
    message: 'Price deleted successfully'
  };
}

module.exports = {
  getAll, search, add, update, deleteById
}