const fs = require('fs');
const path = require('path');

const replacements = [
    { target: "FluxNat", replacement: "FluxNat" },
    { target: "pong", replacement: "pong" },
    { target: "FluxNat", replacement: "FluxNat" }
];

const directoriesToScan = ['src', 'server', 'public', '.', 'test', 'docker', 'extra', 'db', '.github'];
const extensionsToReplace = ['.js', '.ts', '.vue', '.html', '.json', '.md', '.yaml', '.yml', '.go', '.sh', '.mjs', '.dockerfile', '.sql', '.ps1'];
const specificFilesToReplace = ['Dockerfile', 'compose.yaml', 'package.json', 'dockerfile'];

function walkAndReplace(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'data' || file === 'package-lock.json') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkAndReplace(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            const fileName = path.basename(file).toLowerCase();
            if (extensionsToReplace.includes(ext) || specificFilesToReplace.includes(fileName)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let changed = false;
                for (const r of replacements) {
                    const regex = new RegExp(r.target, 'ig');
                    if (regex.test(content)) {
                        content = content.replace(regex, r.replacement);
                        changed = true;
                    }
                }
                if (changed) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Replaced in ${fullPath}`);
                }
            }
        }
    }
}

directoriesToScan.forEach(dir => {
    if (dir === '.') {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (!fs.existsSync(fullPath)) continue;
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                const ext = path.extname(file);
                const fileName = path.basename(file).toLowerCase();
                if (extensionsToReplace.includes(ext) || specificFilesToReplace.includes(fileName)) {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let changed = false;
                    for (const r of replacements) {
                        const regex = new RegExp(r.target, 'ig');
                        if (regex.test(content)) {
                            content = content.replace(regex, r.replacement);
                            changed = true;
                        }
                    }
                    if (changed) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log(`Replaced in ${fullPath}`);
                    }
                }
            }
        }
    } else {
        walkAndReplace(dir);
    }
});
console.log("Done");
