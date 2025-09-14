// Configuration
const CONFIG = {
    IMAGE_NAME: 'notes-app:latest', // Gunakan image lokal dulu
    CONTAINER_NAME: 'notes-app',
    PORT: '8080:80',
    DOCKERFILE: 'Dockerfile'
};

// Tambahkan fungsi build
async function buildImage() {
    try {
        log('🏗️  Building Docker image locally...', 'yellow');
        await runCommand('npm run build', 'Building application');
        await runCommand(`docker build -t ${CONFIG.IMAGE_NAME} .`, 'Building Docker image');
        return true;
    } catch (error) {
        log('❌ Failed to build image', 'red');
        return false;
    }
}

// Update fungsi main
async function main() {
    console.clear();
    log('🚀 Notes App Docker Update Script', 'blue');
    log('=====================================', 'blue');
    
    try {
        if (!(await checkDocker())) {
            process.exit(1);
        }
        
        await checkCurrentContainer();
        
        // Build image locally instead of pulling
        if (!(await buildImage())) {
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
        
    } catch (error) {
        log(`\n❌ Update failed: ${error.message}`, 'red');
        process.exit(1);
    }
}