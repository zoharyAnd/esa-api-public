const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function login(credentials) {
  const users = await db.collection('users').where('username', '==', credentials.username.toUpperCase()).where('password', '==', credentials.password).get();
  
  const res = [];
  users.forEach( doc => {
    res.push(doc.data());
  });
  return res;
}

async function search(by, filter){
  const users = await db.collection('users').where(by, '==', filter.value).get();
  
  const res = [];
  users.forEach( doc => {
    const temp = doc.data();
    const toSend = {
      id: temp.id,
      codeEleve: temp.codeEleve,
      level: temp.level,
      role: temp.role,
      username: temp.username,
      name: temp.name,
      active: temp.active ? temp.active : true
    }
    res.push(toSend);
  });
  return {
    data: res
  };
}

async function searchFull(by, filter){
  const users = await db.collection('users').where(by, '==', filter.value).get();
  
  const res = [];
  users.forEach( doc => {
    const temp = doc.data();
    res.push(temp);
  });
  return {
    data: res
  };
}

async function searchById(id){
  const users = await db.collection('users').where('id', '==', id).get();
  
  const res = [];
  users.forEach( doc => {
    res.push(doc.data());
  });
  return {
    data: res
  };
}

async function add(user) {
  const ref = db.collection('users').doc();
  
  const data = {
    id: ref.id,
    name: user.name,
    address: user.address,
    mom: {
      tel: user.mom.tel,
      email: user.mom.email,
      name: user.mom.name
    },
    codeEleve: user.codeEleve,
    password: user.password,
    dob: user.dob,
    username: user.username,
    dad: {
      tel: user.dad.tel,
      email: user.dad.email,
      name: user.dad.name
    },
    role: user.role,
    level: user.level,
    emergencyContact: user.emergencyContact,
    active: true
  };

  await db.collection("users").add(data);

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "users",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return data;
}

async function update(id, user){
  let res = {};

  const users = await db.collection('users').where('id', '==', id).get();
  users.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...user};
    doc.ref.update(user);
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "update",
    entity: "users",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function deleteUser(id){
  let deletedItem = {};

  const users = await db.collection('users').where('id', '==', id).get();
  users.forEach( doc => {
    const temp = doc.data();
    deletedItem = { ...temp };
    doc.ref.delete();
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "delete",
    entity: "users",
    payload: JSON.stringify(deletedItem),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return {
    message: 'User deleted successfully'
  };
}

module.exports = {
  login, add, update, deleteUser, 
  search, searchById, searchFull
}