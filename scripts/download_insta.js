const fs = require('fs');
const path = require('path');
const https = require('https');

const dataFile = path.join(__dirname, '..', 'data', 'instagram_posts_v2.json');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'instagram');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(path.join(outputDir, filename));
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Starting download of ${posts.length} posts...`);
  const updatedPosts = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const extension = post.media_url.split('?')[0].split('.').pop() || 'jpg';
    const filename = `post_${i + 1}.${extension}`;
    
    try {
      console.log(`Downloading ${filename}...`);
      await downloadImage(post.media_url, filename);
      updatedPosts.push({
        ...post,
        local_image_url: `/images/instagram/${filename}`
      });
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
      updatedPosts.push(post);
    }
  }

  // Save updated JSON with local paths
  fs.writeFileSync(dataFile, JSON.stringify(updatedPosts, null, 2));
  console.log('All downloads completed and data updated.');
}

main().catch(console.error);
