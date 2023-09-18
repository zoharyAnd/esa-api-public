const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function getNbNotif(codeEleve, user){
  const news = await db.collection('dashboard').get();
  let invoices;

  let resNews = [];
  let resInvoices = [];

  if (codeEleve !== '') {
    invoices = await db.collection('invoices')
      .where('codeEleve', '==', codeEleve)
      .where('viewed', '!=', true)
      .get();

  }
  invoices.forEach( doc => {
    resInvoices.push(doc.data());
  });

  news.forEach( doc => {
    const news = doc.data();

    const resTarget = news.target.filter((a) => a.codeEleve === codeEleve || a.codeEleve === `${user.role}S`);
    
    if (resTarget.length > 0) {
      resNews.push(doc.data());
    }
    
  });

  resNews = resNews.filter((a) => !a.views.includes(codeEleve));

  return {
    nb_notifs: resNews.length,
    nb_unread_invoices: resInvoices.length
  };
}

async function getAll(){

  const news = await db.collection('dashboard').get();

  const res = [];
  news.forEach( doc => {
    res.push(doc.data());
  });

  return {
    data: res
  };
}

async function search(filters){

  const news = await db.collection('dashboard').get();

  let res = [];
  news.forEach( doc => {
    res.push(doc.data());
  });

  res = res.filter((a) => filters.target.includes(a));
  return {
    data: res
  };
}

async function add(news){
  
  const ref = db.collection('dashboard').doc();
  
  const data = {
    id: ref.id,
    title: news.title,
    description: news.description,
    target: news.target,
    files: news.files,
    lastUpdated: moment(new Date()).format('YYYY-MM-DD HH:mm'),
    views: [],
  };

  await db.collection("dashboard").add(data);

  return data;
}

async function update(id, news){
  let res = {};

  const r = await db.collection('dashboard').where('id', '==', id).get();
  r.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...news};
    doc.ref.update(news);
  });

  return res;
}

async function markAsRead(id, codeEleve){
  let res = {};

  const r = await db.collection('dashboard').where('id', '==', id).get();
  r.forEach( doc => {
    const temp = doc.data();
    const tempViews = temp.views;
    tempViews.push(codeEleve);

    res = { ...temp, views: tempViews };
    doc.ref.update(temp);
  });

  return res;
}

async function deleteById(id){
  const news = await db.collection('dashboard').where('id', '==', id).get();
  news.forEach( doc => {
    doc.ref.delete();
  });

  return {
    message: 'News deleted successfully'
  };
}

module.exports = {
  getNbNotif, getAll, search, add, update, deleteById, markAsRead
}