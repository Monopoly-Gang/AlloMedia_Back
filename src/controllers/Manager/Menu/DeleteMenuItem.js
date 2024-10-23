const MenuItem = require('../../../models/MenuItem');
const { DeleteMenuItemValidationSchema } = require('../../../services/Menu/Validation');

async function DeleteItem(req, res, next) {
    try {
        const { id } = req.body; 

        const { error } = DeleteMenuItemValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const deletedItem = await MenuItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = DeleteItem;
