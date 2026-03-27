const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Script de Conversion d'Images en WebP - Sky Experience
 * 
 * Convertit automatiquement PNG, JPG, JPEG vers WebP
 * avec optimisation de qualité et backup optionnel
 */

// Configuration
const CONFIG = {
    inputDir: path.join(__dirname, '../public/images'),
    outputDir: path.join(__dirname, '../public/images'),
    backupDir: path.join(__dirname, '../public/images-backup'),
    quality: 80, // Qualité WebP (0-100)
    dryRun: false, // Simulation sans conversion
    createBackup: true,
    extensions: ['.png', '.jpg', '.jpeg'],
    skipExisting: true, // Skip si .webp existe déjà
};

// Statistiques
const stats = {
    total: 0,
    converted: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    webpSize: 0
};

/**
 * Parse les arguments de ligne de commande
 */
function parseArgs() {
    const args = process.argv.slice(2);
    args.forEach(arg => {
        if (arg.startsWith('--quality=')) {
            CONFIG.quality = parseInt(arg.split('=')[1]);
        } else if (arg === '--dry-run') {
            CONFIG.dryRun = true;
        } else if (arg === '--no-backup') {
            CONFIG.createBackup = false;
        } else if (arg === '--force') {
            CONFIG.skipExisting = false;
        }
    });
}

/**
 * Créer le dossier de backup
 */
function createBackupDir() {
    if (CONFIG.createBackup && !CONFIG.dryRun) {
        if (!fs.existsSync(CONFIG.backupDir)) {
            fs.mkdirSync(CONFIG.backupDir, { recursive: true });
            console.log(`📁 Backup directory created: ${CONFIG.backupDir}`);
        }
    }
}

/**
 * Obtenir la taille d'un fichier en Ko
 */
function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
}

/**
 * Convertir une image en WebP
 */
async function convertToWebP(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    
    if (!CONFIG.extensions.includes(ext)) {
        return null;
    }

    const fileName = path.basename(imagePath, ext);
    const outputPath = path.join(CONFIG.outputDir, `${fileName}.webp`);
    
    // Skip si le fichier existe déjà
    if (CONFIG.skipExisting && fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipped: ${fileName}${ext} (WebP already exists)`);
        stats.skipped++;
        return null;
    }

    try {
        const originalSize = getFileSize(imagePath);
        stats.originalSize += parseFloat(originalSize);

        if (CONFIG.dryRun) {
            console.log(`🔍 [DRY RUN] Would convert: ${fileName}${ext} (${originalSize} KB)`);
            stats.converted++;
            return null;
        }

        // Backup original
        if (CONFIG.createBackup) {
            const backupPath = path.join(CONFIG.backupDir, path.basename(imagePath));
            fs.copyFileSync(imagePath, backupPath);
        }

        // Conversion avec Sharp
        await sharp(imagePath)
            .webp({ quality: CONFIG.quality })
            .toFile(outputPath);

        const webpSize = getFileSize(outputPath);
        stats.webpSize += parseFloat(webpSize);

        const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${fileName}${ext} → ${fileName}.webp`);
        console.log(`   Original: ${originalSize} KB | WebP: ${webpSize} KB | Saved: ${reduction}%`);
        
        stats.converted++;
        return outputPath;

    } catch (error) {
        console.error(`❌ Error converting ${imagePath}:`, error.message);
        stats.errors++;
        return null;
    }
}

/**
 * Scanner et convertir tous les fichiers
 */
async function convertAllImages() {
    console.log('\n🎨 Sky Experience - Image to WebP Converter\n');
    console.log(`📂 Input Directory: ${CONFIG.inputDir}`);
    console.log(`⚙️  Quality: ${CONFIG.quality}`);
    console.log(`💾 Backup: ${CONFIG.createBackup ? 'Yes' : 'No'}`);
    console.log(`🔍 Dry Run: ${CONFIG.dryRun ? 'Yes' : 'No'}\n`);
    console.log('─'.repeat(60));

    if (!fs.existsSync(CONFIG.inputDir)) {
        console.error(`❌ Input directory not found: ${CONFIG.inputDir}`);
        process.exit(1);
    }

    createBackupDir();

    const files = fs.readdirSync(CONFIG.inputDir);
    
    for (const file of files) {
        const filePath = path.join(CONFIG.inputDir, file);
        
        if (fs.statSync(filePath).isFile()) {
            stats.total++;
            await convertToWebP(filePath);
        }
    }
}

/**
 * Afficher les statistiques finales
 */
function displayStats() {
    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 Conversion Statistics:\n');
    console.log(`Total Images Processed: ${stats.total}`);
    console.log(`✅ Successfully Converted: ${stats.converted}`);
    console.log(`⏭️  Skipped: ${stats.skipped}`);
    console.log(`❌ Errors: ${stats.errors}`);
    
    if (stats.converted > 0 && !CONFIG.dryRun) {
        const totalOriginal = stats.originalSize.toFixed(2);
        const totalWebp = stats.webpSize.toFixed(2);
        const totalSaved = (stats.originalSize - stats.webpSize).toFixed(2);
        const percentSaved = ((stats.originalSize - stats.webpSize) / stats.originalSize * 100).toFixed(1);
        
        console.log(`\n💾 Size Comparison:`);
        console.log(`   Original: ${totalOriginal} KB`);
        console.log(`   WebP: ${totalWebp} KB`);
        console.log(`   Saved: ${totalSaved} KB (${percentSaved}%)`);
    }
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Main execution
 */
async function main() {
    try {
        parseArgs();
        await convertAllImages();
        displayStats();
        
        if (CONFIG.dryRun) {
            console.log('ℹ️  This was a dry run. No files were modified.');
            console.log('   Run without --dry-run to perform actual conversion.\n');
        } else {
            console.log('✅ Conversion completed successfully!\n');
            if (CONFIG.createBackup) {
                console.log(`📁 Original files backed up to: ${CONFIG.backupDir}\n`);
            }
        }
        
    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

// Vérifier que Sharp est installé
try {
    require.resolve('sharp');
} catch (e) {
    console.error('\n❌ Error: "sharp" package is not installed.');
    console.log('\n📦 Install it with:');
    console.log('   npm install sharp --save-dev\n');
    process.exit(1);
}

// Exécuter
main();
