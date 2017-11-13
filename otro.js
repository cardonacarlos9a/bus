function noHanReclamado(fechaAComparar) {
    var inputDate = new Date(fechaAComparar.toISOString());

    entregaTiquetes.find({
        
    fechaEntrega: {
        
            "$match": {
                "$and": [{
                    "fechaEntrega": {
                        "$gte": {
                            "$date": ISODate("2016-11-03T12:18:48.477Z")
                        }
                    }
                }, {
                    "fechaEntrega": {
                        "$lt": {
                            "$date": ISODate(fechaAComparar))
                        }
                    }
                }]
            }
        },
    })
};