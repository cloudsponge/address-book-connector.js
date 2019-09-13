import {
  namespace,
  jsonDataKey,
  cloudspongeScriptId,
} from '../../src/lib/consts';

it('should return a namespace', () => {
  expect(namespace).not.toBeNull();
});

it('should return a jsonDataKey', () => {
  expect(jsonDataKey).not.toBeNull();
});

it('includes the namespace in the jsonDataKey', () => {
  expect(jsonDataKey).toMatch(`${namespace}`);
});

it('should return a cloudspongeScriptId', () => {
  expect(cloudspongeScriptId).not.toBeNull();
});
