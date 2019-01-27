const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');

/**
 * 根据 env 以及目录下的 version.json 加载不同的版本：
 *
 * 如假设某目录下有：
 * ├── list.js
 * ├── list.2.js
 * ├── list.3.js
 * └── version.json
 *
 * version.json 内容如：
 * ```
 * {
 *   "list.js": {
 *     "version": "2",      // 指定版本号
 *     "env": "APP"   // 环境变量的变量名
 *   }
 * }
 * ```
 */
module.exports = function(content) {

    // 不处理node_modules里的文件
    if (this.resourcePath.includes('node_modules')) {
        return content;
    }

    // 读取目录下的 version.json 文件
    let versionFile = path.join(this.context, 'version.json');
    let versionJson;

    if (!fs.existsSync(versionFile)) {
        return content;
    }

    versionJson = JSON.parse(fs.readFileSync(versionFile));
    // version.json 是否有相关配置
    let fileName = getLastItem(this.resourcePath);
    if (!versionJson[fileName]) {
        return content;
    }

    // 获取版本号：env > version.json[filename][version]
    let env = versionJson[fileName].env;
    let version = process.env[env] || versionJson[fileName].version;
    if (!version || version === '1') {
        // 默认版本是1
        return content;
    }

    // file.js => file.1.js
    let target = fileName.replace(/(.*)\.([^\.]*)$/, '$1.' + version + '.$2');
    let targetPath = path.join(this.context, target);

    targetPath = loaderUtils.stringifyRequest(this, targetPath);

    return 'module.exports = require(' + targetPath + ');';
};

// ./module/xxx => xxx
function getLastItem(context) {
    let paths = context.split(path.sep);
    return paths[paths.length - 1];
}