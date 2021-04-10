'use strict';

var mongoose = require('mongoose'),
  Application = mongoose.model('Applications'),
  Trip = mongoose.model('Trips');

//var authController = require('../controllers/authController');

//Get the average, the minimum, the maximum, and the standard deviation of the number of trips managed per manager.
exports.tripsManagedPerManager = async (req, res) => {
    try {
        const docs = await Trip.aggregate([
            {$match: {
                publish: true,
                canceled: false,
                end_date: {$gte: new Date()}
            }
            },
            {$group: {
                _id: "$manager_id",
                contador: {$sum: 1}
                }
            },
            {$facet: {
                "average": [
                    {$group: {
                    _id: "average-trips-managed-per-manager",
                    number_trips: {$sum: "$contador"},
                    number_managers: {$sum: 1}
                    }},
                    {$project: {
                        result: {$divide : ["$number_trips", "$number_managers"]}
                    }}
                ],
                "minimum": [
                    {$group: {
                        _id: "minimun-trips-managed-per-manager",
                        contador: {$min: "$contador"}
                    }}
                ],
                "maximun": [
                    {$group: {
                        _id: "maximun-trips-managed-per-manager",
                        contador: {$max: "$contador"}
                    }}
                ],
                "standard-deviation": [
                    {$group: {
                        _id: "standard-deviation-trips-managed-per-manager",
                        contador: {$stdDevSamp: "$contador"}
                    }}
                ]
            }}
        ]).exec();

        if (docs.length > 0) {
            return res.status(200).json(docs);
        } else {
            return res.sendStatus(404);
        }

    } catch (err) {
        res.status(500).json({ reason: "Database error" });
    }
};


//Get the average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
exports.applicationsPerTrip = async (req, res) => {
    try {
        const docs = await Application.aggregate([
            {$group: {
                _id: "$trip_id",
                contador: {$sum: 1}
                }
            },
            {$facet: {
                "average": [
                    {$group: {
                    _id: "average-application-per-trip",
                    number_applications: {$sum: "$contador"},
                    number_trips: {$sum: 1}
                    }},
                    {$project: {
                        result: {$divide : ["$number_trips", "$number_applications"]}
                    }}
                ],
                "minimum": [
                    {$group: {
                        _id: "minimun-application-per-trip",
                        contador: {$min: "$contador"}
                    }}
                ],
                "maximun": [
                    {$group: {
                        _id: "maximun-application-per-trip",
                        contador: {$max: "$contador"}
                    }}
                ],
                "standard-deviation": [
                    {$group: {
                        _id: "standard-deviation-application-per-trip",
                        contador: {$stdDevSamp: "$contador"}
                    }}
                ]
            }}
        ]).exec();

        if (docs.length > 0) {
            return res.status(200).json(docs);
        } else {
            return res.sendStatus(404);
        }

    } catch (err) {
        res.status(500).json({ reason: "Database error" });
    }
};

//Get the average, the minimum, the maximum, and the standard deviation of the price of the trips.
exports.pricePerTrips = async (req, res) => {
    try {
        const docs = await Trip.aggregate([
            {$facet: {
                "average": [
                    {$group: {
                    _id: "average-price-per-trip",
                    total_price: {$sum: "$price"},
                    number_trips: {$sum: 1}
                    }},
                    {$project: {
                        result: {$divide : ["$total_price", "$number_trips"]}
                    }}
                ],
                "minimum": [
                    {$group: {
                        _id: "minimun-price-per-trip",
                        contador: {$min: "$price"}
                    }}
                ],
                "maximun": [
                    {$group: {
                        _id: "maximun-price-per-trip",
                        contador: {$max: "$price"}
                    }}
                ],
                "standard-deviation": [
                    {$group: {
                        _id: "standard-deviation-price-per-trip",
                        contador: {$stdDevSamp: "$price"}
                    }}
                ]
            }}
        ]).exec();

        if (docs.length > 0) {
            return res.status(200).json(docs);
        } else {
            return res.sendStatus(404);
        }

    } catch (err) {
        res.status(500).json({ reason: "Database error" });
    }
};

//Get the ratio of applications grouped by status.
exports.applicationsByStatus = async (req, res) => {
    try {
        const docs = await Application.aggregate([
            {$facet: {
                "total": [
                    {$group: {
                        _id: "total",
                        contador: {$sum: 1}
                    }}
                ],
                "estados": [
                    {$group: {
                        _id: "$status",
                        contador: {$sum: 1}
                    }}
                ]
        }},
        {$project: {
          asd: { $arrayElemAt: ["$estados.contador", 1 ] }
        }}
        ]).exec();

        if (docs.length > 0) {
            return res.status(200).json(docs);
        } else {
            return res.sendStatus(404);
        }

    } catch (err) {
        res.status(500).json({ reason: "Database error" });
    }
};