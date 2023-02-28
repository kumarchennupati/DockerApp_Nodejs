
function containerList(path, choice, state) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("state=" + state);
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
    }

}


function stopContainer(path, choice) {
    var contName = prompt("Enter the Container image name/ID to be stopped");
    if (contName != null) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("name=" + contName);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}



function startContainer(path, choice) {
    var contName = prompt("Enter the Container image name/ID to be started");
    if (contName != null) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("name=" + contName);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}



function imageList(path, choice) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.send();
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
    }

}



function pullImage(path, choice) {
    var imgName = prompt("Enter the full image name with tag(optional) to be pulled with syntax as 'ImageName:Tag'");
    if (imgName != null) {
        document.getElementById("txtBox").innerHTML = '';
        document.getElementById("injected").innerHTML = "Just need some time to pull the image, please have patience....";
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("name=" + imgName);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}


function createImage(path, choice) {
    var contName = document.getElementById('contname').value;
    var imgName = document.getElementById('imgname').value;
    var tag = document.getElementById('tag').value;
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("contname=" + contName + "&name=" + imgName + "&tag=" + tag);
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
        document.getElementById('contname').value = '';
        document.getElementById('imgname').value = '';
        document.getElementById('tag').value = '';
    }

}


function networkList(path, choice) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.send();
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
    }

}



function createNetwork(path, choice) {
    var netName = document.getElementById('netname').value;
    var driver = document.getElementById('driver').value;
    var subnet = document.getElementById('subnet').value;
    var gateway = document.getElementById('gateway').value;
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + netName + "&driver=" + driver + "&subnet=" + subnet + "&gateway=" + gateway);
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
        document.getElementById('netname').value = '';
        document.getElementById('driver').value = '';
        document.getElementById('subnet').value = '';
        document.getElementById('gateway').value = '';
    }

}



function connectNetwork(path, choice) {
    var networkName = document.getElementById('networkname').value;
    var contName = document.getElementById('contname').value;
    var specificip = document.getElementById('specificip').value;
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + networkName + "&contname=" + contName + "&specificip=" + specificip);
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
        document.getElementById('networkname').value = '';
        document.getElementById('contname').value = '';
        document.getElementById('specificip').value = '';
    }

}



function detachNetwork(path, choice) {
    var networkName = document.getElementById('detnetname').value;
    var contName = document.getElementById('detcontname').value;
    xhr = new XMLHttpRequest();
    xhr.open('POST', path + choice, 'true');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + networkName + "&contname=" + contName);
    xhr.onload = function () {
        const output1 = xhr.responseText;
        var output = JSON.parse(output1);
        document.getElementById("txtBox").innerHTML = output.cmd;
        document.getElementById("injected").innerHTML = output.op;
        document.getElementById('networkname').value = '';
        document.getElementById('contname').value = '';
        document.getElementById('specificip').value = '';
    }

}



function resourceDelete(path, choice, resource, state) {
    var contName = prompt("Enter the Resource Full_Name with tag / ID to be deleted");
    if (contName != null) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("state=" + state + "&resource=" + resource + "&name=" + contName);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}


function allResourceDelete(path, choice, resource) {
    decision = confirm("Are you sure, you want to 'delete' all the " + resource + "s");
    if (decision == true) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("resource=" + resource);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}



function pruneResource(path, choice) {
    var resource = document.getElementById("resourcetype").value;
    decision = confirm("Are you sure, you want to 'prune' all the unattached " + resource + "s");
    if (decision == true) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', path + choice, 'true');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("resource=" + resource);
        xhr.onload = function () {
            const output1 = xhr.responseText;
            var output = JSON.parse(output1);
            document.getElementById("txtBox").innerHTML = output.cmd;
            document.getElementById("injected").innerHTML = output.op;
        }
    }
}

