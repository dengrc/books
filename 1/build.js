const fs = require('fs');
const {
    exec,
    execSync,
    spawn
} = require('child_process');

function travelOne(dir, callback) {
    dir += "/";
    callback(dir);
    //var ary, filetype, pathname;
    //fs.readdirSync(dir).forEach(function (file) {
    fs.readdir(dir, function (file, files) {
        if (files && files.length) {
            files.forEach(function (file, i) {
                var ary = file.split("."),
                    filetype = ary.pop(),
                    pathname = dir + file;

                if (fs.statSync(pathname).isDirectory()) {
                    travelOne(pathname, callback);
                } else {
                    //callback(pathname, dir, ary, filetype, file, i + 1 === files.length);
                }
            })
        }
    });
}

travelOne("./styl", function (dir) {
    var ls = exec(`stylus -w ${dir.replace('./styl', 'styl')} -o ${dir.replace('./styl', 'css')}`, (error,
        stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
})
