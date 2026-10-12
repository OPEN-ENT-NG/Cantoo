// @ts-check
const express = require("express")
const dotenv = require('dotenv')
const path  = require("path")
const cors = require('cors')
const helmet = require('helmet').default
const { models } = require('./models')
const verifyHMAC = require('./middleware/hmac')

dotenv.config()
let dictionaryModel
let LlamaChatSessionClass

const corsOptions = {
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Signature', 'X-Timestamp', 'X-Client-Id'],
  exposedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400
}

const loadModel = async () => {
  const { getLlama, LlamaChatSession } = await import("node-llama-cpp")
  console.log('loading model:', models.qwen1_5B.repo + '/' + models.qwen1_5B.file)
  const llama = await getLlama()
  dictionaryModel = await llama.loadModel({
    modelPath: path.resolve(process.cwd(), "models", models.qwen1_5B.file),
  })
  console.log('model loaded!')

  LlamaChatSessionClass = LlamaChatSession
}

loadModel()

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001
const LISTEN_HOST = process.env.LISTEN_HOST || (process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0')

const app = express()

app.use(cors(corsOptions))

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}))

app.use(/** @type {import('express').RequestHandler} */((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Signature, X-Timestamp, X-Client-Id');
  res.header('Access-Control-Expose-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}));

app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(verifyHMAC)
}

app.post("/dictionary", /** @type {import('express').RequestHandler} */(async (req, res) => {
  const { word, lang, phrase, answerLang = 'french' } = req.body

  if (!dictionaryModel) return res.status(500).json({ message: 'no model loaded' })
  if (!word) return res.status(400).json({ message: 'no word provided' })
  if (!lang) return res.status(400).json({ message: 'no lang provided' })

  let prompt = ''
  if (phrase) prompt = `In the sentence "${phrase}", explain the meaning of the word "${word}" as clearly and helpfully as possible for a student. Do not just repeat the word or its base form. Give a simple explanation in ${answerLang}, using examples if needed.`
  else prompt = `Define the ${lang} word "${word}" in a simple and helpful way for a student. Avoid tautologies. Provide a clear explanation in ${answerLang}, with examples if useful.`

  const context = await dictionaryModel.createContext({
    contextSize: 2048,
  })
  const session = new LlamaChatSessionClass({
    contextSequence: context.getSequence(),
    systemPrompt: `You are a ${answerLang} educational assistant that helps students understand the meaning of words in a simple, useful, and non-redundant way. When given a word in context, explain what it means clearly and avoid tautologies (e.g., don't define a word by repeating it). Provide practical, student-friendly definitions or explanations. Do not include small talk or formatting. Pay attention to always answer in ${answerLang}.`
  })

  const promptResult = await session.prompt(prompt, {
    topK: 25,
    topP: 0.95,
    maxTokens: 400,
    temperature: 0.7,
    }
  )

  await context.dispose()

  res.json({
    result: promptResult
  })
}))

app.post('/translate', /** @type {import('express').RequestHandler} */(async (req, res) => {
  const { srcLang, phrase, targetLang = 'french' } = req.body

  if (!dictionaryModel) res.status(500).json({ message: 'no model loaded' })
  else if (!phrase) res.status(400).json({ message: 'no phrase provided' })
  else if (!srcLang) res.status(400).json({ message: 'no lang provided' })
  else {

    const prompt = `Translate the phrase "${phrase}" from ${srcLang} to ${targetLang}.`

    const context = await dictionaryModel.createContext({
      contextSize: 2048,
    })
    const session = new LlamaChatSessionClass({
      contextSequence: context.getSequence(),
      systemPrompt: 'You are a translation model',
    })

    const promptResult = await session.prompt(prompt, {
      topK: 25,
      topP: 0.95,
      maxTokens: 400,
      temperature: 0.7,
      }
    )

    await context.dispose()

    res.json({
      result: promptResult
    })
  }
}))

app.listen(PORT, LISTEN_HOST, () => {
  console.log(`Server running on http://${LISTEN_HOST}:${PORT}`)
})

process.on('SIGTERM', () => {
  if (dictionaryModel && !dictionaryModel.disposed) {
    dictionaryModel.dispose()
  }
})
