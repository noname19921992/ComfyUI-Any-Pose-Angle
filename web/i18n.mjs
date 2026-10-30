import { english } from './locales/en.mjs';

const normalizeLocale = value => String(value || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
let locale = normalizeLocale(globalThis.location ? new URLSearchParams(location.search).get('lang') || globalThis.navigator?.language : 'zh');
const templates = Object.entries(english).filter(([source]) => /\{\d+\}/.test(source)).map(([source, target]) => {
    const escaped = source.split(/(\{\d+\})/).map(part => /^\{\d+\}$/.test(part) ? '([\\s\\S]*?)' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
    return [new RegExp(`^${escaped}$`), target];
});

export const getLocale = () => locale;
export function t(source) {
    if (typeof source !== 'string' || locale === 'zh' || !/[\u3400-\u9fff]/.test(source)) return source;
    const text = source.trim();
    let translated = Object.hasOwn(english, text) ? english[text] : undefined;
    if (translated === undefined) {
        for (const [pattern, target] of templates) {
            const match = text.match(pattern);
            if (match) { translated = target.replace(/\{(\d+)\}/g, (_, index) => t(match[Number(index) + 1])); break; }
        }
    }
    if (translated === undefined && text.includes('，')) {
        const parts = text.split('，');
        if (parts.every(part => Object.hasOwn(english, part))) translated = parts.map(part => t(part)).join(', ');
    }
    return translated === undefined ? source : source.replace(text, () => translated);
}

export function setLocale(value) {
    const next = normalizeLocale(value);
    if (next === locale) return;
    locale = next;
    globalThis.dispatchEvent?.(new Event('fisher-locale-change'));
}

export const confirmMessage = message => globalThis.confirm(t(message));
export const promptMessage = (message, value) => globalThis.prompt(t(message), value);

// Translate display text only. Input values and generated prompts remain workflow data.
export function localizeDOM(root) {
    const records = new WeakMap();
    const skip = 'script,style,textarea,input,[contenteditable],#description,#pose-photo-name,#saved-poses span,.fp-shape-card span,#people-list b,#shot-strip b,#actor-heading,.fp-thumb:not(.fp-mannequin) span,[data-i18n-skip]';
    const attributes = ['title', 'alt', 'placeholder', 'aria-label'];
    function translate(node, key, read, write) {
        const current = read();
        if (!current) return;
        let record = records.get(node);
        if (!record) { record = {}; records.set(node, record); }
        const previous = record[key];
        const source = previous && previous.result === current ? previous.source : current;
        const result = t(source);
        record[key] = { source, result };
        if (result !== current) write(result);
    }
    function visit(node) {
        if (node.nodeType === 3) {
            if (!node.parentElement?.closest(skip)) translate(node, 'text', () => node.data, value => { node.data = value; });
            return;
        }
        if (node.nodeType === 1) {
            if (node.matches('script,style,[data-i18n-skip]')) return;
            // An option without an explicit value uses its label as the saved value.
            if (node.tagName === 'OPTION' && !node.hasAttribute('value')) node.setAttribute('value', node.value);
            for (const name of attributes) translate(node, name, () => node.getAttribute(name), value => node.setAttribute(name, value));
        }
        for (const child of node.childNodes || []) visit(child);
    }
    function refresh() {
        if (root.nodeType === 9) root.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
        visit(root);
    }
    refresh();
    const observer = new MutationObserver(changes => {
        for (const change of changes) {
            if (change.type === 'childList') for (const node of change.addedNodes) visit(node);
            else visit(change.target);
        }
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    globalThis.addEventListener('fisher-locale-change', refresh);
    return () => { observer.disconnect(); globalThis.removeEventListener('fisher-locale-change', refresh); };
}

if (globalThis.window) window.addEventListener('message', event => {
    if (event.source === window.parent && event.origin === location.origin && event.data?.type === 'fisher-locale') setLocale(event.data.locale);
});
