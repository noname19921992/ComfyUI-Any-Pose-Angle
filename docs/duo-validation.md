# Two-person group-photo validation · 2026-10-08

This revision improves character count and left/right assignment in the samples below. It does not guarantee identity locking for arbitrary group photos.

## Reproduction

The input was a group photo with a man on the left and a woman on the right, plus two mannequins with skeleton guides. The mannequin image was 1024×768 and the output 1024×1024. The left mannequin raised an arm and leg; the right mannequin held a hand near the face with legs apart.

The old instruction separately requested drawing the left person and then the right person, without the `Draw character from image2` opening. The running frontend/backend versions and left/right instructions were correct, but front-stage results at seeds 20260930 and 139123415334490 contained three people. The error occurred before the camera-change stage.

## Controlled comparisons

Models and settings: Qwen Image 2.1 int8 convrot, VNCCS_QI2_PoseStudioV1.1 at strength 1, Qwen3-VL 8B, Qwen Image 2.1 VAE, 25 steps, CFG 1, Euler / simple.

| Change | Seed | Observed result |
|---|---|---|
| Keep the old instruction; size output to the encoded mannequin frame | 20260930 | Two people, but woman left/man right; legs did not fully follow |
| Use only the original short trigger; keep square output | 20260930 | Two people, but woman left/man right |
| Original short trigger; size output to the mannequin frame | 20260930 | Mixed identities and ghosted characters |
| Keep the trigger, explicitly repose the two existing people, and map them by the viewer's left/right | 20260930, 139123415334490, 42 | All three runs produced two people, man left/woman right, following the two main actions |
| Same instruction, swapped assignments | 20260930 | Woman left/man right; the right person's leg pose still differed |
| Same instruction with the earlier man-in-T-pose/woman-waving pose | 20260930, 42 | Both runs produced two people, man left/woman right, with the main actions matched |
| Manually describe clothing, glasses and other identity details | 20260930 | Two people, man left/woman right; photo-specific descriptions were not added to the plugin |

These comparisons show that the old instruction contributed to this failure. They do not establish the model's internal mechanism or a success rate across all seeds.

## Changes and boundaries

Only the group-photo task wording was replaced: retain the VNCCS trigger, edit the existing pair, and specify the viewer's left/right. Swapping and mannequin movement still calculate assignments by character number, with matching frontend and backend instructions. The full group photo is preserved without cropping, and mannequin/output dimensions remain independent. Single-person and two-individual-photo instructions are unchanged by this revision.

This remains textual guidance rather than an independent face-identity constraint. Retests still showed changes to held objects, shoes and clothing, cropped limbs, floating poses and one background-stitching artifact. Correct count and order do not establish overall image quality. Automated tests verify instructions, reference-image order and state transfer; visual results require separate inspection.
