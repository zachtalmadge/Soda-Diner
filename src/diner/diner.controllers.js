const Diner  = require('./diner.schema')
const { Soda } = require('../soda/soda.schema')

exports.findDiners = async (req, res) => {
    try {
        let diners = await Diner.find()
        res.json(diners)
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.findOneDiner = async (req, res) => {
    try{
        let diner = await Diner.findOne({_id: req.params.id}, {_id: 0, name: 1, location: 1, sodas: 1})
        res.json(diner)
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.saveDiner = async (req, res) => {
    try {
        let diner = new Diner({
            name: req.body.name,
            location: req.body.location
        })
        let data = await diner.save()
        res.send(data)
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.deleteDiner = (req, res) => {
    Diner.deleteOne({_id: req.params.id})
        .then(() => {
            res.sendStatus(200)
        })
        .catch(e => {
            console.log(e)
            res.status(400).end()
        })
}

exports.addSodaToDiner = async (req, res) => {
    try {
        const dinerID = req.params.dinerID
        const sodaID = req.params.sodaID
        let soda = await Soda.findOne({_id: sodaID})
        let diner = await Diner.findOne({_id: dinerID})
        diner.sodas.push(soda)
        diner.save().then(() => { 
            res.sendStatus(200) 
        })
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.deleteSodaFromDiner = async (req, res) => {
    try {
        let diner = await Diner.findOne({_id: req.params.dinerID})
        let soda = req.params.sodaID
        //select the soda from the array by _id
        diner.sodas.id(soda).remove()
        diner.save().then(() => {
            res.sendStatus(200)
        })
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.findUnservedSodas = async (req, res) => {
    try {
        let diner = await Diner.findOne({_id: req.params.dinerID},)
        // push name of each soda being served into array to build query
        let servedSodas = []
        diner.sodas.forEach(soda => servedSodas.push(soda.name))
        // not includes => names of listed sodas
        Soda.find({name: {"$nin": servedSodas}})
            .then(sodas => {
                res.json(sodas)
            })
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.editDiner = (req, res) => {
    let name, location;
    if (req.body.name) name = req.body.name
    if (req.body.location) location = req.body.location

    Diner.findByIdAndUpdate({_id: req.params.id}, {
        name: name,
        location: location
    })
    .then(() => res.sendStatus(200))
    .catch((e) => {
        console.log(e)
        res.status(400).end()
    })
}