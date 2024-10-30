const fs = require('fs');
//buat folder jika blm ada
const dirPath="./data";
if (!fs.existsSync(dirPath)){
fs.mkdirSync(dirPath);
}
//buat file contacts.json
const dataPath="./data/contacts.json";
if (!fs.existsSync(dataPath)){
fs.writeFileSync(dataPath,'[]','utf-8');
}
 //ambil semua data contacts
 const loadContact=()=>{
    const fileBuffer=fs.readFileSync('data/contacts.json','utf-8');
    const contacts=JSON.parse(fileBuffer);
    return contacts;
    };
    const findContact=(nama)=>{
    const contacts=loadContact();
    const
    contact=contacts.find((contact)=>contact.nama.toLowerCase()===nama.toLowerCase());
    return contact;
    };
    //menimpa file contacts dg baru
    const saveContacts = (contacts)=>{
    fs.writeFileSync('data/contacts.json',JSON.stringify(contacts));
    }
    //menambahkan data contact baru
    const addContacts = (contact)=>{
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
    }
    //cek duplikat
    const cekDuplikat = (nama)=>{
    const contacts = loadContact();
    return contacts.find((contact)=>contact.nama===nama);
    }
    //delete Contact
    const deleteContact = (nama)=>{
    const contacts = loadContact();
    const filteredContacts=contacts.filter((contact)=>contact.nama!==nama);
    saveContacts(filteredContacts);
    //console.log(filteredContacts);
    //return contacts.find((contact)=>contact.nama===nama);
    }
    const updateContacts = (contact_baru)=>{
    const contacts = loadContact();
    const
    filteredContacts=contacts.filter((contact)=>contact.nama!==contact_baru.nama_lama);
    delete contact_baru.nama_lama ;
    filteredContacts.push(contact_baru);
    saveContacts(filteredContacts);
     //console.log(filteredContacts,contact_baru);
 //return contacts.find((contact)=>contact.nama===nama);
 }
 module.exports={loadContact,findContact,addContacts,cekDuplikat,deleteContact,updateContacts};