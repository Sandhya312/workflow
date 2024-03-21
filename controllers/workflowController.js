const Workflow = require('../models/workflowModel');
const csvtojson = require('csvtojson');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const directory = '../workflow-backend/uploads';
let jsonData = {};



// Convert Format:
const convertToJSON = async (fileId) => {
    await csvtojson().fromFile(fileId)
        .then((jsonObj) => {
            jsonData = jsonObj;
        })
        .catch((err) => {
            console.log(err.message);
        })

    return new Promise((resolve, reject) => {
        if (jsonData.length !== 0) {
            resolve(jsonData);
        } else {
            reject("json data is not saved");
        }
    })

}

//Wait
const wait = () => {
    return new Promise(resolve => setTimeout(() => resolve("thanks for waiting 60 sec"), 60000));
}


//Filter Data
const filterData = (obj) => {

    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        } else if (typeof obj[key] === 'object') {
            filterData(obj[key]); // Recursively apply to nested objects
        }
    }


    return new Promise((resolve, reject) => {
        if (obj) {
            resolve(obj);
        } else {
            reject("obj is not defined");
        }
    })
}

// Send POST Request:
const postReq = (data) => {
    axios.post('https://sandhya.requestcatcher.com/', data)
        .then(response => {
            console.log({ "response": response.data });
        })
        .catch((err) => {
            console.error("error", error);
        })
}




const saveWorkflow = async (req, res) => {
    try {
        const { nodes, edges } = req.body;

        let steps = [];
        let i = 0;
        for (let node of edges) {
            console.log("nodes", node);
            if (steps[i] !== node.source) {
                steps.push(node.source);

            }

            if (steps[i] !== node.target) {
                steps.push(node.target);
            }
            i++;

        }

        if (steps !== undefined) {
            console.log(steps);
        }

        steps = steps.map((item) => {
            console.log("item", item, item.typeof);
            for (let node of nodes) {
                if (item === node.id) {
                    return node.name; // Return the updated value
                }
            }

        });

        if (steps !== undefined) {
            console.log(steps);
        }

        const workflowInstance = await Workflow.create({
            nodes,
            edges,
            flow: steps
        })

        workflowInstance.save();



        res.send(workflowInstance);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "internal server error" });
    }
}



const executionFlow = async (req, res) => {
    try {
        const { workflowId } = req.body;
        const file = req.file;
        const workflowInstance = await Workflow.findById(workflowId);

        if (!workflowInstance) {
            res.send("workflow is not found");
        }
        const flow = workflowInstance.flow;
        console.log("file", file.originalname);
        convertToJSON(`${directory}/${file.originalname}`).then((data) => {
            filterData(data).then((toLowerCaseData) => {
                wait().then((res) => {
                    console.log(res);
                    console.log({ "lowercase": toLowerCaseData });
                    postReq(toLowerCaseData);
                })

            })

        })

        setTimeout(() => {
            try {
                fs.readdir(directory, (err, files) => {
                    if (err) {
                        console.error('Error accessing directory:', err);
                        return;
                    }

                    files.forEach(file => {
                        fs.unlink(path.join(directory, file), err => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.log(`Deleted file: ${file}`);
                            }
                        });
                    });
                });
            }
            catch (err) {
                console.log(err.message)
            }
        }, 1000 * 60 * 60 * 24);

        res.send(flow);

    }
    catch (error) {
        console.log("error", error);

        res.status(500).json({ error: "internal server error" });
    }
}


module.exports = {
    saveWorkflow,
    executionFlow
}