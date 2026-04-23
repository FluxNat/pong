const fs = require('fs');
const path = require('path');

const targetStr = "FluxNat";
const replacementStr = "FluxNat";

const directoriesToScan = ['src', 'server', 'public', '.', 'test', 'docker', 'extra', 'db', '.github', '.github/workflows'];
const extensionsToReplace = ['.js', '.ts', '.vue', '.html', '.json', '.md', '.yaml', '.yml', '.go', '.sh', '.mjs', '.dockerfile', '.sql', '.ps1'];
const specificFilesToReplace = ['Dockerfile', 'compose.yaml', 'package.json'];

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
            if (extensionsToReplace.includes(ext) || specificFilesToReplace.includes(file)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                const regex = new RegExp(targetStr, 'ig');
                if (regex.test(content)) {
                    // Replace all occurrences
                    content = content.replace(regex, replacementStr);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Replaced in ${fullPath}`);
                }
            }
        }
    }
}

// Ensure we only scan the root level files for '.'
function processRoot() {
    const dir = '.';
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (!fs.existsSync(fullPath)) continue;
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            const ext = path.extname(file);
            if (extensionsToReplace.includes(ext) || specificFilesToReplace.includes(file)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                const regex = new RegExp(targetStr, 'ig');
                if (regex.test(content)) {
                    content = content.replace(regex, replacementStr);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Replaced in ${fullPath}`);
                }
            }
        }
    }
}

directoriesToScan.forEach(dir => {
    if (dir === '.') {
        processRoot();
    } else {
        walkAndReplace(dir);
    }
});
console.log("Done");
