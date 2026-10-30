# Camera calibration validation · 2026-10-08

## Cause

In the two-person sample, the editor was set to approximately −50° and the camera branch executed successfully, but the final result remained close to the front view. The old code treated the reconstructed front as a fixed 90° world azimuth instead of reading the source camera predicted by that reconstruction.

TripoSplat sampling returns a geometry latent and a `[dx, dy, dz, k, w]` camera token. ComfyUI's `VAEDecodeTripoSplat` decodes only geometry; its SPLAT output does not retain the camera token. See the [official training implementation](https://github.com/runjie-yan/TripoSplat-Training/blob/master/deg/utils/render_utils.py) for the camera format.

The sample's source azimuth was about 53°. The old conversion placed the requested −50° view at a world angle of about 40°, close to the source view. The updated implementation reads the camera from the same sampling result, converts it to renderer coordinates and applies the editor camera relative to it. A quaternion transfers the full orientation, including the effect of source-camera elevation.

## Validation

- Passed 23 unit tests covering different source cameras, positive and negative turns, 180°, elevation, frame orientation, size, zoom, invalid inputs and branch selection.
- Loaded, saved and reopened the updated workflow in the actual ComfyUI frontend. Confirmed that `camera_latent` and SPLAT decoding use the same sampling result.
- Reran the original two-person request with unchanged photos, pose, models, seed and approximately −50° camera parameters after adding the camera input. The man turned sideways and the pair's perspective changed with the coarse render.
- Tested the same pair at −90° side view and 45° elevation. The results changed in the corresponding directions. Execution history confirmed reuse of the front image, TripoSplat sampling and decoding; only the camera branch reran.

These checks validate the camera reference frame and data flow, not measurement-grade angular accuracy in generated images. The first-stage pose already differed from the target, and single-image reconstruction infers hidden surfaces and relative depth between people. AnyAngle can change details or limbs. Subsequent camera changes inherit these errors.
