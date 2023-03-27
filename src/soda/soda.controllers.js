const { Soda } = require('./soda.schema')

exports.findAllSodas = async (req, res) => {
    try {
        let sodas = await Soda.find()
        res.json(sodas)
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}
exports.findOneSoda = async (req, res) => {
    try {
        let soda = await Soda.findOne({_id: req.params.id}, {_id: 0, name: 1, fizziness: 1, "taste rating": 1})
        res.json(soda)
    } catch(e) {
        console.log(e)
        res.status(400).end()
    }
}

exports.saveSoda = async (req, res) => {
    const soda = new Soda({
        name: req.body.name,
        fizziness: req.body.fizziness,
        "taste rating": req.body['taste rating']
    })
    soda.save()
    .then(() => {
        res.sendStatus(200)
    })
    .catch((e) => {
        console.log(e)
        res.status(400).end()
    })
}
exports.deleteSoda = (req, res) => {
    Soda.deleteOne({_id: req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(e => {
        console.log(e)
        res.status(400).end()
    })
}

exports.editSoda = (req, res) => {
    let name, fizziness, rating;
    if (req.body.name) name = req.body.name
    if (req.body.fizziness) fizziness = req.body.fizziness
    if (req.body.rating) rating = req.body.rating

    Soda.findByIdAndUpdate({_id: req.params.id}, {
        name: name,
        fizziness: fizziness,
        'taste rating': rating
    })
    .then(() => res.sendStatus(200))
    .catch(e => {
        console.log(e)
        res.status(400).end()
    })
}