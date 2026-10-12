// @ts-check
const { downloadFile } = require('@huggingface/hub');
const { models } = require('../models')
const fs = require('fs')
const path = require('path')

const modelsFolder = path.resolve(__dirname, '../models')
async function downloadModel() {
  if (!fs.existsSync(modelsFolder)) fs.mkdirSync(modelsFolder)
  const { repo, file } = models.qwen1_5B
  const destination = path.join(modelsFolder, file);

  try {
    console.log(`Downloading model: ${repo}/${file}`);
    const downloadResult = await downloadFile({
        repo,
        path: file,
    });

    if (!downloadResult) {
      throw new Error('Failed to download model');
    }
    fs.writeFileSync(destination, Buffer.from(await downloadResult.arrayBuffer()))
    console.log(`Model file downloaded to ${destination}`);
  } catch (error) {
    console.error('Error downloading model:', error);
    process.exit(1)
  }
}

downloadModel();
