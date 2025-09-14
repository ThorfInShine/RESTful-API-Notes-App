const { exec, spawn } = require('child_process');

// Configuration
const CONFIG = {
    IMAGE_NAME: 'ghcr.io/thorfinshine/restful-api-notes-app:latest',
    CONTAINER_NAME: 'notes-app',
    PORT: '8080:80'
};

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
    return new Promise((resolve, reject) => {
        log(`🔄 ${description}...`, 'yellow');
        
        const isWindows = process.platform === 'win32';
        const shell = isWindows ? 'cmd' : 'sh';
        const shellFlag = isWindows ? '/c' : '-c';
        
        const child = spawn(shell, [shellFlag, command], {
            stdio: ['inherit', 'pipe', 'pipe']
        });
        
        let stdout = '';
        let stderr = '';
        
        child.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            if (description.includes('Pulling') || description.includes('Starting')) {
                process.stdout.write(output);
            }
        });
        
        child.stderr.on('data', (data) => {
            const output = data.toString();
            stderr += output;
            if (!output.includes('WARNING') && !output.includes('WARN')) {
                process.stderr.write(output);
            }
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                log(`✅ ${description} completed`, 'green');
                resolve(stdout);
            } else {
                log(`❌ ${description} failed (exit code: ${code})`, 'red');
                reject(new Error(`Command failed: ${command}`));
            }
        });
        
        child.on('error', (error) => {
            log(`❌ ${description} failed: ${error.message}`, 'red');
            reject(error);
        });
    });
}

async function checkDocker() {
    try {
        await runCommand('docker info', 'Checking Docker status');
        return true;
    } catch (error) {
        log('❌ Docker is not running. Please start Docker Desktop first.', 'red');
        return false;
    }
}

async function loginToRegistry() {
    try {
        log('🔐 Checking GitHub Container Registry access...', 'yellow');
        // Try to pull without login first
        const result = await runCommand(`docker manifest inspect ${CONFIG.IMAGE_NAME}`, 'Checking image availability')
            .catch(() => {
                log('⚠️  Image not accessible. You may need to login to GitHub Container Registry.', 'yellow');
                log('💡 Run: docker login ghcr.io', 'cyan');
                return null;
            });
        return true;
    } catch (error) {
        log('⚠️  Registry access check failed', 'yellow');
        return true; // Continue anyway
    }
}

async function pullLatestImage() {
    try {
        log('📥 This may take a few minutes...', 'cyan');
        await runCommand(`docker pull ${CONFIG.IMAGE_NAME}`, 'Pulling latest image from registry');
        return true;
    } catch (error) {
        log('❌ Failed to pull latest image from registry.', 'red');
        log('💡 Make sure you are logged in: docker login ghcr.io', 'cyan');
        return false;
    }
}

async function stopAndRemoveContainer() {
    try {
        try {
            await runCommand(`docker stop ${CONFIG.CONTAINER_NAME}`, 'Stopping existing container');
        } catch (e) {
            log('Container was not running', 'yellow');
        }
        
        try {
            await runCommand(`docker rm ${CONFIG.CONTAINER_NAME}`, 'Removing existing container');
        } catch (e) {
            log('Container did not exist', 'yellow');
        }
        
        return true;
    } catch (error) {
        log('⚠️  Some cleanup operations failed, continuing...', 'yellow');
        return true;
    }
}

async function startNewContainer() {
    const command = `docker run -d --name ${CONFIG.CONTAINER_NAME} --restart unless-stopped -p ${CONFIG.PORT} ${CONFIG.IMAGE_NAME}`;
    
    try {
        const containerId = await runCommand(command, 'Starting new container');
        log(`📦 Container ID: ${containerId.trim().substring(0, 12)}`, 'cyan');
        return true;
    } catch (error) {
        log('❌ Failed to start new container', 'red');
        return false;
    }
}

async function cleanup() {
    try {
        await runCommand('docker image prune -f', 'Cleaning up old images');
        return true;
    } catch (error) {
        log('⚠️  Cleanup failed, but container is running', 'yellow');
        return true;
    }
}

async function showStatus() {
    try {
        log('\n📊 Final Status:', 'blue');
        await runCommand(`docker ps --filter "name=${CONFIG.CONTAINER_NAME}" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"`, 'Getting container status');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        log('\n🔍 Testing application...', 'yellow');
        try {
            await runCommand('curl -f http://localhost:8080 || echo "App starting up..."', 'Testing connection');
        } catch (e) {
            log('⏳ Application is starting up...', 'yellow');
        }
        
    } catch (error) {
        log('Could not get container status', 'yellow');
    }
}

async function main() {
    console.clear();
    log('🚀 Notes App Docker Update Script', 'blue');
    log('=====================================', 'blue');
    log(`📦 Registry Image: ${CONFIG.IMAGE_NAME}`, 'cyan');
    log(`🐳 Container: ${CONFIG.CONTAINER_NAME}`, 'cyan');
    log(`🌐 Port: http://localhost:8080`, 'cyan');
    log('=====================================\n', 'blue');
    
    try {
        if (!(await checkDocker())) {
            process.exit(1);
        }
        
        await loginToRegistry();
        
        if (!(await pullLatestImage())) {
            process.exit(1);
        }
        
        await stopAndRemoveContainer();
        
        if (!(await startNewContainer())) {
            process.exit(1);
        }
        
        await cleanup();
        await showStatus();
        
        log('\n🎉 Docker update completed successfully!', 'green');
        log('🌐 Application available at: http://localhost:8080', 'green');
        log('📝 View logs: npm run docker:logs', 'cyan');
        log('🛑 Stop container: npm run docker:stop', 'cyan');
        
    } catch (error) {
        log(`\n❌ Update failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Handle script arguments
const arg = process.argv[2];

switch (arg) {
    case 'help':
        log('Usage:', 'blue');
        log('  npm run docker:update           - Update from registry');
        log('  npm run docker:auto             - Start with auto-update');
        log('  npm run docker:logs             - View container logs');
        log('  npm run docker:stop             - Stop container');
        log('  npm run docker:status           - Show container status');
        break;
    
    default:
        main();
        break;
}