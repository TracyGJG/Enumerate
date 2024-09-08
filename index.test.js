import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';

import Enumerate from './index.js';

describe('Enumerate', () => {
  describe('constants method', () => {
    test('can instantiate constants', () => {
      const Dialog = Enumerate.constants({
        SHOW: true,
        HIDE: false,
      });

      assert.equal(Dialog.SHOW, true);
      assert.equal(Dialog.HIDE, false);
    });

    test('can reformat keys', () => {
      const HIDE_DIALOG = false;
      const Dialog = Enumerate.constants({
        showDialog: true,
        hideDialog: HIDE_DIALOG,
      });

      assert.equal(Dialog.SHOW_DIALOG, true);
      assert.equal(Dialog.HIDE_DIALOG, false);
    });

    test('an exception is raised when reassiging a value', () => {
      const Dialog = Enumerate.constants({
        SHOW: true,
        HIDE: false,
      });

      assert.throws(() => (Dialog.SHOW = null));
    });
  });

  describe('functionMap method', () => {
    test('can map a valid function', () => {
      const mappedFunctions = Enumerate.functionMap({
        worked: _ => _.toUpperCase(),
      });

      assert.equal(mappedFunctions('worked')('testing'), 'TESTING');
    });

    test('can map an invalid function, with fallback', () => {
      let fallbackCalled = 0;
      const mockFallback = mock.fn(_ => ++fallbackCalled);
      const mappedFunctions = Enumerate.functionMap(
        {
          worked: _ => _.toUpperCase(),
        },
        mockFallback
      );

      assert.equal(fallbackCalled, 0);
      assert.equal(mappedFunctions('failed')('testing'), 1);
      assert.equal(fallbackCalled, 1);
    });

    test('will throw and exception when called with an invalid function and no fallback', () => {
      const mappedFunctions = Enumerate.functionMap({
        worked: _ => _.toUpperCase(),
      });

      assert.throws(() => mappedFunctions('failed')('testing'), 'error');
    });
  });

  describe('ordinals method', () => {
    test('can create ordinals using the default value function', () => {
      const CARDINALS = Enumerate.ordinals(['North', 'East', 'South', 'West']);

      assert.strictEqual(CARDINALS.NORTH, 0);
      assert.strictEqual(CARDINALS.EAST, 1);
      assert.strictEqual(CARDINALS.SOUTH, 2);
      assert.strictEqual(CARDINALS.WEST, 3);
    });

    test('can create ordinals with a supplied value function', () => {
      const bearing = _ => _ * 45 || 360;
      const CARDINALS = Enumerate.ordinals(
        [
          'North',
          'NorthEast',
          'East',
          'SouthEast',
          'South',
          'SouthWest',
          'West',
          'NorthWest',
        ],
        bearing
      );

      assert.strictEqual(CARDINALS.NORTH, 360);
      assert.strictEqual(CARDINALS.EAST, 90);
      assert.strictEqual(CARDINALS.SOUTH, 180);
      assert.strictEqual(CARDINALS.WEST, 270);
    });
  });
});
