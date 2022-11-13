const { urlencoded } = require('express')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const {body, validationResult, check} = require('express-validator')
const {Akses, Create, FindContact, Hapus, CheckNama, Edit} = require('./utils/contacts.js')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)

//Middleware
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(express.static('public'))
app.use(urlencoded({extended: true}))

//Route Home
app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/template'
    })
})

//Route About
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/template'
    })
})

//Route Contact
app.get('/contact', (req, res) => {
    const load = Akses()
    res.render('contact', {
        layout: 'layouts/template',
        msg: req.flash('msg'),
        load
    })
})

//Route Tambah Contact
app.get('/contact/create', (req, res) => {
    res.render('create', {
        layout: 'layouts/template'
    })
})

//Proses Tambah Contact
app.post('/contact', [
    body('nama').custom((value) => {
        const cek = CheckNama(value)
        if (cek) {
            throw new Error('Nama Sudah Terdaftar')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No Hp Tidak Valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('create', {
            layout: 'layouts/template',
            errors: errors.array()
        })
    }else{
    Create(req.body)
    req.flash('msg', 'Data Berhasil di Tambahkan')
     res.redirect('/contact')  
    }
})

//Route Hapus Contact
app.get('/contact/delete/:nama', (req, res) => {
    const hps = FindContact(req.params.nama)

    //Jika Tidak Ada Nama Yang Sesuai
    if (!hps) {
        res.status(404)
        res.redirect('/errors')
    }else{
        Hapus(req.params.nama)
        req.flash('msg', 'Data Berhasil di Hapus')
        res.redirect('/contact')
    }
})

//Route Edit Contact
app.get('/contact/edit/:nama', (req, res) => {
    const val = FindContact(req.params.nama)
    res.render('edit', {
        layout: 'layouts/template',
        val
    })
})

//Proses Edit Contact
app.post('/contact/update', [
    body('nama').custom((value, {req}) => {
        const cek = CheckNama(value)
        if (value !== req.body.OldName && cek) {
            throw new Error('Nama Sudah Terdaftar')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No Hp Tidak Valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit', {
            layout: 'layouts/template',
            errors: errors.array(),
            val: req.body
        })
    }else{
    Edit(req.body)
    req.flash('msg', 'Data Berhasil di Ubah')
     res.redirect('/contact')  
    }
})

//Route Details Contact
app.get('/contact/:nama', (req, res) => {
    const find = FindContact(req.params.nama)
    res.render('details', {
        layout: 'layouts/template',
        find
    })
})

//Route Error Handling
app.use('/', (req, res) => {
    res.status(404)
    res.render('errors', {
        layout: 'layouts/template'
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})