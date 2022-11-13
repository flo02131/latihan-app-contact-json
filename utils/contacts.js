const fs = require('node:fs')
const {existsSync} = require('node:fs')

//Membuat Folder Data Jika Belum Ada
if (!existsSync('./data')) {
    fs.mkdir('./data', {recursive: true}, (err) => {
        if (err) throw err
    })
}

//Membuat File Contacts Json Jika Belum Ada
if (!existsSync('./data/contacts.json')) {
    fs.writeFile('./data/contacts.json', '[]', 'utf-8' , (err) => {
        if (err) throw err
    })
}

//Akses ke File Contacts Json
const Akses = () => {
    const reading = fs.readFileSync('./data/contacts.json', 'utf-8')
    const parse = JSON.parse(reading)
    return parse
}

//Simpan Data Ke File Contacts Json
const Simpan = (data) => {
    fs.writeFileSync('./data/contacts.json', JSON.stringify(data))
}

//Tambah Data Contacts
const Create = (NewData) => {
    const load = Akses()
    load.push(NewData)
    Simpan(load)
}

//Mencari Details Data Contacts Berdasarkan Nama
const FindContact = (nama) => {
    const load = Akses()
    return load.find((cek) => cek.nama === nama)
}

//Hapus Data Contact
const Hapus = (nama) => {
    const load = Akses()
    const filtered = load.filter((cek) => cek.nama !== nama)
    Simpan(filtered)
}

//Mengecek Apakah Data Nama Yang Sama Di File Contacts Json
const CheckNama = (nama) => {
    const load = Akses()
    return load.find((cek) => cek.nama === nama)
}

//Edit Data Contacts
const Edit = (data) => {
    const load = Akses()
    const FilterData = load.filter((cek) => cek.nama !== data.OldName)
    delete data.OldName
    FilterData.push(data)
    Simpan(FilterData)
}

module.exports = {Akses, Create, FindContact, Hapus, CheckNama, Edit}