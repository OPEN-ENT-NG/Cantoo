// @ts-check
module.exports = {
  models: {
    llama: {
      repo: 'hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF',
      file: 'llama-3.2-1b-instruct-q4_k_m.gguf',
    },
    qwen: {
      repo: 'medmekk/Qwen2.5-0.5B-Instruct.GGUF',
      file:'Qwen2.5-0.5B-Instruct-Q5_K_S.gguf'
    },
    qwen1_5B: {
      repo: 'medmekk/Qwen2.5-1.5B-Instruct.GGUF',
      file:'Qwen2.5-1.5B-Instruct-Q8_0.gguf'
    },
    deepSeek: {
      repo: 'unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF',
      file:'DeepSeek-R1-Distill-Qwen-1.5B-Q5_K_M.gguf'
    },
    smool: {
      repo: 'bartowski/SmolLM2-1.7B-Instruct-GGUF',
      file: 'SmolLM2-1.7B-Instruct-Q5_K_M.gguf'
    },
    mistral: {
      repo: 'TheBloke/Mistral-7B-v0.1-GGUF',
      file: 'mistral-7b-v0.1.Q5_K_M.gguf'
    },
    croissant: {
      repo: 'DavidAU/French-Alpaca-Croissant-1.3B-Instruct-Q6_K-GGUF',
      file: 'french-alpaca-croissant-1.3b-instruct.Q6_K.gguf'
    }
  }
}
