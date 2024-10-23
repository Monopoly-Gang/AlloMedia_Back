const MenuItem = require('../../../models/MenuItem');

async function AllMenuItems(req, res, next) {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
}

module.exports = AllMenuItems;