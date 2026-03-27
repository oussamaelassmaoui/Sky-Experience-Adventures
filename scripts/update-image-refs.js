const fs = require('fs');
const path = require('path');

/**
 * Script de Mise à Jour des Références d'Images - Sky Experience
 * 
 * Met à jour automatiquement les extensions .png/.jpg → .webp dans le code
 * et ajoute/améliore les attributs alt pour le SEO
 */

// Configuration
const CONFIG = {
    sourceDir: path.join(__dirname, '..'),
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
    imageExtensions: ['png', 'jpg', 'jpeg'],
    dryRun: false,
    backup: true,
};

// Mapping des alt texts par image
const ALT_TEXTS = {
    'logo.png': 'Sky Experience - Hot Air Balloon Marrakech',
    'skyexp.png': 'Sky Experience Logo',
    'hero.webp': 'Hot air balloon flight over Marrakech at sunrise',
    'balloon-intro.png': 'Colorful hot air balloon ascending in Moroccan sky',
    'balloon-landscape.png': 'Panoramic view of hot air balloons over Atlas Mountains',
    'balloon-basket.png': 'Traditional hot air balloon basket ready for flight',
    'balloon-basketZ.png': 'Wicker basket of hot air balloon with passengers',
    'balloon-land.png': 'Hot air balloon landing in Moroccan desert',
    'ball.webp': 'Hot air balloon in flight over Marrakech',
    'about.webp': 'Sky Experience team with hot air balloon',
    'smiling-woman.png': 'Happy customer after hot air balloon flight',
    'group-basket.png': 'Group of tourists in hot air balloon basket',
    'happy-group.webp': 'Satisfied customers celebrating balloon flight',
    'desert-balloons.png': 'Multiple hot air balloons over Sahara desert',
    'panoramic.png': 'Panoramic view of Marrakech from hot air balloon',
    'mariage-main.png': 'Romantic hot air balloon flight for wedding',
    'classic-main.png': 'Classic hot air balloon experience in Marrakech',
    'private-main.png': 'Private hot air balloon flight over Atlas Mountains',
    'commitment-main.png': 'Sky Experience commitment to safety and quality',
    'commitment-bottom.png': 'Professional balloon pilots and equipment',
    'commitment-fire.webp': 'Hot air balloon burner flame at sunrise',
    'ourflight.png': 'Sky Experience hot air balloon fleet',
    'airbnb.png': 'Airbnb partner logo',
    'Booking.png': 'Booking.com partner logo',
    'Tripadvisor.png': 'TripAdvisor partner logo',
    'getyourguide.png': 'GetYourGuide partner logo',
    'relax-bg.jpg': 'Peaceful hot air balloon flight over Moroccan landscape',
    'birthday.jpg': 'Birthday celebration hot air balloon flight',
    'birthday1.jpg': 'Special birthday balloon flight experience',
    'birthday3.jpg': 'Unforgettable birthday in hot air balloon',
    'private3.png': 'Exclusive private balloon flight for couples',
    'private4.png': 'Luxury hot air balloon experience',
    'classic1.png': 'Traditional Moroccan hot air balloon ride',
    'classic3.png': 'Authentic balloon flight over Marrakech',
    'hotair.png': 'Hot air balloon ascending at dawn',
    'landing1.png': 'Safe landing of hot air balloon',
    'landing2.png': 'Hot air balloon touching down gently',
};

// Statistiques
const stats = {
    filesScanned: 0,
    filesModified: 0,
    imagesUpdated: 0,
    altAdded: 0,
    errors: 0,
};

/**
 * Parse les arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    args.forEach(arg => {
        if (arg === '--dry-run') {
            CONFIG.dryRun = true;
        } else if (arg === '--no-backup') {
            CONFIG.backup = false;
        }
    });
}

/**
 * Vérifier si un fichier doit être traité
 */
function shouldProcessFile(filePath) {
    const ext = path.extname(filePath);
    if (!CONFIG.extensions.includes(ext)) return false;
    
    // Exclure node_modules, .next, etc.
    const excludes = ['node_modules', '.next', 'dist', 'build', '.git'];
    return !excludes.some(exclude => filePath.includes(exclude));
}

/**
 * Obtenir l'alt text pour une image
 */
function getAltText(imageName) {
    return ALT_TEXTS[imageName] || `Sky Experience - ${imageName.replace(/\.(png|jpg|jpeg|webp)$/, '').replace(/[-_]/g, ' ')}`;
}

/**
 * Mettre à jour les références d'images dans un fichier
 */
function updateImageReferences(content, filePath) {
    let modified = false;
    let newContent = content;
    const updates = [];

    // Pattern 1: src="/images/file.webp"
    const pattern1 = /src=["']\/images\/([^"']+\.(png|jpg|jpeg))["']/gi;
    newContent = newContent.replace(pattern1, (match, filename, ext) => {
        const baseName = filename.replace(/\.(png|jpg|jpeg)$/i, '');
        const newPath = `${baseName}.webp`;
        modified = true;
        updates.push(`${filename} → ${newPath}`);
        stats.imagesUpdated++;
        return `src="/images/${newPath}"`;
    });

    // Pattern 2: Vérifier les alt manquants ou vides
    const altPattern = /(<Image[^>]*src=["']\/images\/([^"']+)["'][^>]*)(alt=["']["']|\/>|>)/gi;
    newContent = newContent.replace(altPattern, (match, before, imageName, after) => {
        if (after === 'alt=""' || !match.includes('alt=')) {
            const fileName = path.basename(imageName);
            const altText = getAltText(fileName);
            modified = true;
            stats.altAdded++;
            
            if (after === '/>') {
                return `${before}alt="${altText}" />`;
            } else if (after === '>') {
                return `${before}alt="${altText}">`;
            } else {
                return `${before}alt="${altText}" ${after}`;
            }
        }
        return match;
    });

    if (modified && !CONFIG.dryRun) {
        if (CONFIG.backup) {
            fs.writeFileSync(`${filePath}.backup`, content);
        }
        fs.writeFileSync(filePath, newContent);
        stats.filesModified++;
    }

    if (modified) {
        console.log(`\n📝 ${path.relative(CONFIG.sourceDir, filePath)}`);
        if (updates.length > 0) {
            updates.forEach(update => console.log(`   ✅ ${update}`));
        }
        if (stats.altAdded > 0) {
            console.log(`   🏷️  Added ${stats.altAdded} alt attributes`);
        }
    }

    return modified;
}

/**
 * Scanner et traiter tous les fichiers
 */
function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && shouldProcessFile(fullPath)) {
            try {
                stats.filesScanned++;
                const content = fs.readFileSync(fullPath, 'utf8');
                updateImageReferences(content, fullPath);
            } catch (error) {
                console.error(`❌ Error processing ${fullPath}:`, error.message);
                stats.errors++;
            }
        }
    }
}

/**
 * Afficher les statistiques
 */
function displayStats() {
    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 Update Statistics:\n');
    console.log(`Files Scanned: ${stats.filesScanned}`);
    console.log(`Files Modified: ${stats.filesModified}`);
    console.log(`Images Updated: ${stats.imagesUpdated}`);
    console.log(`Alt Texts Added: ${stats.altAdded}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Main execution
 */
function main() {
    console.log('\n🔄 Sky Experience - Image References Updater\n');
    console.log(`📂 Source Directory: ${CONFIG.sourceDir}`);
    console.log(`🔍 Dry Run: ${CONFIG.dryRun ? 'Yes' : 'No'}`);
    console.log(`💾 Backup: ${CONFIG.backup ? 'Yes' : 'No'}\n`);
    console.log('─'.repeat(60));

    parseArgs();

    try {
        processDirectory(CONFIG.sourceDir);
        displayStats();

        if (CONFIG.dryRun) {
            console.log('ℹ️  This was a dry run. No files were modified.');
            console.log('   Run without --dry-run to apply changes.\n');
        } else {
            console.log('✅ Update completed successfully!\n');
            if (CONFIG.backup) {
                console.log('💾 Original files backed up with .backup extension\n');
            }
        }
    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

// Exécuter
main();
