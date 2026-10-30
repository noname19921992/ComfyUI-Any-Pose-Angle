# User-feedback fix validation · 2026-10-10

This round addressed seven issue groups: framing, applying detections, camera behavior, pose generation, two-person depth positioning, body-asset loading and connection validation. Complex two-person extra limbs and proportion drift were explicitly outside scope and remain unresolved. Actual image generation, browser interaction and fault injection are distinguished below; successful execution is not treated as visual correctness.

| Feedback | Fix and observed validation | Boundary |
|---|---|---|
| Half-body or close-up becomes full-body | The front reference previously ignored zoom/pan. It now saves separate `framing` used in stage one. Preset changes and reopening preserve manual framing. Actual single-person half-body arm-raising and two-person close-up outputs were inspected | Aspect-ratio differences and the model can still affect cropping; no pixel-exact guarantee |
| Apply does nothing after detection reaches 100% | Complete skeletons use raw coordinates. Partial skeletons apply visible segments and preserve undetected parts. Real half-body detection produced and applied six usable segments. First/cached full-body detection, application and reopening passed. Four injected error types allowed retry and hid/disabled stale results | No usable limbs produces an explicit error without inventing missing bones; not every user's environment was reproduced |
| Camera angle does not change | Editor switch follows the actual workflow constant. Auto-fit updates camera matrices before measurement instead of using the previous frame. Disabling camera change preserves the chosen camera. Actual generation at 60°/25°, −65°/40° and 90°/0° was inspected | A 90° two-person side view can cause occlusion. Single-image reconstruction and repainting are not true geometry recovery |
| Pose remains the source pose | Tested a single person changing from standing to raised arm, and a group photo changing to waving/hand-on-hip. Camera-only changes preserve the front pose string and seed, allowing reuse of the front result | Complex poses, clothing and identity details are not guaranteed; see the existing single/two-person comparisons |
| No depth placement for two people | Added per-character depth sliders. Positions 1.5/−1.5 survived character switching, saving and reopening, and entered mannequin rendering | Final character depth still depends on model interpretation |
| Asset exists but is reported missing | Added an extensionless body-asset route with a loading timeout; static fallback occurs only on 404. A real restarted backend returned 206 to Range requests. The new route loaded even when static `.bin` requests were blocked. Network, HTTP, parsing and actual missing-file errors are distinct | IDM itself was not installed/tested; equivalent request behavior was checked with browser fault injection |
| `tuple index out of range` for `pose_json` | The actual ComfyUI service produced the same type of 400 validation error for an invalid output slot. After the frontend repaired known Fisher connections, execution succeeded. Current backend schemas are checked before queuing | The viewer screenshot did not show every connection, so this is not claimed as the only cause. Unknown sources are not repaired by guessing |

Photo source selection was also corrected: LoadImage's selected filename takes precedence over an outdated preview. A test kept an old group-photo thumbnail while selecting a new single-person file; detection read the new file and passed the full-body regression.

## Repeated camera changes: cause and evidence

Auto-fit measures the front view and then the final camera. Previously, changing the camera position did not immediately update its world matrix, so projection could still use the previous rendered angle. Switching from 60° to −65° changed character scale from about 1.374 to 0.494; saving changed it again, invalidating the front cache. Camera matrices are now updated before all measurements.

`camera_pose_stability.js` failed before the fix. Afterward, tests covered 60°/25°, −65°/40°, 90°/0° and 0°/55°, waiting for the actual debounce/preview, applying and reopening. Character transforms and front-pose cache data stayed unchanged. Turning camera change off/on under auto-fit also preserved camera position, orientation, zoom and pan.

For the second actual camera-change job, history confirmed cache reuse for front sampling, decoding, background removal and TripoSplat sampling. Both front previews referenced the same file. Only camera rendering and repainting reran, taking about 55 seconds. Front images, coarse renders and final outputs were inspected separately; elevated side and pure side views were visibly different.

Local validation outputs are in `ComfyUI/output/fisher_feedback_oct10/`:

- `half_body_guides_00001_.png`: single-person half-body raised arm; same-seed skeleton-instruction comparison.
- `duo_crop_00001_.png`: two-person close-up, without reverting to full-body framing.
- `duo_angle60_00001_.png`: 60°/25°.
- `duo_angle_minus65_00001_.png`: −65°/40°.
- `duo_angle90_00001_.png`: 90°/0°, reusing the previous front image and reconstruction.

These are local test outputs and are not distributed with the plugin. The skeleton-reference instruction was active in an actual two-person job after restarting. It does not guarantee that every style avoids copying guide lines.

## Reproducible checks

- `tests/e2e/feedback_fixes.js`: framing, presets, two-person depth, switches, save/reopen and API branches.
- `tests/e2e/camera_pose_stability.js`: repeated camera changes and off/on under auto-fit; front-cache checks.
- `tests/e2e/detect_person_pose.js`: real first/cached DWPose detection, coordinates, application, reopening and isolation of the second character.
- `tests/e2e/detection_recovery.js`: missing joints, empty people, invalid JSON and backend errors injected into real detection results; retry/application checks.
- `tests/e2e/body_pack_loading.js`: actual new route plus blocked static files, network interruption, HTTP 500, HTML substitution and all-404 cases.
- `tests/e2e/pose_link_recovery.js`: real service rejects an invalid slot; execution succeeds after frontend repair.
- Python: 20 free-pose encoding, nine Qwen bridge, 23 AnyAngle and two body-file route tests passed.
- JavaScript: framing, raw/partial skeletons, body files/timeouts, links, switches, photo-input switching, backend capabilities, caching and 3D-depth estimation passed regressions.

Browser checks used isolated windows and did not overwrite the user's workflow or photos. The original terminal headless runner stalled during body loading, so an isolated browser was used instead. ComfyUI core was not modified to conceal the issue.

## Updating

No model downloads are required for this round. Continue using `【Work-Fisher】无限姿势+无限视角（支持双人）.json`. Update the plugin, restart the ComfyUI backend, then refresh the page. Refreshing alone does not load updated Python routes or prompts; an already-open editor also keeps its previously loaded JavaScript.
