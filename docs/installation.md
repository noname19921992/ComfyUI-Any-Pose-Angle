# Installation, model downloads and upgrades

[Home](../README.md) · [User guide](usage.md)

[Plugin installation](#installation-and-dependencies) · [Base models](#base-generation-models-required-for-one-or-two-people) · [Camera-change models](#additional-camera-change-models) · [Pose detection](#pose-detection-from-photos-optional)

### Upgrading: what needs to be downloaded again?

| Current setup | Update or download |
|---|---|
| Qwen Image 2.1 + VNCCS V1.1 already generates poses correctly | Update Fisher Pose and reimport the current workflow. Complete files of the same model version can be reused. UI, two-person mapping, auto-fit, skeleton-reference and caching improvements do not themselves require new weights |
| Only the older VNCCS V1 is installed | Download **V1.1** below and select it in the LoRA loader. Do not simply rename the old file |
| Previously used Qwen Image 2511 or another version | The unified workflow uses the **Qwen Image 2.1 diffusion model, Qwen3-VL 8B and Qwen Image 2.1 VAE**. Install the base models below; older VAE/LoRA versions are not interchangeable |
| Want 45°, 90°, high-angle or other new camera views | Download the **six files** in Additional camera-change models as well as the base models. Identical files already installed do not need to be downloaded again |
| Want pose detection from ordinary photos | Install **comfyui_controlnet_aux** and the DWPose detector weights below. Built-in poses and imported skeleton images do not require them |
| Missing TripoSplat, background-removal or Qwen 2.1 nodes | Update **ComfyUI core and its dependencies**, not just Fisher Pose |

The unified workflow includes separate camera storage, cache reuse, a camera-change switch and independent width/height constants. Updating the plugin does not add those connections to old workflows. Save your old workflow separately, import the new one, then select character photos and models. Restart ComfyUI after installing new files and hard-refresh the browser with Ctrl+F5. The switch and size controls add no models or third-party plugins. If `PrimitiveInt` or `PrimitiveBoolean` is missing, update ComfyUI core.

**2026-10-08 camera calibration update**: camera changes now use the source camera predicted by TripoSplat for the current image. This fixes some cases where a large requested turn barely changes the output. Update both plugin and workflow. The current workflow connects the TripoSplat sampler's `latent` to the coarse-render node's `camera_latent`. You can add that connection manually to an old workflow. Do not use the front-stage sampling latent or the empty latent before reconstruction. This fix adds no models.

## Installation and dependencies

| Component | Required? | Links and purpose |
|---|---|---|
| ComfyUI core | Required | [Official repository](https://github.com/Comfy-Org/ComfyUI) · [Installation/update instructions](https://docs.comfy.org/installation/update_comfyui). Fisher checks for Qwen Image 2.1 support. Camera changes also use core TripoSplat, Gaussian Splat and background-removal nodes |
| Fisher Pose | Required | [Repository](https://github.com/Work-Fisher/ComfyUI-Fisher-Pose) · [Download ZIP](https://github.com/Work-Fisher/ComfyUI-Fisher-Pose/archive/refs/heads/main.zip) |
| comfyui_controlnet_aux | Required for photo pose detection | [Repository and installation](https://github.com/Fannovel16/comfyui_controlnet_aux#installation) · [Download ZIP](https://github.com/Fannovel16/comfyui_controlnet_aux/archive/refs/heads/main.zip). Provides `DWPreprocessor` |
| VNCCS Utils | No separate installation | [Original plugin](https://github.com/AHEKOT/ComfyUI_VNCCS_Utils). The required mannequin core and assets ship with Fisher Pose, but the **VNCCS LoRA must still be downloaded** |

`TripoSplatPreprocessImage`, `TripoSplatConditioning`, `VAEDecodeTripoSplat`, `LoadBackgroundRemovalModel` and `RemoveBackground` in the unified workflow come from ComfyUI core. If they are missing, update the core and its dependencies; do not install unrelated third-party plugins with similar names.

### Install or update Fisher Pose

For a first installation, run from the directory containing the `ComfyUI` folder:

```bash
git clone https://github.com/Work-Fisher/ComfyUI-Fisher-Pose.git ComfyUI/custom_nodes/ComfyUI-Fisher-Pose
```

For an existing Git installation, run inside the plugin directory:

```bash
git pull --ff-only
```

For ZIP installations, download the latest version, back up the old plugin folder and replace it. Do not keep two Fisher Pose copies under `custom_nodes`. The plugin itself has no separate Python dependency installation step. ComfyUI core and optional controlnet_aux still require their own dependencies. Follow controlnet_aux's official instructions and install `requirements.txt` using **the same Python environment that runs ComfyUI**.

If downloaded through a cloud drive, verify that `web/vnccs/assets/pose_studio_makehuman.v2.bin` (about 86 MB) exists. This is a bundled mannequin asset, not a generation model for the models folder. If missing, download the complete plugin from this repository.

Restart ComfyUI, refresh with Ctrl+F5 and import the [unified two-person pose and camera workflow](../workflows/【Work-Fisher】无限姿势+无限视角（支持双人）.json). Two individual photos are connected by default. `person_1.png` and `person_2.png` are placeholders; upload your own photos. Mannequin references and camera previews are embedded, so the workflow does not depend on images from the author's computer. See [character input modes](usage.md#character-input-modes) for group-photo and single-person use.

The interface follows **Settings → Language** in ComfyUI. Restart once after installing this update so ComfyUI loads the English/Chinese node translations; subsequent language changes also update an open editor.

### Base generation models: required for one or two people

These are the **exact filenames selected by default in the bundled workflow**. All folders are relative to `ComfyUI/`. Model weights are not included in the plugin ZIP.

| File | Folder | Download and source |
|---|---|---|
| `qwen_image_2.1_int8_convrot.safetensors` | `models/diffusion_models/` | [Download](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/diffusion_models/qwen_image_2.1_int8_convrot.safetensors?download=true) · [Comfy-Org model information](https://huggingface.co/Comfy-Org/Qwen-Image-2.1) |
| `qwen3vl_8b_bf16.safetensors` | `models/text_encoders/` | [Download](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/text_encoders/qwen3vl_8b_bf16.safetensors?download=true) · [Source](https://huggingface.co/Comfy-Org/Qwen-Image-2.1). Select `qwen_image` in CLIPLoader |
| `qwen_image_2.1_vae_bf16.safetensors` | `models/vae/` | [Download](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/resolve/main/vae/qwen_image_2.1_vae_bf16.safetensors?download=true) · [Source](https://huggingface.co/Comfy-Org/Qwen-Image-2.1) |
| `VNCCS_QI2_PoseStudioV1.1.safetensors` | `models/loras/` | [Download](https://huggingface.co/MIUProject/VNCCS_PoseStudio_QI2.1/resolve/main/VNCCS_QI2_PoseStudioV1.1.safetensors?download=true) · [Author's instructions](https://huggingface.co/MIUProject/VNCCS_PoseStudio_QI2.1). Pose LoRA, strength 1 |

You can select a BF16 diffusion model from the [official file list](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/tree/main/diffusion_models), then update the corresponding loader selection in the workflow. Do not rename another version to match this table. Replace weights only if damaged, downloaded as a web page, or a different version. A plugin update does not require redownloading every model.

The plugin requires **ComfyUI 0.36.0 or newer** with Qwen Image 2.1 support. If camera-change nodes are still missing, update to a core release that includes them and update the core requirements. Meeting the version number alone does not guarantee that all nodes and dependencies are installed.

### Additional camera-change models

Skip this table if you only need front poses. Camera changes require these **six files** in addition to the base models. Folders are relative to `ComfyUI/`. Download links point to files; source links provide model information.

| File | Folder | Download and source |
|---|---|---|
| `QI2.1_AnyAngle.safetensors` | `models/loras/` | [Download](https://huggingface.co/lilylilith/QI_2.1_AnyAngle/resolve/main/QI2.1_AnyAngle.safetensors?download=true) · [Source](https://huggingface.co/lilylilith/QI_2.1_AnyAngle) |
| `triposplat_fp16.safetensors` | `models/diffusion_models/` | [Download](https://huggingface.co/VAST-AI/TripoSplat/resolve/main/diffusion_models/triposplat_fp16.safetensors?download=true) · [Source](https://huggingface.co/VAST-AI/TripoSplat) |
| `triposplat_vae_decoder_fp16.safetensors` | `models/vae/` | [Download](https://huggingface.co/VAST-AI/TripoSplat/resolve/main/vae/triposplat_vae_decoder_fp16.safetensors?download=true) · [Source](https://huggingface.co/VAST-AI/TripoSplat) |
| `flux2-vae.safetensors` | `models/vae/` | [Download](https://huggingface.co/VAST-AI/TripoSplat/resolve/main/vae/flux2-vae.safetensors?download=true) · [Source](https://huggingface.co/VAST-AI/TripoSplat) |
| `dino_v3_vit_h.safetensors` | `models/clip_vision/` | [Download](https://huggingface.co/VAST-AI/TripoSplat/resolve/main/clip_vision/dino_v3_vit_h.safetensors?download=true) · [Source](https://huggingface.co/VAST-AI/TripoSplat) |
| `birefnet.safetensors` | `models/background_removal/` | [Download](https://huggingface.co/VAST-AI/TripoSplat/resolve/main/background_removal/birefnet.safetensors?download=true) · [Source](https://huggingface.co/VAST-AI/TripoSplat) |

Create `background_removal` manually if it does not exist. The three VAE files serve different purposes: the Qwen VAE is for image generation, while Flux2 VAE and the TripoSplat decoder are for reconstruction. They are not interchangeable. This workflow does not use `triposplat_vae_encoder_fp16.safetensors` and does not require Blender.

### Pose detection from photos: optional

DWPose below is the default. [SDPose](#sdpose-optional) can be selected manually and does not replace the existing detector.

The sequence is **Upload pose reference → Detect skeleton → Check the source overlay → Apply to current mannequin**. With two people, apply to the selected mannequin. A pose-reference photo does not replace the character photos used for generation. Built-in poses and imported OpenPose skeleton images do not require DWPose. Detection uses ComfyUI core's `PreviewAny` to retain raw keypoints, including cached results; no extra plugin is needed for that. Existing DWPose weights do not need to be downloaded again. After a frontend-only Fisher update, save edits and refresh with Ctrl+F5.

After installing `comfyui_controlnet_aux`, the plugin downloads detector weights on first detection. Fisher Pose prefers the following TorchScript files. Download them manually if offline or automatic download fails:

| File | Download | Default folder relative to ComfyUI |
|---|---|---|
| `yolox_l.torchscript.pt` | [Download](https://huggingface.co/hr16/yolox-onnx/resolve/main/yolox_l.torchscript.pt?download=true) · [Source](https://huggingface.co/hr16/yolox-onnx) | `custom_nodes/comfyui_controlnet_aux/ckpts/hr16/yolox-onnx/` |
| `dw-ll_ucoco_384_bs5.torchscript.pt` | [Download](https://huggingface.co/hr16/DWPose-TorchScript-BatchSize5/resolve/main/dw-ll_ucoco_384_bs5.torchscript.pt?download=true) · [Source](https://huggingface.co/hr16/DWPose-TorchScript-BatchSize5) | `custom_nodes/comfyui_controlnet_aux/ckpts/hr16/DWPose-TorchScript-BatchSize5/` |

If you changed controlnet_aux's `annotator_ckpts_path`, use that configured root and retain the author/repository subfolders. Available detector options vary by version; use the filenames actually requested in the console. Do not put detector weights in `models/loras`. This feature extracts the body skeleton only. Occluded joints and front/back depth may need manual adjustments.

### SDPose: optional

Required only when selecting SDPose detection. Existing generation/camera models and DWPose weights can be reused.

| File | Download | Folder |
|---|---|---|
| `sdpose_wholebody_fp16.safetensors` (1.92 GB) | [Official file](https://huggingface.co/Comfy-Org/SDPose/resolve/main/checkpoints/sdpose_wholebody_fp16.safetensors) · [Source and license](https://huggingface.co/Comfy-Org/SDPose) | `ComfyUI/models/checkpoints/` |

SHA256: `63d01f9a7494560693b24767f4469d59c9d3266b31ff0a253e74d1e611442721`. File size: 1,916,645,792 bytes.

ComfyUI core must provide `SDPoseKeypointExtractor`, `SDPoseDrawKeypoints`, `CheckpointLoaderSimple` and `PreviewAny`. No PZ plugin is required. If nodes are missing, update ComfyUI core/dependencies and restart the backend, then click Check models in the editor. Selecting SDPose enables the local SDPose checkpoint selector.

This entry extracts one person; use DWPose for multi-person references. Both detectors return raw keypoints that can be corrected in Edit keypoints before applying. SDPose is not guaranteed to be more accurate for every image. Frontend-only tool updates require saving edits and Ctrl+F5; a core update requires restarting ComfyUI.
