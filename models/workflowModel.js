const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    nodes:[],
    edges:[],
    flow:[]
})

module.exports  = mongoose.model("Workflow",workflowSchema);