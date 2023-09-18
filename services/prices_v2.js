const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require('moment');

async function getAll(params){
  let prices;

  if (params.school_year && params.category) {
    prices = await db.collection('prices_v2')
      .where('category', '==', params.category)
      .where('school_year', '==', params.school_year)
      .get();
  } else if (params.category) {
    if (params.category === 'Other'){
      prices = await db.collection('prices_v2')
        .where('category', '!=', 'Ecolage')
        .get();
    } else {
      prices = await db.collection('prices_v2')
        .where('category', '==', params.category)
        .get();
    }
  } else {
    if (params.apply_to_website) {
      const applied_to_website = await db.collection('prices_v2')
        .where('apply_to_website', '==', true).get();
      
      const lunchWebsite = await db.collection('prices_v2')
        .where('category', '==', 'Cantine/Gouter')
        .get();

      prices = [...applied_to_website.docs, ...lunchWebsite.docs];
    } else {
      prices = await db.collection('prices_v2').get();
    }
    
  }
  
  const res = [];
  prices.forEach( doc => {
    res.push(doc.data());
  });
  return {
    data: res
  };
}

async function getInvoicePrices() {
  const prices = await db.collection('prices_v2').get();
  const res = [];
  const levels = ['daycare', 'pre_school', 'elementary', 'middle_school'];
  const labelLevels = {
    'daycare': 'Daycare',
    'pre_school': 'Pre-school',
    'elementary': 'Elementary',
    'middle_school': 'Middle school',
  };

  prices.forEach( doc => {
    const data = doc.data();
    if (data.school_year) {
      Object.keys(data.prices).forEach( priceKey => {
        if (priceKey !== 'total') {
          levels.forEach(level => {
            const levelPrice = data.prices[priceKey][level];
            const prefixId = `${data.school_year.replace('-', '_')}_${priceKey}_${level}`;
            const prefixDescription = `${data.school_year} ${data.prices[priceKey].label} ${labelLevels[level]}`;
            
            if (levelPrice.full_time) {
              res.push({
                id: `${prefixId}_full_time`,
                amount: levelPrice.full_time,
                description: `${prefixDescription} Full time`
              });
              res.push({
                id: `${prefixId}_part_time`,
                amount: levelPrice.part_time,
                description: `${prefixDescription} Part time`
              });
            } else {
              res.push({
                id: `${prefixId}`,
                amount: levelPrice,
                description: `${prefixDescription}`
              });
            }
            
          });
        }
      });
    } else {
      // const desc = data.description || '';
      // const formattedAmount = formatPrice(String(data.amount));
      let tmpData = { ...data, description: data.description};

      // const regex = /\d+(?:\s?\d{3})*(?!\d)|\d/g;
      // const numbers = desc.match(regex);

      // if (numbers) {
      //   const arrNb = numbers.map(nb => Number(nb.replace(/\s/g, '')));
      //   if (arrNb.includes(data.amount)) {
      //     tmpData = {
      //       ...data,
      //       description: data.description
      //     };
      //   }
      // }
      
      res.push(tmpData);
    }
    
  });
  return { data: res };
}

async function search(filters){

  const prices = await db.collection('prices_v2').get();

  const res = [];
  prices.forEach( doc => {
    res.push(doc.data());
  });
  return {
    data: res
  };
}

async function add(price){
  
  const ref = db.collection('prices_v2').doc();
  let data = { id: ref.id, version: 'v2' };
  if (price.prices) {
    data = {
      ...data,
      school_year: price.school_year,
      application_deadline: price.application_deadline,
      apply_to_website: price.apply_to_website,
      category: price.category,
      prices: price.prices,
    }
  } else {
    data = {
      ...data,
      description: price.description,
      amount: price.amount,
      category: price.category,

    }
  }
  
  await db.collection("prices_v2").add(data);

  // adding logs
  const refLog = db.collection('logs').doc();
  await db.collection("logs").add({
    id: refLog.id,
    action: "add",
    entity: "prices_v2",
    payload: JSON.stringify(data),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return data;
}

async function addMultiplePrices(){

  // Create a batch write operation
  const batch = db.batch();

  // Define the data to be added
  const data = [
    // { description: 'SCHOOL BUS (110 000 AR)', amount: 110000, category: 'School bus' },
    // { description: 'SCHOOL BUS (120 000 AR)', amount: 120000, category: 'School bus' },
    // { description: 'SCHOOL BUS (130 000 AR)', amount: 130000, category: 'School bus' },
    // { description: 'SCHOOL BUS (140 000 AR)', amount: 140000, category: 'School bus' },
    // { description: 'SCHOOL BUS (150 000 AR)', amount: 150000, category: 'School bus' },
    // { description: 'SCHOOL BUS (155 000 AR)', amount: 155000, category: 'School bus' },
    // { description: 'SCHOOL BUS (160 000 AR)', amount: 160000, category: 'School bus' },
    // { description: 'SCHOOL BUS (170 000 AR)', amount: 170000, category: 'School bus' },
    // { description: 'SCHOOL BUS (180 000 AR)', amount: 180000, category: 'School bus' },
    // { description: 'SCHOOL BUS (185 000 AR)', amount: 185000, category: 'School bus' },
    // { description: 'SCHOOL BUS (20 000 AR)', amount: 20000, category: 'School bus' },
    // { description: 'SCHOOL BUS (200 000 AR)', amount: 200000, category: 'School bus' },
    // { description: 'SCHOOL BUS (215 000 AR)', amount: 215000, category: 'School bus' },
    // { description: 'SCHOOL BUS (220 000 AR)', amount: 220000, category: 'School bus' },
    // { description: 'SCHOOL BUS (230 000 AR)', amount: 230000, category: 'School bus' },
    // { description: 'SCHOOL BUS (240 000 AR)', amount: 240000, category: 'School bus' },
    // { description: 'SCHOOL BUS (25 000 AR)', amount: 25000, category: 'School bus' },
    // { description: 'SCHOOL BUS (250 000 AR)', amount: 250000, category: 'School bus' },
    // { description: 'SCHOOL BUS (255 000 AR)', amount: 255000, category: 'School bus' },
    // { description: 'SCHOOL BUS (275 000 AR)', amount: 275000, category: 'School bus' },
    // { description: 'SCHOOL BUS (41 000 AR)', amount: 41000, category: 'School bus' },
    // { description: 'SCHOOL BUS (450 000 AR)', amount: 450000, category: 'School bus' },
    // { description: 'SCHOOL BUS (50 000 AR)', amount: 50000, category: 'School bus' },
    // { description: 'SCHOOL BUS (55 000 AR)', amount: 55000, category: 'School bus' },
    // { description: 'SCHOOL BUS (60 000 AR)', amount: 60000, category: 'School bus' },
    // { description: 'SCHOOL BUS (62 500 AR)', amount: 62500, category: 'School bus' },
    // { description: 'SCHOOL BUS (70 000 AR)', amount: 70000, category: 'School bus' },
    // { description: 'SCHOOL BUS (75 000 AR)', amount: 75000, category: 'School bus' },
    // { description: 'SCHOOL BUS (80 000 AR)', amount: 80000, category: 'School bus' },
    // { description: 'SCHOOL BUS (92 500 AR)', amount: 92500, category: 'School bus' },
    // { description: 'SCHOOL BUS (95 000 AR)', amount: 95000, category: 'School bus' },
    // { description: 'SCHOOL BUS (215 000 AR)', amount: 215000, category: 'School bus' },
    // { description: 'SCHOOL BUS (260 000 AR)', amount: 260000, category: 'School bus' },
    // { description: 'SCHOOL SUPPLIES DAYCARE (100 000 AR)', amount: 100000, category: 'Inscription/Réinscription' },
    // { description: 'SCHOOL SUPPLIES ELEMENTARY (140 000 AR)', amount: 140000, category: 'Inscription/Réinscription' },
    // { description: 'SCHOOL SUPPLIES PRESCHOOL (100 000 AR)', amount: 100000, category: 'Inscription/Réinscription' },
    // { description: 'SCHOOL SUPPLIES SECONDARY (150 000 AR)', amount: 150000, category: 'Inscription/Réinscription' },
    // { description: 'SHADOW TEACHER PER MONTH', amount: 450000, category: '' },
    // { description: 'SNACK 1 Month', amount: 70000, category: 'Catine/Gouter' },
    // { description: 'SWIMMING', amount: 100000, category: 'Catine/Gouter' },
    // { description: 'TUITION FEEs (DISCOUNT)', amount: -20000, category: '' },
    // { description: 'Teachers\s child fees', amount: 50000, category: 'Ecolage' },
    // { description: 'ZUMBA', amount: 100000, category: 'Activity' },
  ];

  // Specify the collection where the documents will be added
  const collectionRef = db.collection('prices_v2');

  // Loop through the data and add documents to the batch
  data.forEach((docData) => {
    const docRef = collectionRef.doc(); // Generate a new document reference
    const sendingData = {
      id: docRef.id,
      ...docData,
    };
    batch.set(docRef, sendingData);
  });

  // Commit the batch write operation
  batch.commit()
    .then(() => {
      return 'Batch write successful'
    })
    .catch((error) => {
      return `Error writing prices: ${error}`;
    });
}

async function update(id, price){
  let res = {};

  const prices = await db.collection('prices_v2').where('id', '==', id).get();
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
    entity: "prices_v2",
    payload: JSON.stringify(res),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return res;
}

async function deleteById(id){
  let deletedItem = {};

  const prices = await db.collection('prices_v2').where('id', '==', id).get();
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
    entity: "prices_v2",
    payload: JSON.stringify(deletedItem),
    date: moment().format("YYYY-MM-DD[T]HH:mm:ss")
  });

  return {
    message: 'Price deleted successfully'
  };
}

module.exports = {
  getAll, search, add, update, deleteById, addMultiplePrices, getInvoicePrices
}