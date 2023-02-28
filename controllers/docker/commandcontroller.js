const { exec } = require("child_process");
const logs = require('../../models/logs');

async function logStorageAndDisplay(Msg, cmd, userName, res, containerLaunch, cmd_error) {
    var status;
    if (cmd_error) {
        cmd_status = Msg;
    }
    else {
        cmd_status = "successful";
    }

    const logData = new logs({
        "username": userName,
        "command": cmd,
        "status": cmd_status,
    });
    await logData.save();
    if (! containerLaunch) {
        var out = { "cmd": cmd, "op": Msg };
        var out1 = JSON.stringify(out);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(out1);
    }
}




const shCommand = function (cmd, userName, res) {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            logStorageAndDisplay(`${error.message}`, cmd, userName, res, false, true);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            logStorageAndDisplay(`${stderr}`, cmd, userName, res, false, true);
            return;
        }
        logStorageAndDisplay(`${stdout}`, cmd, userName, res, false, false);
    });

}


const shCommandRunCont = function (cmd, userName, req, res, urlPath, homePath) {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            logStorageAndDisplay(`${error.message}`, cmd, userName, res, true, true);
            res.render('./docker/containers', { "name": userName, "output": `${error.message}`, "cmd": cmd, "urlPath": urlPath, "homePath": homePath });
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            logStorageAndDisplay(`${stderr}`, cmd, userName, res, true, true);
            res.render('./docker/containers', { "name": userName, "output": `${stderr}`, "cmd": cmd, "urlPath": urlPath, "homePath": homePath });
            return;
        }
        logStorageAndDisplay(`${stdout}`, cmd, userName, res, true, false);
        urlPath = req.protocol + '://' + req.get('host') + '/docker/';
        finalOutput = "Container is launched with id " + `${stdout}`;
        res.render('./docker/containers', { "name": userName, "output": finalOutput, "cmd": cmd, "urlPath": urlPath, "homePath": homePath });
    });

}

module.exports = {
    shCommand,
    shCommandRunCont
}