const express = require('express')
 const app = express()
 const port = 3000
 const expressLayouts = require('express-ejs-layouts')
 const
 {loadContact,findContact,addContacts,cekDuplikat,deleteContact,updateContacts} =
 require('./utils/contact');
 const {body,validationResult,check} = require('express-validator');
 const session=require('express-session');
 const cookieParser=require('cookie-parser');
 const flash=require('connect-flash');
 // const morgan = require('morgan');
 app.set('view engine','ejs')
 app.use(expressLayouts);
 // app.use(morgan('dev'));
 app.use(express.static('public'));
 app.use(express.urlencoded());
 //konfigurasi flash
 app.use(cookieParser('secret'));
 app.use(session({
 cookie:{maxAge: 6000},
 secret:'secret',
 resave:true,
 saveUnitialized: true,
 }
 )
 );
 app.use(flash());
 app.get('/', (req, res) => {
 const
 mhs=[{nama:'agus',email:'agus@gmail.com'},{nama:'ani',email:'ani@gmail.com'}];
 res.render('index',{
 nama:'paidjo',
 title:'Halaman home',
 mhs:mhs,
 layout:'layouts/main-layout',
 });
})
app.get('/about', (req, res) => {
    res.render('about',{
    layout:'layouts/main-layout',
    title:'Halaman About'
    });
    })
    app.get('/contact', (req,res) => {
    const contacts = loadContact();
    //console.log(contacts);
    res.render('contact',{
    layout:'layouts/main-layout',
    title:'Halaman Contact',
    contacts:contacts,
    msg:req.flash('msg'),
    });
    })
    // tambah data contact
    app.get('/contact/add', (req, res) => {
    res.render('add-contact',{
    layout:'layouts/main-layout',
    title:'Form Tambah Data Contact',
    });
    });
    // app.post('/contact', (req, res) => {
    // addContacts(req.body);
    // res.redirect('/contact');
    // });
    app.post('/contact',[
    body('nama').custom((value)=>{
    const duplikat=cekDuplikat(value);
    if(duplikat){
    throw new Error('nama sdh ada..');
    }
    return true;
    }),
    check('email','email salah').isEmail(),
    check('nohp','nohp salah').isMobilePhone('id-ID')
    ], (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()){
    //return res.status(400).json({errors:errors.array()});
    res.render('add-contact',{
        title:'Form Tambah Data Contact',
        layout:'layouts/main-layout',
        errors:errors.array(),
        });
        }else{
        addContacts(req.body);
        req.flash('msg','Data contact berhasil ditambahkan..')
        res.redirect('/contact');
        }
        });
        //proses delete
        app.get('/contact/delete/:nama',(req,res)=>{
        const contact=findContact(req.params.nama);
        if(!contact){
        res.status(404);
        res.send('404');
        } else{
        //res.send('OK');
        deleteContact(req.params.nama);
        req.flash('msg','Data contact berhasil dihapus..')
        res.redirect('/contact');
        }
        });
        //form edit
        app.get('/contact/edit/:nama', (req, res) => {
        const contact= findContact(req.params.nama);
        res.render('edit-contact',{
        layout:'layouts/main-layout',
        title:'Form Edit Data Contact',
        contact,
        });
        });
        //pross edit data
        app.post('/contact/update',[
        body('nama').custom((value ,{req} )=>{
        const duplikat=cekDuplikat(value);
        if(value!==req.body.nama_lama && duplikat){
        throw new Error('nama sdh ada..');
        }
        return true;
        }),
        check('email','email salah').isEmail(),
        check('nohp','nohp salah').isMobilePhone('id-ID')
    ], (req, res) => {
        const errors=validationResult(req);
        if (!errors.isEmpty()){
        //return res.status(400).json({errors:errors.array()});
        res.render('edit-contact',{
        title:'Form Edit Data Contact',
        layout:'layouts/main-layout',
        errors:errors.array(),
        contact:req.body,
        });
        }else{
        updateContacts(req.body);
        req.flash('msg','Data contact berhasil diupdate..')
        res.redirect('/contact');
        }
        });
        app.get('/contact/:nama',(req, res) => {
        const contact = findContact(req.params.nama);
        res.render('detail',{
        layout:'layouts/main-layout',
        title:'Halaman Detail Contact',
        contact,
        });
        })
        app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
        })