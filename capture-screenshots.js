const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// List of Netlify sites to capture
const sites = [
  { name: 'scintillating-torrone-19b562', url: 'https://scintillating-torrone-19b562.netlify.app' },
  { name: 'porfolioplus', url: 'https://porfolioplus.netlify.app' },
  { name: 'luxury-frangollo-11cf88', url: 'https://luxury-frangollo-11cf88.netlify.app' },
  { name: 'bejewelled-crostata-2737b4', url: 'https://bejewelled-crostata-2737b4.netlify.app' },
  { name: 'material-dashboard-react', url: 'https://material-dashboard-react-1746753948.netlify.app' },
  { name: 'loquacious-begonia-80c757', url: 'https://loquacious-begonia-80c757.netlify.app' },
  { name: 'silly-lily-66b5e2', url: 'https://silly-lily-66b5e2.netlify.app' },
  { name: 'mindblitz', url: 'https://mindblitz.netlify.app' },
  { name: 'file-fuse', url: 'https://file-fuse.netlify.app' },
  { name: 'preeminent-hotteok-79f13e', url: 'https://preeminent-hotteok-79f13e.netlify.app' },
  { name: 'magical-bubblegum-faf4ee', url: 'https://magical-bubblegum-faf4ee.netlify.app' },
  { name: 'steady-phoenix-93bfd1', url: 'https://steady-phoenix-93bfd1.netlify.app' },
  { name: 'administ', url: 'https://administ.netlify.app' },
  { name: 'brokenfileflattener', url: 'https://brokenfileflattener.netlify.app' },
  { name: 'timewell', url: 'https://timewell.netlify.app' },
  { name: 'sweet-nougat-1df434', url: 'https://sweet-nougat-1df434.netlify.app' },
  { name: 'griffin-radcliffe-analytics', url: 'https://griffin-radcliffe-analytics.netlify.app' },
  { name: 'tango-mango', url: 'https://tango-mango.netlify.app' },
  { name: 'griffin-radcliffe', url: 'https://drunkonjava.com' },
  { name: 'myfitlifepro', url: 'https://myfitlifepro.netlify.app' },
  { name: 'ephemeral-alfajores-3f1147', url: 'https://ephemeral-alfajores-3f1147.netlify.app' },
  { name: 'tiny-youtiao-dd447a', url: 'https://tiny-youtiao-dd447a.netlify.app' },
  { name: 'adorable-empanada-10d2a4', url: 'https://adorable-empanada-10d2a4.netlify.app' },
  { name: 'melodious-bienenstitch', url: 'https://melodious-bienenstitch-1857e8.netlify.app' },
  { name: 'ryan-maloney', url: 'https://ryan-maloney.netlify.app' },
  { name: 'lease-dispute-dc', url: 'https://lease-dispute-dc.netlify.app' },
  { name: 'stately-kelpie-a559bb', url: 'https://stately-kelpie-a559bb.netlify.app' },
  { name: 'rococo-starburst-882bb6', url: 'https://rococo-starburst-882bb6.netlify.app' },
  { name: 'bucolic-griffin-9cf2cb', url: 'https://bucolic-griffin-9cf2cb.netlify.app' },
  { name: 'scintillating-youtiao', url: 'https://scintillating-youtiao-a64c89.netlify.app' },
  { name: 'melodious-melba-4d2edd', url: 'https://melodious-melba-4d2edd.netlify.app' },
  { name: 'thehintdropper', url: 'https://thehintdropper.netlify.app' },
  { name: 'resonant-baklava-be6eb1', url: 'https://resonant-baklava-be6eb1.netlify.app' },
  { name: 'benevolent-flan-f2c21d', url: 'https://benevolent-flan-f2c21d.netlify.app' },
  { name: 'famous-dragon-b0cae6', url: 'https://famous-dragon-b0cae6.netlify.app' },
  { name: 'jolly-mooncake-7d55df', url: 'https://jolly-mooncake-7d55df.netlify.app' },
  { name: 'friendly-daifuku-78fd5b', url: 'https://friendly-daifuku-78fd5b.netlify.app' },
  { name: 'bejewelled-kataifi-88b1d9', url: 'https://bejewelled-kataifi-88b1d9.netlify.app' },
  { name: 'steroidbase', url: 'https://steroidbase.netlify.app' },
  { name: 'coruscating-cat-3a8117', url: 'https://coruscating-cat-3a8117.netlify.app' },
  { name: 'remarkable-arithmetic', url: 'https://remarkable-arithmetic-edf3e0.netlify.app' },
  { name: 'macostoolbox', url: 'https://macostoolbox.netlify.app' },
  { name: 'unrivaled-douhua-5f6118', url: 'https://unrivaled-douhua-5f6118.netlify.app' },
  { name: 'steroid-guide', url: 'https://steroid-guide.netlify.app' },
  { name: 'clinquant-custard-ea9541', url: 'https://clinquant-custard-ea9541.netlify.app' },
  { name: 'zingy-griffin-2aaa95', url: 'https://zingy-griffin-2aaa95.netlify.app' },
  { name: 'uiplaygrounddemure', url: 'https://uiplaygrounddemure.netlify.app' },
  { name: 'effulgent-banoffee-0066a0', url: 'https://effulgent-banoffee-0066a0.netlify.app' },
  { name: 'homebaseboard', url: 'https://homebaseboard.netlify.app' },
  { name: 'extraordinary-chimera', url: 'https://extraordinary-chimera-4ff070.netlify.app' },
  { name: 'funny-fenglisu-88d17f', url: 'https://funny-fenglisu-88d17f.netlify.app' },
  { name: 'eclectic-sundae-039c2a', url: 'https://eclectic-sundae-039c2a.netlify.app' },
  { name: 'delicate-queijadas-815906', url: 'https://delicate-queijadas-815906.netlify.app' },
  { name: 'tiny-licorice-ce088d', url: 'https://tiny-licorice-ce088d.netlify.app' },
  { name: 'chimerical-elf-43064a', url: 'https://chimerical-elf-43064a.netlify.app' }
];

async function captureScreenshotPlaywright(url, outputPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [path.join(__dirname, 'playwright-screenshot.js'), url, outputPath]);
    
    let output = '';
    proc.stdout.on('data', (data) => { output += data.toString(); });
    proc.stderr.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Screenshot failed for ${url}: ${output}`));
      }
    });
  });
}

async function captureScreenshots() {
  console.log('Starting screenshot capture for all Netlify sites...');
  
  const siteInfo = [];
  const batchSize = 5; // Process 5 sites at a time
  
  for (let i = 0; i < sites.length; i += batchSize) {
    const batch = sites.slice(i, i + batchSize);
    const promises = batch.map(async (site) => {
      const filename = `${site.name}.png`;
      const filepath = path.join(__dirname, 'screenshots', filename);
      
      try {
        console.log(`Capturing screenshot for ${site.name}...`);
        await captureScreenshotPlaywright(site.url, filepath);
        console.log(`✅ Screenshot captured: ${site.name}`);
        return {
          name: site.name,
          url: site.url,
          screenshot: `screenshots/${filename}`,
          status: 'success'
        };
      } catch (error) {
        console.error(`❌ Failed to capture ${site.name}:`, error.message);
        return {
          name: site.name,
          url: site.url,
          screenshot: null,
          status: 'failed',
          error: error.message
        };
      }
    });
    
    const results = await Promise.all(promises);
    siteInfo.push(...results);
    
    // Wait a bit between batches
    if (i + batchSize < sites.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Save site information to JSON
  const jsonPath = path.join(__dirname, 'site-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(siteInfo, null, 2));
  console.log(`\nSaved site data to ${jsonPath}`);
  
  const successful = siteInfo.filter(s => s.status === 'success').length;
  console.log(`\nCompleted: ${successful}/${sites.length} screenshots captured successfully`);
}

captureScreenshots().catch(console.error);