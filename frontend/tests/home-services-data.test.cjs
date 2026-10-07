const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/home-services-data.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { HOME_SERVICES_DEFAULT, parseHomeServicesJson } = exportsObject;
const parseItem = (item) => parseHomeServicesJson(JSON.stringify({ items: [item] })).items[0];

test('default laboratory card uses its proper name and location', () => {
  const item = HOME_SERVICES_DEFAULT.items[0];
  assert.equal(item.title, 'Nita Laboratory');
  assert.match(item.desc, /Nita Laboratory at Bhimsengola-9/);
  assert.doesNotMatch(item.desc, /pathology lab/i);
});

for (const legacyName of ['Nita Laboratory', 'Nita Path Lab', 'Nita Pathology Lab']) {
  for (const legacyDescription of [
    'Leading pathology lab offering advanced testing for early disease detection.',
    'Leading pathology & diagnostic center offering advanced testing for early disease detection.',
  ]) {
    test(`migrates known legacy copy for ${legacyName}: ${legacyDescription}`, () => {
      const item = parseItem({ title: legacyName, desc: legacyDescription, href: '/diagnostic-test', tag: 'Diagnostics' });
      assert.equal(item.title, 'Nita Laboratory');
      assert.equal(item.desc, HOME_SERVICES_DEFAULT.items[0].desc);
      assert.equal(item.href, '/diagnostic-test');
      assert.equal(item.tag, 'Diagnostics');
    });
  }
}

test('preserves custom laboratory content and clinical terminology', () => {
  const custom = 'Nita Laboratory provides clinical pathology testing. Contact us for preparation instructions.';
  assert.equal(parseItem({ title: 'Nita Laboratory', desc: custom }).desc, custom);
});

test('does not rewrite another service', () => {
  const desc = 'Leading pathology lab offering clinical training.';
  assert.equal(parseItem({ title: 'Training Service', desc }).desc, desc);
});

test('missing or malformed settings retain safe defaults', () => {
  for (const raw of [undefined, '', '{broken', '{}', '{"items":[]}']) {
    assert.equal(parseHomeServicesJson(raw), HOME_SERVICES_DEFAULT);
  }
});
