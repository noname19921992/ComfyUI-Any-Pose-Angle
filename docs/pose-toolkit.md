# Pose assistance tools

[User guide](usage.md) · [Model downloads](installation.md#sdpose-optional)

Inspired by the pose assistance tools in [ComfyUI-PZ-EasyUse](https://github.com/prinzer/ComfyUI-PZ-EasyUse), these tools are integrated into Fisher's two-person editor. No second editor is required. Fisher's character assignments, XYZ controls, separate camera and two-stage generation pipeline are preserved.

## Detection and correction

After uploading a pose reference, select **DWPose** or **SDPose**. DWPose remains the default. SDPose requires optional weights and a ComfyUI core that provides the SDPose nodes.

- **Detect skeleton**: preview keypoints over the source image before applying.
- **Detect and apply**: apply detection directly to the active character; the photo used for generation is preserved.
- **Edit keypoints**: drag body joints, add/delete points, undo or reset. Import/export OpenPose JSON with canvas dimensions, or download a black-background skeleton PNG. Save corrections, then apply.
- **Multiple people in a reference**: when DWPose returns multiple people, select one to apply to the current mannequin. This SDPose entry extracts one person from the full image without multi-person detection boxes; use DWPose for group photos.

Raw body coordinates retain decimal precision throughout the process. The rendered skeleton PNG is not detected again. The tool edits body joints, not face or finger keypoints. Occlusion and depth still need manual confirmation.

## Body shape and comparison

**Estimate body proportions** is an explicit action and does not run by default. It makes limited, undoable adjustments from visible limbs without inferring head direction or moving the character or camera. Perspective foreshortening in a single 2D image prevents this from being a true body measurement.

**My Body Shapes** stores only shape and bone proportions. Applying a preset preserves the pose, position, other character and camera. Up to 30 presets are stored in the current browser and are lost if browser data is cleared. **My Poses** remains stored on the ComfyUI server. Disable Include body proportions to keep the current character's shape when loading a pose.

The camera panel's **Reference overlay** can display a character photo, pose reference or chosen image with adjustable opacity. The complete image keeps its aspect ratio inside the output frame. It is an editing aid and is excluded from mannequin references, camera previews and final output.

## Generation history and continued editing

Click **Generation history & comparison** on the Fisher Free Pose node. It reads final SaveImage outputs associated with this node from ComfyUI's latest 100 history jobs, showing up to 60 results alongside the actual input photos from each job. Detection previews are excluded.

With exactly one active character photo, **Use as next character photo** copies the result to `input/fisher_history/` and replaces that photo; Undo replacement is available. With two individual photos enabled, history provides comparison only, avoiding replacement of one person's identity photo with a two-person result. It does not queue generation or silently replace inputs.

History depends on the records currently retained by ComfyUI and may disappear after a restart or history clear. Saved image files are not deleted by this.

## Validation boundaries

Real ComfyUI checks covered SDPose/DWPose detection, mouse-driven keypoint edits, isolation between characters after applying, body presets, pose-only saves, and exclusion of overlays from output. XYZ dragging, undo/redo, save/reopen, side/high camera views, camera switches and front-stage caching passed regression checks. Automated checks are in `tests/test_pose_toolkit.mjs`.

The source branch's head-direction inference and image-order prompt changes were not adopted. These checks validate the tools and interactions; they do not solve extra limbs, identity confusion or proportion drift in the generation model.
