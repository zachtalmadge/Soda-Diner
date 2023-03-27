module.exports = function(app) {

    const DinerController = require('./diner.controllers')

    app.route('/api/diner')
        .get(DinerController.findDiners)
        .post(DinerController.saveDiner)

    app.route('/api/diner/:id')
        .get(DinerController.findOneDiner)
        .delete(DinerController.deleteDiner)
        .put(DinerController.editDiner)

    app.route('/api/diner/:dinerID/:sodaID')
        .put(DinerController.addSodaToDiner)
        .delete(DinerController.deleteSodaFromDiner)
    
    app.route('/api/diner/:dinerID/sodas')
        .get(DinerController.findUnservedSodas)
}