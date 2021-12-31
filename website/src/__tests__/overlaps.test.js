import { findDistinctSections } from 'logic';

test('unit findDistinctSections no overlaps', () => {
  const section = [0, 10, 20];
  const otherLine = [1, 10, 20];

  expect(findDistinctSections([], section)).toEqual([section]);
  expect(findDistinctSections([section], section)).toEqual([]);
  expect(findDistinctSections([otherLine], section)).toEqual([section]);
});

test('unit findDistinctSections start overlap', () => {
  const section = [0, 10, 20];
  const noTouch = [0, 0, 10];
  const justTouch = [0, 0, 11];
  const surrounding = [0, 0, 15];

  expect(findDistinctSections([noTouch], section)).toEqual([section]);
  expect(findDistinctSections([justTouch], section)).toEqual([[0, 11, 20]]);
  expect(findDistinctSections([surrounding], section)).toEqual([[0, 15, 20]]);
});

test('unit findDistinctSections end overlap', () => {
  const section = [0, 10, 20];
  const noTouch = [0, 20, 30];
  const justTouch = [0, 19, 30];
  const surrounding = [0, 15, 30];

  expect(findDistinctSections([noTouch], section)).toEqual([section]);
  expect(findDistinctSections([justTouch], section)).toEqual([[0, 10, 19]]);
  expect(findDistinctSections([surrounding], section)).toEqual([[0, 10, 15]]);
});

test('unit findDistinctSections surrounding overlap', () => {
  const section = [0, 10, 20];
  const surroundStart = [0, 0, 20];
  const surroundEnd = [0, 10, 30];
  const surroundAll = [0, 0, 30];

  expect(findDistinctSections([surroundStart], section)).toEqual([]);
  expect(findDistinctSections([surroundEnd], section)).toEqual([]);
  expect(findDistinctSections([surroundAll], section)).toEqual([]);
});
