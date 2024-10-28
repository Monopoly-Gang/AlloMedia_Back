const MenuItem = require('../../../models/MenuItem');

async function AllMenuItems(req, res, next) {
    const { id } = req.params;
    const menuItems = await MenuItem.find({restaurant:id});
    menuItems.forEach(element => {
        element.image = `${process.env.IMAGE_PATH}\\${element.image}`;
    });
    res.status(200).json(menuItems);
}

module.exports = AllMenuItems;