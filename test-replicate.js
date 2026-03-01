import { generateImageWithReplicate, downloadImage } from './src/services/replicateService.js';

async function test() {
  try {
    const urls = await generateImageWithReplicate({
      prompt: "a beautiful sunset over mountains, vibrant colors, digital art"
    });
    
    console.log("📸 Generated image URL:", urls[0]);
    
    // Download the image (optional)
    // await downloadImage(urls[0], 'test-output.png');
    
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

test();
