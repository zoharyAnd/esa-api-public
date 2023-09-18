const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function search(filters){

  let invoices;
  let student;

  if (filters.codeEleve !== "") {
    if (filters.reference) {
      invoices = await db.collection('invoices')
      .where('codeEleve', '==', filters.codeEleve)
      .where('reference', '==', filters.reference)
      .get();
    } else {
      invoices = await db.collection('invoices')
      .where('codeEleve', '==', filters.codeEleve)
      .where('school_year', '==', filters.school_year)
      .get();
    }
    student = await db.collection('users').where('codeEleve', '==', filters.codeEleve).get();
  } else {
    invoices = await db.collection('invoices')
    .where('school_year', '==', filters.school_year)
    .get();
  }
  
  
  let res = [];
  invoices.forEach( doc => {
    res.push(doc.data());
  });
  if (filters.codeEleve) {
    student.forEach( doc => {
      if (res.length > 0) {
        res[0].student = doc.data();
      }
    });
  }
  return {
    data: res
  };
}

async function add(invoice){
  const ref = db.collection('invoices').doc();
  
  const data = {
    id: ref.id,
    codeEleve: invoice.codeEleve,
    amount_due: invoice.amount_due,
    amount_paid: invoice.amount_paid,
    date_issue: invoice.date_issue ? invoice.date_issue : "",
    date_due: invoice.date_due ? invoice.date_due : "",
    description: invoice.description ? invoice.description : "",
    paid: invoice.paid,
    reference: invoice.reference,
    type: invoice.type,
    student: invoice.student,
    details: invoice.details ? invoice.details : [],
    paymentMethod: invoice.paymentMethod ? invoice.paymentMethod : '',
    penalties: [],
    payments: invoice.payments,
    school_year: invoice.school_year,
  };

  await db.collection("invoices").add(data);

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "invoice",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });


  return data;
}

async function update(id, invoice){
  let res = {};

  const invoices = await db.collection('invoices').where('id', '==', id).get();
  invoices.forEach( doc => {
    const temp = doc.data();
    res = { ...temp, ...invoice};
    doc.ref.update(invoice);
  });

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "update",
    entity: "invoice",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function markAsRead(invoice){
  let res = {};

  const invoices = await db.collection('invoices').where('id', '==', invoice.id).get();
  invoices.forEach( doc => {
    const temp = doc.data();

    const t = {...invoice, viewed: true};

    res = { ...temp, ...t};
    doc.ref.update(t);
  });

  return res;
}

async function deleteById(id){
  let deletedItem = {};

  const invoices = await db.collection('invoices').where('id', '==', id).get();
  invoices.forEach( doc => {
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
    message: 'Invoice deleted successfully'
  };
}

async function generateNextReference(filter) {
  const existings = invoices = await db.collection('invoices').orderBy('reference').startAt(filter.reference).endAt(filter.reference+'\uf8ff').get();

  const res = [];
  existings.forEach( doc => {
    let r = doc.data().reference;
    r = r.split('-');
    r = r[r.length - 1];
    res.push(Number(r));
  });

  let newRef = '001';
  if (res.length > 0) {
    newRef = Math.max(...res) + 1;
    if (newRef < 10) {
      newRef = `00${newRef}`;
    } 
    if (newRef >= 10 && newRef < 100) {
      newRef = `0${newRef}`;
    } 
    if (newRef > 100) {
      newRef = `${newRef}`;
    }
  }
  

  return newRef;
};

// async function addSchoolYearField() {
  // const collectionRef = db.collection('invoices');

  // // Retrieve all documents in the collection
  // collectionRef.get()
  // .then(snapshot => {
  //   const batch = db.batch();

  //   snapshot.forEach(doc => {
  //     const docRef = collectionRef.doc(doc.id);
  //     batch.update(docRef, { school_year: '' });
  //   });

  //   // Commit the batch
  //   return batch.commit();
  // })
  // .then(() => {
  //   console.log('Field "schoolYear" added to all documents.');
  // })
  // .catch(error => {
  //   console.error('Error adding field:', error);
  // });
  // const invoices = await db.collection('invoices').get();
  // let res = [];
  // invoices.forEach( doc => {
  //   const data = doc.data();
  //   if (!data['school_year']) {
  //     res.push(doc.data());
  //   }
  // });
  // return { data: res }
// };

// async function bulkUpdate(body){
//   const invoicesRef = db.collection('invoices');
//   invoices = await invoicesRef.get();
//   const batch = db.batch();

//   invoices.forEach( doc => {
//     const invoiceRef = invoicesRef.doc(doc.id);
//     const data = doc.data();
//     const date_to_consider = data.date_due === "" ? data.date_issue : data.date_due;

//     if (!data.school_year) {
      // for date_due === 2022
      // if (date_to_consider.includes("2022")) {
      //   const splitDateDue = date_to_consider.split("-");
      //   const in2021_20222 = Number(splitDateDue[1]) < 9;
      //   if (in2021_20222) {
      //     batch.update(invoiceRef, { school_year: "2021-2022" });
      //   } else {
      //     batch.update(invoiceRef, { school_year: "2022-2023" });
      //   }
      // }

      // // for date_due === 2023
      // if (date_to_consider.includes("2023")) {
      //   const splitDateDue = date_to_consider.split("-");
      //   const in2021_20222 = Number(splitDateDue[1]) < 9;
      //   if (in2021_20222) {
      //     batch.update(invoiceRef, { school_year: "2022-2023" });
      //   } else {
      //     batch.update(invoiceRef, { school_year: "2023-2024" });
      //   }
      // }

//       if (date_to_consider.includes("2024")) {
//         batch.update(invoiceRef, { school_year: "2023-2024" });
//       }
//     }
//   });

//   // Commit the batched updates
//   await batch.commit();

//   return {
//     data: "bulk update succeeded"
//   };
// }

module.exports = {
  search, add, update, deleteById, generateNextReference, markAsRead,
}