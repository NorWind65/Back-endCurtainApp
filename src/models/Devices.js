import mongoose from 'mongoose';

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
    },
    cmd: {
        type: String,
        default: 'stop',
    },
})

const Device = mongoose.model('Device', deviceSchema);

export default Device;