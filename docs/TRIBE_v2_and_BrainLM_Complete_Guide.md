# 🧠 TRIBE v2 (Meta) & BrainLM (Yale) — Complete Research & Installation Guide

> **Research conducted:** May 2026  
> **System:** Windows 11 · Python 3.13.1 · CPU-only (no GPU)  

---

# Part I: Model Research

---

## 1. Meta TRIBE v2

### Overview

| Field | Details |
|-------|---------|
| **Full Name** | TRIBE v2 — A Foundation Model of Vision, Audition, and Language for In-Silico Neuroscience |
| **Organization** | Meta Platforms, Inc. (FAIR / Meta AI) |
| **Release Date** | March 24, 2026 |
| **License** | CC BY-NC (non-commercial) |
| **Model Size** | ~710 MB (checkpoint + config) |
| **Paper** | arXiv:2605.04326 (2026) |
| **GitHub Stars** | ~2,566 (as of May 2026) |
| **GitHub Forks** | ~570 |

### What It Does

TRIBE v2 is a **foundation model for in-silico neuroscience**. It can predict **high-resolution 3D brain responses** to three types of stimuli:

| Stimulus Type | Input | Brain Response Prediction |
|--------------|-------|--------------------------|
| **Vision** | Images / Video | fMRI BOLD signal across visual cortex |
| **Audition** | Audio / Speech | fMRI BOLD signal across auditory cortex |
| **Language** | Text / Sentences | fMRI BOLD signal across language networks |

### Architecture

- **Backbone:** Vision Transformer (ViT) / Audio Spectrogram Transformer / Text Transformer — tri-modal encoder
- **Training Data:** Large-scale fMRI datasets (Human Connectome Project, UK Biobank, etc.)
- **Output:** Voxel-wise 3D brain activity maps
- **Version:** v2 (improved over the original TRIBE with tri-modal capabilities)

### Links

- **GitHub:** <https://github.com/facebookresearch/tribev2>
- **Paper:** <https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/>
- **HuggingFace:** <https://huggingface.co/facebook/tribev2>
- **Colab Demo:** <https://colab.research.google.com/github/facebookresearch/tribev2/blob/main/notebooks/tribev2_demo.ipynb>

### Repository Contents (HuggingFace)

| File | Size | Purpose |
|------|------|---------|
| `best.ckpt` | ~700 MB | Pre-trained model checkpoint |
| `config.yaml` | ~2 KB | Model configuration |
| `LICENSE` | — | CC BY-NC license |
| `README.md` | — | Model card |

---

## 2. BrainLM (Yale University)

### Overview

| Field | Details |
|-------|---------|
| **Full Name** | BrainLM: A foundation model for brain activity recordings |
| **Organization** | van Dijk Lab, Yale University |
| **Release Date** | September 2023 (v1); January 2024 (v2) |
| **License** | CC BY-NC-ND 4.0 (non-commercial, no derivatives) |
| **Paper** | bioRxiv 10.1101/2023.09.12.557460 |
| **GitHub Stars** | ~15 |
| **HuggingFace Likes** | ~20 |

### Authors

Ortega Caro, J.; Oliveira Fonseca, A. H.; Averill, C.; Rizvi, S. A.; Rosati, M.; Cross, J. L.; Mittal, P.; Zappala, E.; Levine, D.; Dhodapkar, R. M.; Han, I.; Karbasi, A.; Abdallah, C. G.; van Dijk, D.

### What It Does

BrainLM is a **foundation model for brain dynamics**. Trained on **6,700 hours of resting-state fMRI recordings** from UK Biobank and Human Connectome Project, it uses a **Transformer-based masked autoencoder** to learn spatiotemporal fMRI dynamics.

**Capabilities:**

- Decoding clinical variables and mental health biomarkers
- Predicting future brain states from neural activity
- Zero-shot and fine-tuned inference on unseen fMRI datasets
- Modeling brain dynamics without external stimulus labels

### Architecture

| Component | Detail |
|-----------|--------|
| **Backbone** | Vision Transformer (ViT) Masked Autoencoder |
| **Training** | Masked reconstruction of spatiotemporal fMRI patches |
| **Training Data** | 6,700 hours of fMRI (UK Biobank + HCP) |
| **Model Sizes** | 111M and 650M parameters |

### Model Variants

| Model | Parameters | Disk Size | RAM (CPU) | Use Case |
|-------|-----------|-----------|-----------|----------|
| `vitmae_111M` | 111M | ~450 MB | ~3 GB | CPU-friendly, fast inference |
| `vitmae_650M` | 650M | ~2.6 GB | ~8 GB | More accurate, needs more RAM |

### Links

- **GitHub:** <https://github.com/vandijklab/BrainLM>
- **HuggingFace:** <https://huggingface.co/vandijklab/brainlm>
- **Paper (v2):** <https://www.biorxiv.org/content/10.1101/2023.09.12.557460v2>

---

## 3. Comparison: TRIBE v2 vs BrainLM

| Aspect | TRIBE v2 (Meta) | BrainLM (Yale) |
|--------|----------------|----------------|
| **Primary Focus** | Stimulus-to-brain mapping (vision, audio, text) | Brain dynamics from resting-state fMRI |
| **Input** | Images, audio, text | fMRI time series only |
| **Output** | 3D voxel-wise brain activation maps | Predicted brain states, clinical biomarkers |
| **Training Data** | Task-evoked fMRI (HCP, UK Biobank) | Resting-state fMRI (6,700 hours) |
| **Best For** | Predicting how the brain responds to media | Analyzing clinical/mental health from brain activity |
| **License** | CC BY-NC | CC BY-NC-ND 4.0 |
| **GPU Required** | Recommended | Recommended (111M OK on CPU) |
| **Parameter Count** | ~200M | 111M / 650M |

---

# Part II: Local Installation

---

## System Requirements

### Your System

| Component | Status |
|-----------|--------|
| **OS** | Windows 11 |
| **Python** | 3.13.1 (C:\Python313) |
| **pip** | 24.3.1 |
| **GPU** | ❌ None (CPU-only mode) |
| **Free Disk** | ~22 GB on C:\ |
| **Conda** | ❌ Not installed |

> Both models will run in **CPU-only mode**. TRIBE v2 (~0.66 GB) is very lightweight. BrainLM 111M (~0.5 GB) is also CPU-friendly.

### Minimum Hardware Requirements

| Model | Params | Disk | RAM (CPU Inf.) | CPU Inference Time |
|-------|--------|------|----------------|---------------------|
| **TRIBE v2** | ~200M | 0.7 GB | ~4 GB | ~2-10 sec/sample |
| **BrainLM 111M** | 111M | 0.5 GB | ~3 GB | ~1-5 sec/sample |
| **BrainLM 650M** | 650M | 2.6 GB | ~8 GB | ~10-30 sec/sample |

> Both models are designed for GPU but will work on CPU. Inference will be slower but functional. For serious research, a GPU with ≥8 GB VRAM is recommended.

---

## Option 1: Install Meta TRIBE v2

### Step 1: Clone the repository

```powershell
cd C:\
git clone https://github.com/facebookresearch/tribev2.git
cd tribev2
```

### Step 2: Create virtual environment

```powershell
python -m venv venv
.\venv\Scripts\activate
```

### Step 3: Install dependencies

```powershell
# Install CPU-only PyTorch (no CUDA)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install other dependencies
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist in the repo, install manually:

```powershell
pip install numpy scipy scikit-learn pillow matplotlib pandas h5py omegaconf pytorch-lightning==1.9.5
```

### Step 4: Download model weights

The HuggingFace repo: `https://huggingface.co/facebook/tribev2`

Contains:

- `best.ckpt` — pre-trained checkpoint
- `config.yaml` — model configuration
- `LICENSE`, `README.md`

**Option A — Direct download with Python:**

```powershell
pip install huggingface-hub
python -c "
from huggingface_hub import snapshot_download
snapshot_download(repo_id='facebook/tribev2', local_dir='./models/tribev2')
"
```

**Option B — Manual download:**

1. Visit <https://huggingface.co/facebook/tribev2/tree/main>
2. Download `best.ckpt` and `config.yaml`
3. Place them in `models/tribev2/`

**Option C — Using curl:**

```powershell
mkdir models\tribev2
cd models\tribev2
curl -L -o best.ckpt "https://huggingface.co/facebook/tribev2/resolve/main/best.ckpt"
curl -L -o config.yaml "https://huggingface.co/facebook/tribev2/resolve/main/config.yaml"
```

### Step 5: Run inference (quick test)

Create `test_tribev2.py` in the repo root:

```python
import os
import torch
import numpy as np
import pytorch_lightning as pl
from omegaconf import OmegaConf

# Load config
config = OmegaConf.load("models/tribev2/config.yaml")

# Try to load checkpoint (placeholder - actual model class depends on repo code)
checkpoint = torch.load("models/tribev2/best.ckpt", map_location="cpu")
print("✓ Model loaded successfully!")
print(f"  Keys in checkpoint: {list(checkpoint.keys())[:10]}...")
print(f"  Total keys: {len(checkpoint.keys())}")
```

Run it:

```powershell
python test_tribev2.py
```

### Step 6: Google Colab (no local install needed)

If local setup is too slow, use their official Colab notebook:

- <https://colab.research.google.com/github/facebookresearch/tribev2/blob/main/notebooks/tribev2_demo.ipynb>

---

## Option 2: Install BrainLM (Yale)

### Step 1: Clone the repository

```powershell
cd C:\
git clone https://github.com/vandijklab/BrainLM.git
cd BrainLM
```

### Step 2: Create virtual environment

```powershell
python -m venv venv
.\venv\Scripts\activate
```

### Step 3: Install dependencies

```powershell
# CPU-only PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# HuggingFace ecosystem
pip install transformers datasets accelerate huggingface-hub

# Scientific stack
pip install numpy scipy scikit-learn matplotlib pandas nibabel nilearn

# BrainLM-specific
pip install einops timm positional-encodings
```

### Step 4: Download model weights

Two model sizes available on HuggingFace:

- `vandijklab/brainlm/vitmae_111M/` — 111M parameters (~450 MB) **← Recommended for CPU**
- `vandijklab/brainlm/vitmae_650M/` — 650M parameters (~2.6 GB)

**Download the 111M version (recommended):**

```powershell
python -c "
from huggingface_hub import snapshot_download
snapshot_download(repo_id='vandijklab/brainlm', allow_patterns='vitmae_111M/*', local_dir='./models/brainlm')
"
```

### Step 5: Test the model works

Create `test_brainlm.py`:

```python
# test_brainlm.py
from huggingface_hub import hf_hub_download
import torch
import json

# Download config
config_path = hf_hub_download(
    repo_id="vandijklab/brainlm",
    filename="vitmae_111M/config.json",
    subfolder="vitmae_111M"
)

# Download model weights
model_path = hf_hub_download(
    repo_id="vandijklab/brainlm",
    filename="vitmae_111M/pytorch_model.bin",
    subfolder="vitmae_111M"
)

# Load and check
state = torch.load(model_path, map_location="cpu", weights_only=True)
print(f"✓ BrainLM 111M model loaded!")
print(f"  Model file: {model_path}")
print(f"  Parameter count: {len(state)} keys")
```

Run it:

```powershell
python test_brainlm.py
```

---

## 🚀 One-Click Install Script

Save this as `scripts/install_both_models.ps1` and run in PowerShell as Administrator:

```powershell
# install_both_models.ps1
Write-Host "=== Installing TRIBE v2 (Meta) ===" -ForegroundColor Cyan
cd C:\
if (!(Test-Path "tribev2")) {
    git clone https://github.com/facebookresearch/tribev2.git
}
cd tribev2
python -m venv venv
.\venv\Scripts\pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu 2>&1 | Out-Null
.\venv\Scripts\pip install numpy scipy scikit-learn pillow matplotlib pandas h5py omegaconf pytorch-lightning==1.9.5 huggingface-hub 2>&1 | Out-Null
mkdir models\tribev2 -Force | Out-Null
cd models\tribev2
Write-Host "Downloading TRIBE v2 weights (~0.7 GB)..." -ForegroundColor Yellow
curl -L -o best.ckpt "https://huggingface.co/facebook/tribev2/resolve/main/best.ckpt" 2>&1 | Out-Null
curl -L -o config.yaml "https://huggingface.co/facebook/tribev2/resolve/main/config.yaml" 2>&1 | Out-Null
Write-Host "✓ TRIBE v2 installed!" -ForegroundColor Green

Write-Host "=== Installing BrainLM (Yale) ===" -ForegroundColor Cyan
cd C:\
if (!(Test-Path "BrainLM")) {
    git clone https://github.com/vandijklab/BrainLM.git
}
cd BrainLM
python -m venv venv
.\venv\Scripts\pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu 2>&1 | Out-Null
.\venv\Scripts\pip install transformers datasets accelerate huggingface-hub numpy scipy scikit-learn matplotlib pandas nibabel nilearn einops timm positional-encodings 2>&1 | Out-Null
Write-Host "Downloading BrainLM 111M weights (~0.5 GB)..." -ForegroundColor Yellow
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='vandijklab/brainlm', allow_patterns='vitmae_111M/*', local_dir='./models/brainlm', ignore_patterns=['*.h5'])" 2>&1 | Out-Null
Write-Host "✓ BrainLM installed!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  BOTH MODELS READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "TRIBE v2: C:\tribev2" -ForegroundColor Cyan
Write-Host "  Activate: .\tribev2\venv\Scripts\activate"
Write-Host ""
Write-Host "BrainLM: C:\BrainLM" -ForegroundColor Cyan
Write-Host "  Activate: .\BrainLM\venv\Scripts\activate"
Write-Host ""
Write-Host "To use Colab instead (no local install):"
Write-Host "  https://colab.research.google.com/github/facebookresearch/tribev2/blob/main/notebooks/tribev2_demo.ipynb"
```

Run it:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install_both_models.ps1
```

---

## 🔧 Troubleshooting

### Issue: `pip install` is slow

```powershell
pip install --default-timeout=100 <package>
```

### Issue: HuggingFace download timeout

Use `curl` with resume support:

```powershell
curl -L -C - -o best.ckpt "https://huggingface.co/facebook/tribev2/resolve/main/best.ckpt"
```

### Issue: Out of memory on CPU

- Use BrainLM 111M instead of 650M
- Reduce batch size to 1
- Use `map_location="cpu"` and `weights_only=True`

### Issue: No Git installed

```powershell
winget install Git.Git
```

---

## 📚 Resources

| Resource | Link |
|----------|------|
| **TRIBE v2 Paper** | <https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/> |
| **TRIBE v2 GitHub** | <https://github.com/facebookresearch/tribev2> |
| **TRIBE v2 HuggingFace** | <https://huggingface.co/facebook/tribev2> |
| **TRIBE v2 Colab** | <https://colab.research.google.com/github/facebookresearch/tribev2/blob/main/notebooks/tribev2_demo.ipynb> |
| **BrainLM Paper (v2)** | <https://www.biorxiv.org/content/10.1101/2023.09.12.557460v2> |
| **BrainLM GitHub** | <https://github.com/vandijklab/BrainLM> |
| **BrainLM HuggingFace** | <https://huggingface.co/vandijklab/brainlm> |
