# Tests

Run from the plugin root using the Python interpreter that runs ComfyUI. The tests below do not load model weights.

```bash
python -m unittest discover -s tests -p "test_pose*.py"
python -m unittest discover -s tests -p "test_pe_rewrite.py"
python -m unittest discover -s tests -p "test_gguf_clip.py"
python tests/test_saved_poses.py
python tests/test_anyangle.py
python tests/test_free_pose.py <ComfyUI_directory>
python tests/test_qwen_bridge.py <ComfyUI_directory>
node tests/test_openpose_lift.mjs
node --test tests/test_apply_state.mjs
node --test tests/test_workflow_controls.mjs
node --test tests/test_binding_runtime.mjs
node --test tests/test_i18n.mjs
```

`test_free_pose.py` and `test_qwen_bridge.py` require the ComfyUI directory argument to import `TextEncodeQwenImage21`.

`tests/e2e/` contains browser end-to-end scenarios. The runner opens the actual ComfyUI frontend in headless Chrome, loads the unified workflow and executes a scenario. `studio_interaction.js`, `apply_stores_file.js` and similar scenarios check interaction only. `anyangle_generate.js` and `two_people_generate.js` actually queue generation and load models. Start ComfyUI first:

```bash
python tests/e2e/cdp_run.py tests/e2e/studio_interaction.js --base http://127.0.0.1:8188
```

`tools/build_common_poses.py` renders common-pose thumbnails in the real editor. Rerun after changing `web/editor/common-poses.mjs`; `--review` produces a front-and-side contact sheet for visual inspection.

`tools/upgrade_studio_workflow.js` records the one-time migration that added the Fisher Camera node to the unified workflow. It also runs through `cdp_run.py`.

`e2e/movement_gizmo.js` is a Playwright function accepting an isolated page with the editor already open. It drags X/Y/Z with real mouse input and checks single-axis constraints, character/bone isolation, undo/redo, exclusion of axes from output, two-person switching, save/reopen and camera/joint-tool restoration.

`tests/fixtures/` retains two pre-upgrade workflows for compatibility tests. They are not user-facing workflow entry points.
