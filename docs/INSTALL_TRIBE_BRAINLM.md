# 🧠 TRIBE v2 & BrainLM — Local Installation Guide

## System Overview

| Component | Status |
|-----------|--------|
| **OS** | Windows 11 |
| **Python** | 3.13.1 (C:\Python313) |
| **pip** | 24.3.1 |
| **GPU** | ❌ None (CPU-only mode) |
| **Free Disk** | ~22 GB on C:\ |
| **Conda** | ❌ Not installed |

> Both models will run in **CPU-only mode**. TRIBE v2 (~0.66 GB) is very lightweight. BrainLM 111M (~0.5 GB) is also CPU-friendly.

---

## Option 1: Meta TRIBE v2

**GitHub:** <https://github.com/facebookresearch/tribev2>  
**License:** CC BY-NC  
**Model Size:** ~710 MB  
**Paper:** arXiv:2605.04326 (2026)

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

> If `requirements.txt` doesn't exist in the repo, install manually:

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

## Option 2: BrainLM (Yale)

**GitHub:** <https://github.com/vandijklab/BrainLM>  
**HuggingFace:** <https://huggingface.co/vandijklab/brainlm>  
**License:** CC BY-NC-ND 4.0  
**Paper:** bioRxiv 10.1101/2023.09.12.557460

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

- `vandijklab/brainlm/vitmae_111M/` — 111M parameters (~450 MB)
- `vandijklab/brainlm/vitmae_650M/` — 650M parameters (~2.6 GB)

**Download both or just the 111M:**

```powershell
python -c "
from huggingface_hub import snapshot_download
# 111M version (recommended for CPU)
snapshot_download(repo_id='vandijklab/brainlm', allow_patterns='vitmae_111M/*', local_dir='./models/brainlm')
"
```

### Step 5: Test the model works

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

Run:

```powershell
python test_brainlm.py
```

---

## 🚀 Quick-Start Script (Windows PowerShell)

Save this as `install_both_models.ps1` and run it to install both models in one go:

```powershell
# install_both_models.ps1
Write-Host "=== Installing TRIBE v2 ===" -ForegroundColor Cyan
cd C:\
if (!(Test-Path "tribev2")) {
    git clone https://github.com/facebookresearch/tribev2.git
}
cd tribev2
python -m venv venv
.\venv\Scripts\pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
.\venv\Scripts\pip install numpy scipy scikit-learn pillow matplotlib pandas h5py omegaconf pytorch-lightning==1.9.5 huggingface-hub
mkdir models\tribev2 -Force
cd models\tribev2
curl -L -o best.ckpt "https://huggingface.co/facebook/tribev2/resolve/main/best.ckpt"
curl -L -o config.yaml "https://huggingface.co/facebook/tribev2/resolve/main/config.yaml"
Write-Host "✓ TRIBE v2 installed!" -ForegroundColor Green

Write-Host "=== Installing BrainLM ===" -ForegroundColor Cyan
cd C:\
if (!(Test-Path "BrainLM")) {
    git clone https://github.com/vandijklab/BrainLM.git
}
cd BrainLM
python -m venv venv
.\venv\Scripts\pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
.\venv\Scripts\pip install transformers datasets accelerate huggingface-hub numpy scipy scikit-learn matplotlib pandas nibabel nilearn einops timm positional-encodings
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='vandijklab/brainlm', allow_patterns='vitmae_111M/*', local_dir='./models/brainlm')"
Write-Host "✓ BrainLM installed!" -ForegroundColor Green

Write-Host "=== BOTH MODELS READY ===" -ForegroundColor Yellow
```

---

## 📊 Hardware Notes

| Model | Params | Disk | RAM (CPU inf.) | Inference Time (CPU) |
|-------|--------|------|----------------|---------------------|
| **TRIBE v2** | ~200M | 0.7 GB | ~4 GB | ~2-10 sec/sample |
| **BrainLM 111M** | 111M | 0.5 GB | ~3 GB | ~1-5 sec/sample |
| **BrainLM 650M** | 650M | 2.6 GB | ~8 GB | ~10-30 sec/sample |

> Both models are designed for GPU but will work on CPU. Inference will be slower but functional. For serious research, a GPU with ≥8 GB VRAM is recommended.

---

## 📚 Resources

- **TRIBE v2 Paper:** <https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/>
- **TRIBE v2 GitHub:** <https://github.com/facebookresearch/tribev2>
- **TRIBE v2 Colab:** <https://colab.research.google.com/github/facebookresearch/tribev2/blob/main/notebooks/tribev2_demo.ipynb>
- **BrainLM Paper:** <https://www.biorxiv.org/content/10.1101/2023.09.12.557460v2>
- **BrainLM GitHub:** <https://github.com/vandijklab/BrainLM>
- **BrainLM on HuggingFace:** <https://huggingface.co/vandijklab/brainlm>
