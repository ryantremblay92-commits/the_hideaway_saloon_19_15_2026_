# Text Generation WebUI (TGW) - Detailed Guide

> A comprehensive reference for the **oobabooga/text-generation-webui**, a Gradio-based web interface for running Large Language Models (LLMs) locally.

---

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Model Support](#model-support)
5. [Core Features](#core-features)
6. [Interface Tabs](#interface-tabs)
7. [Parameters & Generation Settings](#parameters--generation-settings)
8. [Extensions System](#extensions-system)
9. [API & External Integration](#api--external-integration)
10. [Common Commands & Flags](#common-commands--flags)
11. [Troubleshooting](#troubleshooting)
12. [Directory Structure](#directory-structure)

---

## Overview

**Text Generation WebUI** (often abbreviated as **TGW** or **oobabooga**) is an open-source, browser-based interface for loading, interacting with, and serving Large Language Models. It supports multiple backends (Transformers, llama.cpp, ExLlama, AutoGPTQ, etc.) and provides a unified chat/playground experience for models like Llama, Mistral, GPT-J, GPT-Neo, RWKV, and more.

- **Repository**: `https://github.com/oobabooga/text-generation-webui`
- **Primary Language**: Python
- **UI Framework**: Gradio
- **License**: AGPL-3.0

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|---------------|
| **OS** | Windows 10/11, Linux, macOS | Linux (Ubuntu 22.04+) |
| **CPU** | Any x86_64 | Modern 8-core+ |
| **RAM** | 16 GB | 32–64 GB (for large models) |
| **GPU** | NVIDIA GTX 1060 6GB | NVIDIA RTX 3060 12GB+ / RTX 4090 |
| **VRAM** | 6 GB | 24 GB (for 70B 4-bit) |
| **Storage** | 20 GB | 200 GB+ (for multiple models) |
| **Python** | 3.10 | 3.10 or 3.11 |

**Notes**:

- AMD GPU support is available via ROCm on Linux.
- Apple Silicon (MPS) is supported but slower than CUDA for most workloads.
- CPU-only inference is possible but significantly slower.

---

## Installation

### Method 1: One-Click Installers (Recommended)

#### Windows

```powershell
# Download and run the provided .cmd or .ps1 installer from the releases page
start_windows.bat
```

#### Linux / macOS

```bash
# Clone the repository
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui

# Run the installer
./start_linux.sh
# or
./start_macos.sh
```

### Method 2: Manual Installation

```bash
# Clone repository
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Install base requirements
pip install -r requirements.txt

# Install loader-specific requirements as needed
pip install -r requirements/requirements-transformers.txt
pip install -r requirements/requirements-llama_cpp.txt
pip install -r requirements/requirements-exllamav2.txt
```

### Method 3: Conda / Docker

```bash
# Docker
docker run -p 7860:7860 --gpus all -v /path/to/models:/app/models oobabooga/text-generation-webui

# Conda (from environment.yml)
conda env create -f environment.yml
conda activate textgen
```

---

## Model Support

TGW supports a wide variety of model formats and loaders:

| Format / Loader | Extension | Description |
|-----------------|-----------|-------------|
| **Transformers** | `.bin`, `.safetensors` | HuggingFace native (auto) |
| **llama.cpp** | `.gguf` | CPU/GPU mixed inference |
| **ExLlamaV2** | `.safetensors` | Fast GPTQ inference |
| **AutoGPTQ** | `.gptq` | 4-bit quantization |
| **AWQ** | `.awq` | Activation-aware quantization |
| **TensorRT-LLM** | Engine files | NVIDIA optimized inference |
| **HQQ** | `-hqq-4bit` | Half-quadratic quantization |
| **AQLM** | `-aqlm` | Advanced quantization |
| **DeepSpeed** | Checkpoint | ZeRO partitioning for large models |

### Downloading Models

```bash
# Via command line (uses HuggingFace Hub)
python download-model.py organization/model-name

# Examples
python download-model.py meta-llama/Llama-2-7b-chat-hf
python download-model.py TheBloke/Llama-2-7B-GGUF
```

Place models in the `models/` directory or specify `--model-dir`.

---

## Core Features

### 1. Multiple Chat Modes

- **Chat**: Standard instruct/conversation mode with templates
- **Instruct**: Single-turn instruction following
- **Notebook**: Free-form text completion (classic LLM behavior)
- **Default**: Raw generation without formatting

### 2. Chat Templates

Automatically applies the correct prompt template for models:

- `Alpaca`, `Vicuna`, `Llama-2`, `Mistral`, `ChatML`, `Zephyr`, `WizardLM`, etc.

### 3. Character System ( Tavern/JSON Cards )

- Load `.json` or `.png` character cards
- Define personality, greeting, scenario, and example messages
- Supports W++ format, AliChat, and Plaintext formats

### 4. Preset Management

- Save/load generation parameter presets
- Built-in presets: `Divine Intellect`, `Simple-1`, `Quality`, `Max Creativity`, etc.

### 5. Prompt Engineering Tools

- System prompt editor
- Context (memory) injection
- Negative prompts (for CFG)
- Token counting and truncation preview

### 6. Text-to-Speech & Speech-to-Text

- Extensions for Silero TTS, ElevenLabs, Whisper STT

### 7. Multimodal Support

- LLaVA, BakLLaVA, and other vision models via `--multimodal` extensions

---

## Interface Tabs

| Tab | Function |
|-----|----------|
| **Chat** | Interactive conversation with LLM |
| **Default** | Raw completion playground |
| **Notebook** | Document-style editing with generation |
| **Parameters** | Adjust temperature, top_p, repetition_penalty, etc. |
| **Model** | Load/unload models, select loader, set GPU layers |
| **Session** | UI theme, notification sounds, defaults |
| **Training** | LoRA/QLoRA training (Proteus, raw text, formatted JSON) |
| **Extensions** | Manage built-in and custom extensions |

---

## Parameters & Generation Settings

### Core Sampling Parameters

| Parameter | Typical Range | Description |
|-----------|---------------|-------------|
| `max_new_tokens` | 512–4096 | Tokens to generate per response |
| `temperature` | 0.1–2.0 | Randomness (0 = deterministic, 1.5 = chaotic) |
| `top_p` | 0.1–1.0 | Nucleus sampling cutoff |
| `top_k` | 1–100 | Limit to top K tokens |
| `repetition_penalty` | 1.0–1.5 | Penalize repeated token sequences |
| `frequency_penalty` | -2.0–2.0 | OpenAI-style frequency penalty |
| `presence_penalty` | -2.0–2.0 | OpenAI-style presence penalty |

### Advanced Parameters

| Parameter | Description |
|-----------|-------------|
| `min_p` | Minimum probability threshold for token acceptance |
| `typical_p` | Typical sampling (0–1) |
| `tfs` | Tail Free Sampling (0–1) |
| `mirostat` | Mirostat sampling mode (0/1/2) |
| `mirostat_tau` | Mirostat target entropy |
| `mirostat_eta` | Mirostat learning rate |
| `guidance_scale` | Classifier-Free Guidance (CFG) scale |
| `negative_prompt` | CFG negative prompt text |
| `seed` | RNG seed (-1 for random) |
| `truncation_length` | Max prompt context length |

### Recommended Presets by Use Case

| Use Case | Temperature | Top P | Rep. Penalty | Notes |
|----------|-------------|-------|--------------|-------|
| **Factual / Coding** | 0.2–0.5 | 0.9–1.0 | 1.0 | Keep focused and deterministic |
| **Creative Writing** | 0.7–0.9 | 0.9–0.95 | 1.05–1.1 | Allow variation, light repetition control |
| **Roleplay / Chat** | 0.6–0.8 | 0.9 | 1.1–1.18 | Balance coherence and creativity |
| **Brainstorming** | 1.0–1.3 | 0.8–0.9 | 1.0–1.05 | High randomness for ideation |

---

## Extensions System

Extensions add functionality without modifying core code. Located in `extensions/` or downloaded into `extensions/`.

### Built-in Extensions

| Extension | Purpose |
|-----------|---------|
| `api` | REST API for external applications |
| `openai` | OpenAI-compatible API endpoint (`/v1/chat/completions`) |
| `superbooga` | Enhanced retrieval via ChromaDB |
| `send_pictures` | Vision model image input support |
| `whisper_stt` | Speech-to-text input |
| `elevenlabs_tts` | Text-to-speech output |
| `silero_tts` | Local TTS |
| `sd_api_pictures` | Stable Diffusion image generation integration |
| `long_replies` | Automatic continuation for cut-off responses |

### Installing Extensions

```bash
# Clone into extensions directory
cd extensions
git clone https://github.com/username/extension-name.git

# Restart TGW
```

### Writing a Custom Extension

```python
# extensions/my_extension/script.py
import gradio as gr

def ui():
    with gr.Accordion("My Extension", open=False):
        btn = gr.Button("Click Me")
        output = gr.Textbox()
        btn.click(fn=lambda: "Hello from extension!", outputs=output)

def custom_generate(prompt, state):
    # Modify prompt before generation
    return prompt
```

---

## API & External Integration

TGW exposes a REST API for headless usage.

### Start with API Enabled

```bash
python server.py --api --listen --api-port 5000
```

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/generate` | Raw text generation |
| `POST` | `/api/v1/chat` | Chat completion (legacy) |
| `POST` | `/v1/chat/completions` | OpenAI-compatible (requires `openai` extension) |
| `POST` | `/v1/completions` | OpenAI-compatible completions |
| `POST` | `/v1/models` | List loaded models |
| `GET` | `/api/v1/model` | Get current model info |

### Example API Call

```bash
curl -X POST http://localhost:5000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is quantum computing?",
    "max_new_tokens": 250,
    "temperature": 0.7,
    "top_p": 0.9
  }'
```

### Python Client Example

```python
import requests

payload = {
    "prompt": "User: Hello!\nAssistant:",
    "max_new_tokens": 128,
    "temperature": 0.7,
    "stop": ["User:", "\n"]
}

response = requests.post("http://localhost:5000/api/v1/generate", json=payload)
print(response.json()["results"][0]["text"])
```

---

## Common Commands & Flags

### Launch Flags

```bash
python server.py [FLAGS]
```

| Flag | Description |
|------|-------------|
| `--listen` | Bind to 0.0.0.0 (allow external connections) |
| `--listen-host HOST` | Specific host to bind |
| `--listen-port PORT` | Port for Gradio UI (default: 7860) |
| `--api` | Enable the legacy API |
| `--api-port PORT` | Port for API (default: 5000) |
| `--public-idle` | Share via Gradio public link (idle mode) |
| `--share` | Create a public Gradio URL |
| `--model-dir PATH` | Custom model directory |
| `--model MODEL` | Auto-load model on startup |
| `--loader LOADER` | Force specific loader (exllamav2, llama.cpp, etc.) |
| `--cpu` | Force CPU-only mode |
| `--auto-devices` | Automatically split model across GPUs + CPU |
| `--gpu-memory MEMORY` | Max VRAM per GPU in MiB |
| `--cpu-memory MEMORY` | Max RAM to allocate in MiB |
| `--load-in-8bit` | 8-bit mode (Transformers) |
| `--load-in-4bit` | 4-bit mode (Transformers/BitsAndBytes) |
| `--multimodal` | Enable multimodal pipeline |
| `--extensions EXT1,EXT2` | Auto-load extensions |
| `--verbose` | Enable detailed logging |
| `--no-stream` | Disable token streaming |

### Examples

```bash
# Local only, specific model
python server.py --model Llama-2-7B-chat-hf --loader transformers

# Network accessible with API
python server.py --listen --api --api-port 5000 --model-dir /mnt/ai/models

# Low VRAM GPU + CPU offloading
python server.py --model TheBloke-30B-GPTQ --gpu-memory 8000 --auto-devices

# ExLlamaV2 with cache quantization
python server.py --model my-model-exl2 --loader exllamav2
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **CUDA Out of Memory** | Reduce `max_seq_len`, enable `--auto-devices`, or use a quantized model (GGUF/GPTQ) |
| **Slow generation** | Use ExLlamaV2/llama.cpp for faster inference; increase `gpu_layers` |
| **Model won't load** | Verify all requirements files are installed; check file permissions |
| **Weird outputs / formatting** | Select the correct chat template in Parameters > Chat |
| **API 404 errors** | Ensure `--api` flag is set and correct extension is loaded |
| **Extensions not appearing** | Restart server after installing; check for missing dependencies |
| **Gradio queue errors** | Disable queue with `--no-queue` or upgrade Gradio |

---

## Directory Structure

```
text-generation-webui/
├── cache/              # Temporary files
├── characters/         # Character JSON/PNG cards
├── checkpoints/        # Training checkpoints
├── extensions/         # Installed extensions
│   ├── api/
│   ├── openai/
│   └── ...
├── logs/               # Chat logs and session history
├── loras/              # LoRA adapter files
├── models/             # Base LLM weights
│   ├── llama-2-7b/
│   └── mistral-7b/
├── presets/            # Generation parameter presets
├── prompts/            # Saved prompt templates
├── training/           # Training datasets and outputs
├── webui.py            # Main entry point (legacy)
├── server.py           # Modern server entry point
└── requirements*.txt   # Dependency manifests
```

---

## Quick Reference Card

```bash
# Install & Run (Linux)
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui
./start_linux.sh

# Manual run after install
source venv/bin/activate
python server.py --listen --api

# Download a GGUF model
python download-model.py TheBloke/Llama-2-7B-chat-GGUF

# Access
# UI:   http://localhost:7860
# API:  http://localhost:5000
```

---

## Useful Links

- **GitHub**: <https://github.com/oobabooga/text-generation-webui>
- **Wiki**: <https://github.com/oobabooga/text-generation-webui/wiki>
- **HuggingFace Models**: <https://huggingface.co/TheBloke>
- **LoRA Training Guide**: <https://github.com/oobabooga/text-generation-webui/wiki/LoRA-training>
- **API Docs**: <https://github.com/oobabooga/text-generation-webui/wiki/12-%E2%80%90-OpenAI-API>

---

*Last updated: 2026-05-12*
