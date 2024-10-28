const MenuItem = require("../../../models/MenuItem");

async function GetMenuItemById(req, res) {
    const { id } = req.params; 
    try {
        const menuItem = await MenuItem.findById(id); 

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found." });
        }
        console.log(menuItem);
        

        menuItem.image = `${process.env.IMAGE_PATH}\\${menuItem.image}`; 
        res.status(200).json(menuItem);
    } catch (error) {
        console.error(error); 
    }
}

module.exports = GetMenuItemById;
