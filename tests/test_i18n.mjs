import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setLocale, getLocale, t } from '../web/i18n.mjs';

test('locale follows Chinese and English setting codes', () => {
    setLocale('en');
    assert.equal(getLocale(), 'en');
    assert.equal(t('编辑姿势与镜头'), 'Edit pose & camera');
    setLocale('zh-CN');
    assert.equal(t('编辑姿势与镜头'), '编辑姿势与镜头');
    setLocale('zh-TW');
    assert.equal(getLocale(), 'zh');
});

test('dynamic messages retain values and translate nested status messages', () => {
    setLocale('en');
    assert.equal(t('应用到人物 2'), 'Apply to character 2');
    assert.equal(t('已保存「my custom pose」'), 'Saved “my custom pose”');
    assert.equal(t('加载失败：没有得到骨架图'), 'Loading failed: No skeleton image returned');
    assert.equal(t('左前方视角，平视，中景'), 'Front-left view, Eye level, Medium shot');
    assert.equal(t('左手腕 · 缺失'), 'Left wrist · Missing');
    assert.equal(t('  系统提示词\n'), '  System prompt\n');
});

test('prompt text, filenames and unrecognized values are preserved', () => {
    setLocale('en');
    for (const value of ['Draw character from image2.', 'my-pose.png', 'constructor', '__proto__', '', null]) assert.equal(t(value), value);
    setLocale('zh');
});

test('loaded gallery tabs translate their names and retain image counts', () => {
    setLocale('en');
    assert.equal(t('常用姿势 29'), 'Common Poses 29');
    assert.equal(t('FISHER小彩蛋 209'), 'Fisher Bonus Poses 209');
    assert.equal(t('我的图库 3'), 'My Library 3');
    assert.equal(t('我的图库'), 'My Library');
    setLocale('zh');
    assert.equal(t('常用姿势 29'), '常用姿势 29');
    assert.equal(t('FISHER小彩蛋 209'), 'FISHER小彩蛋 209');
});

test('native locale files cover the same nine node schemas and socket indexes', async () => {
    const load = async lang => JSON.parse(await readFile(new URL(`../locales/${lang}/nodeDefs.json`, import.meta.url), 'utf8'));
    const en = await load('en'), zh = await load('zh');
    assert.equal(Object.keys(en).length, 9);
    assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
    for (const name of Object.keys(en)) {
        assert.deepEqual(Object.keys(en[name].inputs), Object.keys(zh[name].inputs));
        assert.deepEqual(Object.keys(en[name].outputs || {}), Object.keys(zh[name].outputs || {}));
        assert.doesNotMatch(en[name].display_name, /[\u4e00-\u9fff]/);
    }
    assert.equal(en.FisherQwenFreePose.outputs['5'].name, 'Pose data');
    assert.equal(zh.FisherQwenFreePose.outputs['5'].name, '姿势数据');
});
