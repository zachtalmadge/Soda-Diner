module.exports = function(app) {
    
    const SodaController = require('./soda.controllers')

    app.route('/api/soda')
        .get(SodaController.findAllSodas)
        .post(SodaController.saveSoda)

    app.route('/api/soda/:id')
        .get(SodaController.findOneSoda)
        .delete(SodaController.deleteSoda)
        .put(SodaController.editSoda)
}


