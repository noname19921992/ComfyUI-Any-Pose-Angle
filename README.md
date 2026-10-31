<div align="center">

# Fisher Pose

**Set the pose. Set the camera.**

Edit one- or two-person poses in ComfyUI and generate the corresponding images with Qwen Image 2.1.

[Download plugin](https://github.com/noname19921992/ComfyUI-Any-Pose-Angle/archive/refs/heads/main.zip) · [Download workflow](https://raw.githubusercontent.com/noname19921992/ComfyUI-Any-Pose-Angle/main/workflows/ComfyUI%20Qwen%20Image%202.1%20Any%20Pose%20and%20Angle.json)

[Installation & models](docs/installation.md) · [User guide](docs/usage.md)

[Pose assistance tools](docs/pose-toolkit.md): optional SDPose detection · keypoint editing · reference overlays · separate body-shape presets · generation history comparison

</div>

## Demo

https://github.com/user-attachments/assets/24dc201a-d9dc-4ac7-86a8-acc9d8f6dd7c

<sub>Free-pose demonstration. See below for two-person and camera-change examples.</sub>

## From pose to image

### One person: skeleton, mannequin and result

Choose a skeleton or drag the mannequin's joints, then generate the pose using a character photo.

<img src="docs/images/hero.jpg" alt="Left: OpenPose skeleton; center: mannequin pose; right: generated result" width="100%">

<details>
<summary>Full comparison: skeleton, mannequin, character reference and result</summary>

![Full pose comparison](docs/images/showcase-v2.jpg)

</details>

### Two people: one group photo, independent poses

Upload the full group photo and add a second character in the editor. Pose each mannequin independently; swap character assignments in the right panel when needed.

<table>
<tr>
<th width="30%">Group photo</th>
<th width="30%">Two-person pose</th>
<th width="40%">Generated result</th>
</tr>
<tr>
<td align="center"><img src="docs/images/duo-reference.png" alt="Full group photo used as the character reference" width="230"></td>
<td align="center"><img src="docs/images/duo-pose.png" alt="Left mannequin with arms extended; right mannequin waving" width="230"></td>
<td align="center"><img src="docs/images/duo-result.png" alt="Generated result following the two-person pose" width="320"></td>
</tr>
</table>

<sub>The full group photo is used without manual cropping. Identity mapping depends on the model; complex occlusions and subtle poses may need adjustments.</sub>

### Multiple views: keep the pose, change the camera

Generate the front pose first, then change the camera with AnyAngle. The labels below show the camera angles set in the editor.

<table>
<tr><th width="33%">Front</th><th width="33%">45° right</th><th width="33%">90° right</th></tr>
<tr>
<td><img src="docs/images/angle-front.png" alt="Front pose result" width="280"></td>
<td><img src="docs/images/angle-45.png" alt="Result with the camera set to 45 degrees right" width="280"></td>
<td><img src="docs/images/angle-90.png" alt="Result with the camera set to 90 degrees right" width="280"></td>
</tr>
</table>

<sub>Actual generated results. Camera and pose matching is not pixel-exact; hidden and rear surfaces are inferred by the model. Camera changes require additional models.</sub>

## Get started in three steps

| 1 · Choose characters | 2 · Pose and set the camera | 3 · Apply and generate |
|---|---|---|
| Upload one character photo by default; connect the second input for two individual photos | Choose presets and drag joints; switch to Camera when needed | Check the camera preview, then generate |

Follow the [installation guide](docs/installation.md), then import the single current workflow: [ComfyUI Qwen Image 2.1 Any Pose and Angle](<workflows/ComfyUI Qwen Image 2.1 Any Pose and Angle.json>).

- **Single-person default**: the first photo is connected; the second LoadImage is present but disconnected. Upload your photo, open the editor and apply once to create local mannequin and camera references. See [character input modes](docs/usage.md#character-input-modes) for two-person setup.
- **Camera change off**: generate only the front pose, using the base models.
- **Camera change on**: run the full pipeline using the saved camera. Camera-only changes reuse the previous front result and 3D reconstruction.
- **Output size**: the two integer constants above the workflow control width and height independently of the editor's mannequin image size.
- **Generate another variation**: with pose and camera unchanged, Apply & generate updates the front-stage seed.

<details>
<summary>Editor layout and controls</summary>

![Editor layout from an earlier release; refer to the current interface for button names](docs/images/studio-editor.jpg)

Choose poses on the left, edit mannequins in the center, and adjust camera, joints, body shape and proportions on the right. Orbiting empty space in Pose mode changes the editing view while preserving the output camera.

[Full user guide](docs/usage.md)

</details>

## Features

| Pose editing | Camera & framing | Assets & reuse |
|---|---|---|
| Independent editing for one or two people | Front, side, high and low views | 29 common poses |
| Joint dragging, hand gestures and body proportions | Separate editing view and output camera | 209 built-in skeleton images |
| Photo → keypoint preview → apply pose | Auto-fit, zoom and pan | Saved poses and a personal library |
| Skeleton reference enabled by default | Independent reference and output sizes | Mannequin preview immediately after applying |

The interface follows ComfyUI's language setting and supports English and Chinese. Photo detection requires the optional DWPose plugin and weights. [Dependencies and downloads](docs/installation.md#pose-detection-from-photos-optional)

## Installation and downloads

| Task | Start here |
|---|---|
| First installation | [Plugin and environment setup](docs/installation.md#installation-and-dependencies) |
| Generate one- or two-person poses | [Four base models and their folders](docs/installation.md#base-generation-models-required-for-one-or-two-people) |
| Generate new camera angles | [Six additional camera-change models](docs/installation.md#additional-camera-change-models) |
| Detect poses from photos | [Detection plugin and two detector weights](docs/installation.md#pose-detection-from-photos-optional) |
| Upgrade an existing setup | [What to update and which models to reuse](docs/installation.md#upgrading-what-needs-to-be-downloaded-again) |

**After updating the plugin, import the current workflow, restart ComfyUI and refresh the browser.** Complete model files of the same version can be reused.

The camera calibration update requires the new workflow's `camera_latent` connection. It addresses cases where the reconstructed view disagrees with the preview or remains near the front despite a camera change. See [upgrade instructions](docs/installation.md#upgrading-what-needs-to-be-downloaded-again).

[Troubleshooting](docs/usage.md#troubleshooting) · [Known limitations](docs/usage.md#known-limitations) · [Original free-angle mode](docs/自由视角详细说明.md)

## Credits

Free-pose mode builds on the following open-source projects:

- **[VNCCS Utils](https://github.com/AHEKOT/ComfyUI_VNCCS_Utils) · [MiuProject / AHEKOT](https://github.com/AHEKOT)**: the Pose Studio mannequin core (`PoseViewerCore`, IK and capture), MakeHuman body-pack loading, hand presets, and the **[VNCCS PoseStudio QI2.1 LoRA](https://huggingface.co/MIUProject/VNCCS_PoseStudio_QI2.1)** with its training convention: mannequin = image1, character = image2, `Draw character from image2`. These components make free-pose mode possible. The MIT-licensed code is distributed in `web/vnccs/`; local changes are listed in its README. Please consider supporting the original repository.
- **[MakeHuman](http://www.makehumancommunity.org/)**: body meshes and shape data, CC0 1.0.
- **[Qwen Image 2.1](https://github.com/QwenLM/Qwen-Image-2.1)**: image generation and the [prompt_rewrite](https://github.com/QwenLM/Qwen-Image-2.1/tree/main/prompt_rewrite) editing conventions used by free-angle mode.
- **[three.js](https://threejs.org/)**: 3D rendering, MIT.
- **[ControlNet](https://github.com/lllyasviel/ControlNet)**: OpenPose skeleton colors and connection order.
- **[ComfyUI-qwenmultiangle](https://github.com/jtydhr88/ComfyUI-qwenmultiangle)**: camera angle bins and terminology.
- **[QI 2.1 AnyAngle](https://huggingface.co/lilylilith/QI_2.1_AnyAngle) · lilylilith**: camera-change LoRA; **[TripoSplat](https://github.com/VAST-AI-Research/TripoSplat) · VAST**: single-image 3D Gaussian splat reconstruction; **[AnyAngle Studio · T8](https://github.com/T8mars/Comfyui-Qwen-Image-2.1-MultiAngle-T8)**: reference for AnyAngle image order and usage.
- **[ComfyUI](https://github.com/comfyanonymous/ComfyUI)**: the host platform.

<details>
<summary>License information</summary>

## License

- Plugin code: [MIT](LICENSE).
- `web/vnccs/`: VNCCS Utils (MIT, © 2025 MiuProject), MakeHuman body pack (CC0 1.0), and three.js (MIT).
- `web/editor/vendor/`: three.js (MIT).
- Follow the individual licenses of the LoRA and base models you use.

</details>
