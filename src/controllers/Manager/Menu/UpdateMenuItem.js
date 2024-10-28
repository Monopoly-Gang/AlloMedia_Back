const MenuItem = require('../../../models/MenuItem');
const ValidateMenu = require('../../../services/Menu/Validation');

async function UpdateMenuItem(req, res, next) {
    try {

        const { error } = ValidateMenu.UpdatemenuItemValidationSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const { _id , name, description, price} = req.body;
        const updateData = { name, description, price };
        
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(_id, updateData, { new: true });
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: "Item updated successfully", menuItem: updatedItem });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}


module.exports = UpdateMenuItem;
