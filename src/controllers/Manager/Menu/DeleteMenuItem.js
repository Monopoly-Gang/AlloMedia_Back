const MenuItem = require('../../../models/MenuItem');

async function DeleteItem(req, res, next) {
    try {
        const { id } = req.body; 

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
