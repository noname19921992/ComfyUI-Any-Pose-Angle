# User guide

[Home](../README.md) · [Installation and model downloads](installation.md)

See [feedback fix validation](feedback-validation.md) for the framing, skeleton-application and camera-switch checks.

For optional SDPose detection, 2D keypoint editing, reference overlays, body presets, generation history and continued editing, see [pose assistance tools](pose-toolkit.md). DWPose remains the default; SDPose is an optional download.

The interface follows **Settings → Language** in ComfyUI, including node names/ports, editors, status messages and generation history. Switching preserves current edits, workflow data and custom prompts. After upgrading, restart ComfyUI and refresh once to load node translations.

## What the plugin does

| Mode | Node | Purpose |
|---|---|---|
| Free pose | Fisher Qwen 2.1 Free Pose | Edit one- or two-person poses with the VNCCS mannequin and generate through Qwen Image 2.1 |
| Pose + new camera | Free Pose + Fisher AnyAngle Camera | Generate the front pose, reconstruct it with TripoSplat, then repaint the editor's camera view with AnyAngle. Camera changes run when needed; only the final result is saved |
| Mannequin reference only | Fisher Mannequin Pose Image (Universal) | Output a mannequin image and prompt without CLIP/VAE, for connection to an image-editing workflow |
| Original free-angle mode | Fisher Qwen 2.1 Character & Pose Encode / Fisher Pose & Camera | Shared camera and independent poses/positions for 1–3 people, with Chinese edit instructions and optional PE expansion; see the [detailed free-angle guide](自由视角详细说明.md) |

## Free-pose controls

- **Group photos for two people**: upload a full two-person photo and click Second character. Source-left maps to mannequin 1 and source-right to mannequin 2 by default; use Character assignments to swap them. The complete photo is sent as image2 without cropping. Prompts describe the source-to-mannequin mapping. Moving mannequins or rotating the camera does not reassign identity. Two individual photos are an optional mode; only that mode uses `reference_image_2`. Group-photo mapping depends on prompt interpretation rather than face locking.
- **Human-proportioned mannequins**: the MakeHuman mannequins from [VNCCS Pose Studio](https://github.com/AHEKOT/ComfyUI_VNCCS_Utils) match the mannequin used to train the LoRA.
- **Drag joints**: drag hands, feet and hips for IK. Hold a joint to show rotation rings. Click other joints to select and adjust them.
- **Detect poses from photos**: upload a pose reference, select Detect skeleton, inspect the keypoint overlay and click Apply to current mannequin (Apply to character 1/2 for two people). Raw DWPose coordinates are used directly, including cached results. This action does not replace character photos in the generation workflow. The skeleton import below is for OpenPose images only. Detection requires [comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux).
- **Match source image by default**: preserve 2D limb directions while adapting to mannequin bone lengths, rather than interpreting body-proportion differences as a turn or bent leg. Select Estimate 3D depth under Depth correction when depth is needed. The mode is saved with the pose. Neither mode uniquely recovers a true 3D action from one image.
- **One-click OpenPose posing**: click a colored skeleton image to apply it. A 2D skeleton does not contain front/back information; the plugin estimates depth from apparent bone shortening. Flip the torso or individual limb segments if the estimate is wrong.
- **Common Poses**: 29 everyday poses such as standing, sitting, kneeling, squatting, walking, running, hands on hips, arms crossed, waving, saluting, side and back views. These use 3D directions and adapt to current bone lengths instead of estimating depth from a 2D skeleton.
- **Fisher Bonus Poses**: 209 built-in skeleton images, including standing, sitting, kneeling, squatting, lying, splits and suspended poses, ready to select.
- **My Library**: select your skeleton images once to retain them for the next session.
- **My Poses**: save the current pose, including shape, proportions, position and hand gestures by default. Disable Include body proportions if desired. Click a thumbnail to restore it, including across workflows. Poses are stored under `ComfyUI/user/default/fisher_pose/poses/`, one JSON file per pose, and can be copied to another installation.
- **Skeleton reference**: enable the toggle below the editor viewport to retain yellow joint markers and colored skeleton lines in mannequin and camera-reference images. It defaults to on each time the editor opens and can be disabled for the current editing session. The mannequin image is also the model's pose reference.
- **Editable system prompt**: expand References & prompts to edit System prompt. With one person and skeleton reference enabled, the default contains the repose instruction and the instruction to omit skeleton lines/joints from the result. Custom text is used as-is, followed by Additional requirements. It no longer changes automatically with character count or the skeleton toggle. Restore defaults resumes automatic instructions. Apply to save it with the workflow. Both Fisher Qwen 2.1 Free Pose and Fisher Mannequin Pose Image (Universal) use this setting.
- **Auto-fit full body**: enabled by default. Pose and camera changes fit all characters with a margin. For half-body shots or close-ups, manually zoom/pan in the front view to turn auto-fit off. This framing affects the first-stage reference even with camera changes disabled. Pose changes and reopening preserve manual framing. Fit now restores a full-body view.
- **Two-person depth placement**: select a character and use Depth under Position & orientation. Each character's position is stored independently and survives switching/reopening. It affects reference perspective and occlusion; the final image still depends on the model.
- **XYZ movement axes**: switch to Move character · XYZ in the top-left viewport controls. Drag red X for horizontal, green Y for vertical and blue Z for depth movement. Only the active character moves; sliders stay synchronized. Dragging turns auto-fit off and supports undo/redo and saving. In a front view, Z can align with the viewing direction; Orbit for axes makes it easier to drag without changing the output camera. Switch back to Pose joints to continue posing. Axes are excluded from reference output.
- **Pose / Camera**: orbiting while posing does not change the output camera. In Camera mode, drag to set the view, scroll to zoom and right-drag to pan. The preview shows the output framing. The VNCCS front pose reference is retained internally; camera rotation uses the camera-change pipeline automatically.
- **Hand gestures**: open, flat and fist presets plus a grip-strength slider.
- **Proportions**: independently adjust head, neck, shoulders, torso, upper arms, forearms, thighs and lower legs. The pose is preserved.
- **Independent sizes**: set mannequin image size in the editor. The workflow's Output width and Output height integer constants control only the final generation size, from 64 to 4096 in multiples of 16. The editor reads these constants to display the final dimensions.
- **Immediate preview**: Apply only or Apply & generate shows the mannequin on the node immediately, without running the workflow first.
- **Small workflows**: mannequin images are stored as files under `ComfyUI/input/fisher_pose/` instead of embedding base64 PNGs in workflow JSON.
- **Match the character aspect ratio**: a new pose adopts the connected character photo's ratio. Use Character photo under Mannequin image size to restore it later.

## Character input modes

The current workflow connects two individual photos by default, with two mannequins, independent width/height and the camera-change switch. All nodes are expanded.

| Mode | Operation |
|---|---|
| Two individual photos, the workflow default | Upload photos for Character 1 and Character 2. Keep Two individual photos selected in the editor. Photo 1 maps to mannequin 1; photo 2 maps to mannequin 2 |
| One group photo | Upload the full group photo for Character 1. Disconnect `reference_image_2`, then remove or disable the second LoadImage node. Select One group photo in the editor, keep two mannequins and apply |
| One person, switching from two individual photos | Bypass or mute either photo node. Opening the editor or running automatically uses the active photo and its mannequin; no manual mannequin removal or rewiring is needed |

The published workflow embeds the two-person mannequin reference and camera preview. Importing does not require files from the author's `input/fisher_pose/`. Applying a new pose stores local image files as usual. If a workflow is shared without its referenced files, the recipient can open the editor and apply again to rebuild the mannequin reference.

Switching is repeatable: photo 1 alone uses character 1; photo 2 alone uses character 2; re-enabling both restores both mannequins. The inactive person's pose is retained in workflow state. Single-person editing updates only the active person; restoring both preserves the previous two-person placement. Count changes automatically open the editor, recapture and apply before queuing continues. With both photos disabled, generation asks for at least one enabled photo. A full group photo continues using One group photo mode, with the user keeping two mannequins.

The ComfyUI browser extension performs this switching. Direct API clients must provide a reference with the correct character count and connect the sole character photo to required `reference_image`. If an old workflow manually removed character 2 without saving its pose, re-enabling the second photo creates a default mannequin; lost pose data cannot be recovered.

Two-individual-photo generation has been checked with open arms and waving. Those major actions can follow the references; complex raised-leg or held-object poses may still differ. Mapping is prompt guidance and does not guarantee exact identity, clothing or every limb position.

## New camera views: AnyAngle

Use `workflows/【Work-Fisher】无限姿势+无限视角（支持双人）.json`. Choose character photos, click Edit pose & camera, set poses, switch to Camera if needed and choose the angle, then Apply & generate. Apply only saves changes for a later ComfyUI run.

The camera-change switch above the workflow is off by default:

- **Off · Pose only**: generate the front pose without reconstruction or AnyAngle. The saved camera is retained.
- **On · Full pipeline**: reconstruct the subject and generate the saved camera view. If the camera is still front-facing, unnecessary camera-change processing is skipped.

Generate with camera change in the editor's Camera panel follows the same workflow switch. When off, the preview uses the actual front framing; rotation is retained for re-enabling. The switch and width/height constants use built-in ComfyUI nodes, without extra group-bypass plugins. Front-view zoom/pan directly affects the pose reference and does not start camera reconstruction. Horizontal or vertical camera rotation requires the switch. Reset front view resets camera rotation and close-up framing.

Generation controls sit at the top. Seven colored processing areas below organize the expanded nodes: model loaders on the left; character inputs, pose/camera, front generation and final output across the top; reconstruction and new-view generation below. The lower areas usually need no manual changes. They are disabled when camera change is off or the view is front-facing, while nodes remain expanded. Long cross-area connections use native reroutes.

- **Front poses without camera models**: when the switch is off or the camera is front-facing, camera-change nodes are muted (gray). ComfyUI neither runs nor validates them, so the [additional camera models](installation.md#additional-camera-change-models) are unnecessary. Enable the switch and choose a new angle to restore them.
- **Change only the camera**: the Fisher Camera node stores the view independently. With the first-stage seed fixed, camera-only edits reuse the front result and 3D reconstruction, rerunning only the camera stage.
- **Another variation**: when pose and camera are unchanged, Apply & generate chooses a new front-stage seed.
- Camera-change output matches the front result's size, controlled by node width/height. If the camera stage fails, the front result remains available in its preview node.

Older workflows and the universal mannequin node still support posing. Camera controls explain why they are unavailable when the full generation chain is missing. Open full workflow loads the current workflow from an older ComfyUI workflow; select character photos afterward. AIFISHER Canvas currently uses the existing pose-image interface without camera generation or direct queuing here.

<details>
<summary>Camera-change encoding and sampling settings</summary>

Fisher Camera Change Encode takes the front result, coarse render, CLIP and VAE. It encodes front = `image1`, coarse render = `image2`. The workflow uses CFG 1, 25 steps and fixed camera-stage seed 42. Seed 0 produced overexposure in an earlier comparison; this does not establish that every other seed is safe. Reconstruction removes the background first and does not reconstruct the complete original scene. Rear and occluded surfaces are inferred. The mannequin preview guides framing, not pixel-exact output.

TripoSplat predicts geometry and a source camera for each image; reconstructed fronts cannot all be assigned one fixed world angle. The camera stage reads the source camera from the TripoSplat sampler's `latent`, then applies the editor camera position and orientation, including frame orientation under elevation. Decoded `splat` alone lacks that camera information, so `camera_latent` must be connected separately. Accuracy still depends on single-image reconstruction and is not a measured camera calibration.

See [camera calibration validation](camera-validation.md) for reproduction, tested scope and limitations.

If the result disagrees with the mannequin preview, compare the front result and the coarse-render reference first. Pose errors in stage one and inferred depth/two-person placement in reconstruction propagate into the camera stage. Reversing the sign of camera angles alone does not fix them.

</details>

## Troubleshooting

| Symptom | Cause and action |
|---|---|
| After disabling a photo, the result keeps the source photo's pose | An older single-person instruction failed to follow the mannequin. Update the plugin, restart the backend and refresh. The new instruction and photo-driven mannequin switching address this reproduced case. Existing workflows/models remain usable. See [comparison tests](single-validation.md) |
| Large camera turn still looks frontal, or a missing-source-camera error appears | Update the plugin and workflow, then restart the backend. The old fixed world-angle reference was replaced by each reconstruction's predicted camera. In old workflows, add TripoSplat sampling `latent` → coarse-render `camera_latent`. No new weights are required |
| VAE loading fails, logs include `lora key not loaded`, or output is identical to the character photo | Core/model/LoRA versions may be incompatible; inspect the complete log. Check Qwen Image 2.1 support. Portable installations can run `update/update_comfyui.bat`; Git installations can use `git pull`. Update to 0.36.0 or newer |
| Editor does not open, or reports `Failed to load Pose Studio MakeHuman asset: HTTP 404` | Plugin files are incomplete, commonly after a cloud-drive download. Download the complete repository and verify `web/vnccs/assets/pose_studio_makehuman.v2.bin` (about 86 MB) exists |
| Body asset exists but loading is interrupted | Check whether IDM, a proxy or download manager intercepts local requests. The new extensionless route distinguishes missing assets, interruptions and parsing failures. Restart the backend to load the route; an old service falls back to static files |
| Detection reaches 100%, but Apply appears inactive | Read the status beside the detection controls. Partial photos with missing ankles or other joints apply only usable limb segments and preserve the rest. No usable segments produces a clear message. Progress does not mean all joints were found; other causes require the image and log |
| `pose_json` validation reports `tuple index out of range` | One reproduced cause is a saved link to a nonexistent output index. The frontend repairs known Fisher pose links and validates against the running backend schema before queuing. If it persists, provide the workflow and full log; this exception alone does not identify the cause |
| Mannequin image file is missing | Files in `input/fisher_pose/` may be absent after moving machines or clearing input. Open the editor and Apply only to regenerate them |
| Extra hands or legs | Match the mannequin ratio to the character photo using Character photo under Mannequin image size, and fit the mannequin to fill the frame. Use full-body character photos; a portrait alone gives the model no body reference |
| Two people swap sides after a pose edit | Update, restart and refresh. Older group instructions inverted the UI labels. The inverse compensation was removed. Each editor opening defaults to source-left = character 1 and source-right = character 2; assignments can be swapped for the session. Check the front result first because camera changes inherit it. This is prompt following, not identity locking |
| Two mannequins generate three people, or keep the original group pose | The old two-person instruction duplicated characters in actual samples. It now keeps the VNCCS trigger and explicitly reposes the existing pair. Restart the backend after updating; existing workflow links can stay. Check the front result first. Camera changes cannot remove first-stage duplicates. See [controlled comparisons and remaining limits](duo-validation.md); occasional success with another seed is not evidence of a stable fix |
| Backend has not loaded the two-person assignment fix | The service connected to this browser has not loaded the update. Save, fully quit/restart that ComfyUI service, then refresh. If multiple ports are running, check the current address. Updating files, refreshing or reimporting a workflow does not reload Python. Group-photo queuing checks backend capability and stops if the running service is outdated |

## Known limitations

- Free-pose mode supports at most two people. Two-person pose following is less stable in current samples. Broad movements such as waving, pointing and extending arms are easier than subtle hand-on-hip changes. When importing a multi-person OpenPose image through the basic skeleton-gallery path, only the largest person is used; the detection tools provide explicit person selection.
- A 2D skeleton cannot uniquely determine depth. Match source image preserves projected directions, not true depth. Occlusion, side views, clothing and differences between illustrated and human proportions can cause errors. Check detection over the source, then adjust the mannequin. Head orientation, fingers and foot orientation are not read from the skeleton. Partial detections apply visible limbs only and cannot switch to Estimate 3D depth.
- Skeleton guides are visual model inputs. The prompt states that colored lines and joints are guides only. A same-seed sample removed copied guide lines, but this is not guaranteed for every style/action. Inspect complex two-person extra limbs, identity changes and proportion drift at each stage; successful execution does not establish image quality.
- The mannequin supplies pose only. If reference and final output ratios differ greatly, the model decides the characters' image positions.
