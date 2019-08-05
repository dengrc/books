const fs = require('fs');
const readline = require('readline');
const {
	exec
} = require('child_process');
const dirPath = "./styl"
console.log(`\n\n末尾\t"/" 表示只跳转目录\n\t".0"表示不递归子目录\n\t".1"表示递归子目录\n`);
function question(dirPath) {
    //let rl;
    fs.readdir(dirPath, function (err, ary) {
        if (err) throw err;
        const dirs = ary.filter(function (pathname) {
            return fs.statSync(dirPath + "/" + pathname).isDirectory()
        });
        dirs.unshift("");

        //创建readline接口实例
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const list = dirs.map(function (filename, i) {
            return filename ? `${i}:${filename}` : "0:./"
        }).join('\n');
        console.log(`当前路径 ${dirPath}`);
        // question方法
        rl.question(`\n选择一个或输入目录:\n${list}\n\n输入数字 /^\d+(\/|\.[01])?$/ 或路径 /path(/path)*(\/|\.[01])?/ :`, function (answer) {
            answer = answer.trim();
            if (answer.length === 0) {
                rl.close();
                question(dirPath);
                return;
            }

            const [path, recursive] = answer.split('.');
            const [index,] = path.split('/')
            let nav = index.length !== path.length;
            let filename = "";

            if (/^\d+(\/|\.[01])?$/.test(answer)) {
                filename = dirs[index]
            } else if (fs.statSync(`${dirPath}/${index}`).isDirectory()) {
                filename = index;
            } else {
                nav = true;
            }

            if (nav) {
                rl.close();
                question(`${dirPath}/${filename}`);
                return
            }

            if (typeof filename === "string") {
                console.log();
                buildStylus(`${dirPath}/${filename}`, recursive != 0)
                rl.close();
            }
        })
    })
}

question(dirPath)

function travelOne(dir, callback, recursive) {
    dir += "/";
    callback(dir);

    fs.readdir(dir, function (file, files) {
        if (files && files.length) {
            files.forEach(function (file, i) {
                const pathname = dir + file;

                if (recursive && fs.statSync(pathname).isDirectory()) {
                    travelOne(pathname, callback, recursive);
                }
            })
        }
    });
}

function buildStylus(startPath, recursive) {
    travelOne(startPath, function (dir) {
        console.log(`child_process ${new Array(30).join('-')} ${dir}`);
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
    }, recursive)
}
