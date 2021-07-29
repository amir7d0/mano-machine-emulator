const fs = require("fs");
const { exec } = require('child_process');

module.exports = {
    async runComputer(req, res) {
        try {
            const {inputFileText} = req.body;
            fs.writeFileSync("./core/input.txt", inputFileText);
            const cmd = `python3 ./core/app.py`;
            exec(cmd, (error, stdout, stderr) => {
                if(error) {
                    throw error
                }
                console.log(`stdout ${stdout}`);
                console.log(`stderr ${stderr}`);
                fs.readFile('./core/data.json', (err, data) => {
                    if (err) {
                        throw err;
                    }
                    let jsonData = JSON.parse(data);
                    // res.end(JSON.stringify({
                    //     input: inputFileText,
                    //     output: jsonData
                    // }).replace(/#/gi, ""));
                    res.status(201).json({
                        input: inputFileText,
                        output: JSON.parse(JSON.stringify(jsonData).replace(/#/gi, ""))
                    })
                });
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: "error",
                message: e.message
            })
        }
    }

}