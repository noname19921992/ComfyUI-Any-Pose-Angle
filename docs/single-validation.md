# Single-person pose validation · 2026-10-08

## Reproduction and diagnosis

In the two-individual-photo workflow, the second LoadImage was bypassed and character 2 was removed in the editor. The remaining mannequin had open arms, but the front result stayed close to the source photo's standing pose.

The actual API request already excluded `reference_image_2`, the saved state had no two-person mannequin, and the encoder received the single mannequin image followed by the first character photo. The pose reference was front-facing; the node's high-angle thumbnail was a separately saved final-camera preview. The failure occurred during front generation, not from a stale second photo or the camera-change stage.

## Prompt comparisons

Fixed inputs: full-body character photo in a white shirt, open-arm mannequin with skeleton guides, seed 20260930. Models and sampling: Qwen Image 2.1 int8 convrot, VNCCS_QI2_PoseStudioV1.1 at strength 1, Qwen3-VL 8B, Qwen Image 2.1 VAE, 25 steps, CFG 1, Euler / simple. The mannequin was 1024×768; output remained 1024×1024. All three comparisons used the same core encoder, reference order and sampling settings.

| Instruction | Actual result |
|---|---|
| Only `Draw character from image2` | Kept the original standing pose; arms did not open |
| Previous long single-person instruction, retested unchanged | Kept the original standing pose; arms did not open |
| Keep the trigger and explicitly repose the person in image2 to match image1 | One person with open arms; white shirt and black trousers retained |

The updated instruction is identical in frontend and backend:

```text
Draw character from image2. Repose the person in image2 to match image1. Preserve their appearance and the scene.
```

This establishes that task wording affected pose following in this sample. It does not establish the model's internal mechanism or success for every action. Group-photo and two-individual-photo instructions were unchanged by this revision.

## State regressions

Passed 19 Python tests, including switching back to one person after encoding two, retaining a legacy `referenceMode=separate` field, and changing mannequin references repeatedly. Single-person runs encode only two references; removed characters do not enter subsequent encoding.

A real headless-browser test bypassed photo 2, removed character 2, applied open arms, saved and reopened the state, then applied a wave. Neither API request included photo 2. Capture files changed with the pose, and the single-person/bypass states survived reopening. This test did not queue generation or modify the user's saved workflow.

Symmetric switching for two individual photos was then added. Active photos are determined from the actual API inputs, each mannequin's pose is retained, and count changes trigger recapture. With only photo 2 enabled, that photo is routed to the required character input for the current API request without changing workflow links. Enabling both restores both mannequins. Group-photo behavior is preserved.

Eight input-switching unit tests cover both directions, direct switching between single photos, restoring two-person positions, legacy single-person data, preserving group mode, and rejecting zero active photos. A real browser tested: pair → photo 1 only → photo 2 only → pair → mute photo 1 → mute photo 2 → pair. Each step saved and reloaded the workflow and checked actual photo inputs, local bone rotations and offsets, character numbers, capture files and saved data. Finally, both photos were disabled to verify a clear error before queuing. World-space IK handles move during auto-framing and were not used as evidence that the pose stayed unchanged.

Automatic capture uses the editor's existing rendering/upload path. Closing releases WebGL, model resources and timers so repeated switching does not retain closed editors' rendering resources. Failed or canceled capture stops queuing.

## Actual generation after the fix

After restarting, the native Fisher nodes were tested without bypassing their encoder or image-input logic:

| Scenario | Seed | Observed result |
|---|---|---|
| Original failing open-arm male mannequin | 20260930, 42 | Both runs produced one man with open arms |
| Change the editor pose to waving and run again | 20260930 | Man waved, but the other hand remained in a pocket and did not fully match |
| Enable only photo 1 in the two-photo workflow | 20260930 | Only the white-shirted man, with open arms |
| Disable photo 1 and enable only photo 2 | 20260930 | Only the woman in a brown jacket, waving |
| Re-enable both | 20260930 | Man left/woman right restored; open arms and wave matched their original mannequins |

The three switching results came from API requests serialized during one browser round trip. No photo inputs or mannequin images were manually rewritten; only unrelated camera branches were removed and test output prefixes set. The woman still held a book, and fingers or clothing details could change. This validates identity count, photo source and main action after switching, not exact joint matching.

## Usage and boundaries

Restart the ComfyUI backend and refresh the page after updating. Existing workflows and models remain usable. With two individual photos, opening the editor or running the workflow automatically selects the character count from the enabled photos. Apply after adjusting the pose.

The fix improves pose-instruction following, but cannot guarantee faces, fingers, clothing or every complex action. Subsequent camera changes inherit any first-stage pose errors.
