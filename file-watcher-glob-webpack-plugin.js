const watch = require('watch');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const defaultPattern = '**/*.art';
function FileWatcherPlugin(options) {
    this.options = options;
    this.monitor = null;
}

FileWatcherPlugin.prototype.apply = function (compiler) {
    compiler.plugin('watch-run', (compilation, callback) => {
        const root = this.options.root;
        const liveReload = this.options.liveReload;
        const options = this.options.options || {};
        const onChange = (f) => {
            console.log('\n');
            console.log(chalk.magenta(f + ' is changed!!'));
            if (liveReload) {
                liveReload.lastHash = null; // Force livereload to refresh
            }
            compiler.run((err) => {
                console.log(chalk.magenta('webpack compiler rebuild'));
                if (err) {
                    throw err;
                }
            });
        };

        watch.createMonitor(root, {
            ignoreDotFiles: options.ignoreDotFiles || true,
            interval: options.interval || 1
        }, (monitor) => {
            // console.log('===================================');
            glob(options.pattern || defaultPattern, {
                cwd: root
            }, (err, files) => {
                files.forEach((file) => {

                    const filePath = path.join(root, file);
                    // console.log(filePath);
                    monitor.files[filePath];
                });
            });
            // console.log('===================================');
            // /Users/sharon/Work/workspace/ks/kfe-www/frontend/intl
            monitor.on('created', onChange);
            monitor.on('changed', onChange);
            monitor.on('removed', onChange);

            console.log('Monitoring file changes\n');
            callback();
        });
    });
};

module.exports = FileWatcherPlugin;
