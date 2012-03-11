var setCurrentProject = function setCurrentProject(projectName, done) {
    var projectsPath = __dirname + '/../public/projects/';
    var selectedProjectPath = projectsPath + projectName;
    var symlinkPath = projectsPath + 'current';
    var fs = require('fs');
    fs.unlink(symlinkPath, function (err) {
        fs.symlink(selectedProjectPath, symlinkPath, 'dir', function (err) {
            done(err);
        });
    });    
};

exports.start = function(req, res) {
    // This regex comes from 
    // http://detectmobilebrowsers.com/
    var ua = req.headers['user-agent'].toLowerCase();
    if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
        res.redirect('/projects/current');
    }
    else {
        var local = (req.connection.remoteAddress === '127.0.0.1');
        if (local) {
            setTimeout(function () {
                // Somehow, during app startup you can't create the
                // symlink to the current project, so we do it half a
                // second later. Boom.
                setCurrentProject('default', function(err) {});
            }, 500);
        }
        res.redirect('/client');
    }
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
                if (file !== 'default' && file !== 'current') {
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
                }
            });
        });
    };

    var projectName = req.query['projectName'];

    // Create a symlink to the project currently open
    setCurrentProject(projectName, function(err) {});

    var projectsPath = __dirname + '/../public/projects/';
    var selectedProjectPath = projectsPath + projectName;
    var symlinkPath = projectsPath + 'current';
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

exports.islocalrequest = function (req, res) {
    var local = (req.connection.remoteAddress === '127.0.0.1');
    var obj = {
        local: local
    };
    var body = JSON.stringify(obj);
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(body);
};

