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