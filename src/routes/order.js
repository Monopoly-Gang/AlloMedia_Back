const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');
const tokenValidator = require('../middleware/tokenValidator');

// Routes pour les commandes
router.post('/', 
    tokenValidator.validateToken,
    auth(['client']),
    OrderController.createOrder
);

router.post('/:orderId/manager-accept',
    tokenValidator.validateToken,
    auth(['gestionnaire']),
    OrderController.managerAcceptOrder
);

router.post('/:orderId/driver-accept',
    tokenValidator.validateToken,
    auth(['livreur']),
    OrderController.driverAcceptOrder
);

router.post('/:orderId/start-delivery',
    tokenValidator.validateToken,
    auth(['livreur']),
    OrderController.startDelivery
);

router.post('/:orderId/complete-delivery',
    tokenValidator.validateToken,
    auth(['livreur']),
    OrderController.completeDelivery
);

router.post('/:orderId/cancel',
    tokenValidator.validateToken,
    auth(['client', 'gestionnaire', 'livreur']),
    OrderController.cancelOrder
);

router.get('/:orderId',
    tokenValidator.validateToken,
    auth(['client', 'gestionnaire', 'livreur']),
    OrderController.getOrderDetails
);

module.exports = router;
