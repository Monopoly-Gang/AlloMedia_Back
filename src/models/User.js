const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true, minlength: 3},
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
            },
            message: props => `Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number`
        }
    },
    role: {type: String, enum: ['client', 'livreur', 'gestionnaire', 'super_admin'], required: true, default: 'client'},
    address: {type: String, required: [true, 'Address is required']},
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\+\d{1,3}\d{4,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    loginHistory: {
        history: [{
            fingerprint: String,
            location: String,
        }],
        lastLogin: {
            type: Date,
            default: Date.now
        },
    }
}, {timestamps: true});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
