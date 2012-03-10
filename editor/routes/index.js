exports.app = function(req, res) {
    res.render('index', { title: 'Mobile Web App' });
};

exports.projects = function (req, res) {
    var fs = require('fs');
    var listProjects = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) {
                done(err);
                return;
            }
            var pending = list.length;
            if (!pending) {
                done(null, results);
                return;
            }
            list.forEach(function(file) {
                var path = dir + '/' + file;
                fs.stat(path, function(err, stat) {
                    pending -= 1;
                    if (stat && stat.isDirectory()) {
                        results.push({
                            name: file
                        });
                        if (!pending) {
                            done(null, results);
                            return;
                        }
                    }
                });
            });
        });
    };

    var projectsPath = __dirname + '/../public/projects';
    listProjects(projectsPath, function(err, results) {
        if (err) {
            throw err;
        }
        var output = {
            success: true,
            projects: results
        };
        var body = JSON.stringify(output);
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(body);
    });
};

exports.project = function(req, res) {

    var fs = require('fs');
    var walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) {
                done(err);
                return;
            }
            var pending = list.length;
            if (!pending) {
                done(null, results);
                return;
            }
            list.forEach(function(file) {
                var path = dir + '/' + file;
                fs.stat(path, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(path, function(err, res) {
                            results.push({
                                text: file,
                                description: path,
                                leaf: false,
                                children: res
                            });
                            pending -= 1;
                            if (!pending) {
                                done(null, results);
                                return;
                            }
                        });
                    } else {
                        results.push({
                            text: file,
                            description: path,
                            leaf: true
                        });
                        pending -= 1;
                        if (!pending) {
                            done(null, results);
                            return;
                        }
                    }
                });
            });
        });
    };

    var projectName = req.query['projectName'];
    var selectedProjectPath = __dirname + '/../public/projects/' + projectName;
    walk(selectedProjectPath, function(err, results) {
        if (err) {
            results = [];
        }
        var output = {
            text: projectName,
            expanded: true,
            children: results
        };
        var body = JSON.stringify(output);
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(body);
    });
};

exports.file = function (req, res) {

    // Taken from
    // http://stackoverflow.com/questions/280634/endswith-in-javascript
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    var filename = req.query['filename'];
    var fs = require('fs');
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end();
        }
        else {
            if (filename.endsWith('js')) {
                res.writeHead(200, {
                    "Content-Type": "application/javascript",
                    "Access-Control-Allow-Origin": "*"
                });
            }
            res.end(data);
        }
    });
};

exports.updatefile = function (req, res) {
    var filename = req.body.filename;
    var data = req.body.data;
    var fs = require('fs');
    fs.writeFile(filename, data, function (err) {
        res.end(data);
    });
};

exports.ipaddress = function (req, res) {
    // Adapted from
    // http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
    var getNetworkIPs = (function () {
        var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

        var exec = require('child_process').exec;
        var cached;
        var command;
        var filterRE;

        switch (process.platform) {
            case 'win32':
                //case 'win64': // TODO: test
                command = 'ipconfig';
            filterRE = /\bIP-[^:\r\n]+:\s*([^\s]+)/g;
            // TODO: find IPv6 RegEx
            break;
            case 'darwin':
                command = 'ifconfig';
            filterRE = /\binet\s+([^\s]+)/g;
            // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
            break;
            default:
                command = 'ifconfig';
            filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
            // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
            break;
        }

        return function (callback, bypassCache) {
            if (cached && !bypassCache) {
                callback(null, cached);
                return;
            }
            // system call
            exec(command, function (error, stdout, sterr) {
                cached = [];
                var ip;
                var matches = stdout.match(filterRE) || [];
                //if (!error) {
                for (var i = 0; i < matches.length; i++) {
                    ip = matches[i].replace(filterRE, '$1');
                    if (!ignoreRE.test(ip)) {
                        cached.push(ip);
                    }
                }
                //}
                callback(error, cached);
            });
        };
    })();

    getNetworkIPs(function (error, ip) {
        if (error) {
            console.log('error:', error);
        }
        var body = JSON.stringify(ip);
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(body);
    }, false);
};

