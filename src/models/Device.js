import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
    },
    deviceName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min_length: 6,
    },
    timeOC: {
        type: Number,
        default: 0,
    },
    light:{
        type: Number,
        default: 0,
    },
    percent: {
        type: Number,
        default: 0,
        max: 100,
        min: 0,
    },
    isOpenTime:{
        type: Boolean,
        default: false,
    },
    OpenTime: {
        type: Object,
        required: false,
        default: null,
    },
    isCloseTime:{
        type: Boolean,
        default: false,
    },
    CloseTime: {
        type: Object,
        required: false,
        default: null,
    },
    autoMode: {
        type: Boolean,
        default: false,
    },
    cmd: {
        type: String,
        default: 'S',
    }
},{timestamps: true,})


// hash password before saving to database
deviceSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    }
);

//compare password with hashed password
deviceSchema.methods.comparePassword = async function(devicePassword) {
    return await bcrypt.compare(devicePassword, this.password);
}

const Device = mongoose.model('Device', deviceSchema);

export default Device;