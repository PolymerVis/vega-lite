
/* tslint:disable:quotemark */

import {assert} from 'chai';
import * as properties from '../../../src/compile/axis/properties';
import {TimeUnit} from '../../../src/timeunit';

describe('compile/axis', ()=> {
  describe('grid()', function () {
    it('should return true by default for continuous scale that is not binned', function () {
      const grid = properties.grid('linear', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, true);
    });

    it('should return false by default for binned field', function () {
      const grid = properties.grid('linear', {bin: true, field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });

    it('should return false by default for a discrete scale', function () {
      const grid = properties.grid('point', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });
  });

  describe('minMaxExtent', () => {
    it('returns specified extent for a non-grid axis', () => {
      assert.equal(properties.minMaxExtent(25, false), 25);
    });

    it('returns 0 for a grid axis', () => {
      assert.equal(properties.minMaxExtent(0, true), 0);
    });
  });

  describe('orient()', function () {
    it('should return bottom for x by default', function () {
      const orient = properties.orient('x');
      assert.deepEqual(orient, 'bottom');
    });

    it('should return left for y by default', function () {
      const orient = properties.orient('y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function() {
    it('should return undefined by default for a binned field', () => {
      const tickCount = properties.tickCount('x', {bin: {maxbins: 10}, field: 'a', type: 'quantitative'}, 'linear', {signal : 'a'});
      assert.deepEqual(tickCount, {signal: 'min(ceil(a/30), 10)'});
    });

    ['month', 'hours', 'day', 'quarter'].forEach((timeUnit: TimeUnit) => {
        it(`should return undefined by default for a temporal field with timeUnit=${timeUnit}`, () => {
          const tickCount = properties.tickCount('x', {timeUnit, field: 'a', type: 'temporal'}, 'linear', {signal : 'a'});
          assert.isUndefined(tickCount);
        });
    });

    it('should return size/30 by default for linear scale', () => {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'linear', {signal : 'a'});
      assert.deepEqual(tickCount, {signal: 'ceil(a/30)'});
    });

    it('should return undefined by default for log scale', function () {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'log', undefined);
      assert.deepEqual(tickCount, undefined);
    });

    it('should return undefined by default for point scale', function () {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'point', undefined);
      assert.deepEqual(tickCount, undefined);
    });
  });

  describe('title()', function () {
    it('should add return fieldTitle by default', function () {
      const title = properties.title(3, {field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = properties.title(10, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'Sum of a');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = properties.title(3, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'Su…');
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = properties.values({values: [{year: 1970}, {year: 1980}]}, null, null);

      assert.deepEqual(values, [
        {"signal": "datetime(1970, 0, 1, 0, 0, 0, 0)"},
        {"signal": "datetime(1980, 0, 1, 0, 0, 0, 0)"}
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = properties.values({values: [1,2,3,4]}, null, null);

      assert.deepEqual(values, [1,2,3,4]);
    });
  });

  describe('zindex()', function () {
    it('should return undefined by default without grid defined', function () {
      const zindex = properties.zindex(false);
      assert.deepEqual(zindex, 1);
    });

    it('should return back by default with grid defined', function () {
      const zindex = properties.zindex(true);
      assert.deepEqual(zindex, 0);
    });
  });
});
