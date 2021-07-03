import { mapTree, Tree } from './tree-utils';

describe(`tree-utils`, () => {
  describe('mapTree', () => {
    it(`should add new field to each element`, () => {
      const source: Tree<{ name: number }> = {
        name: 1,
        children: [
          { name: 2, children: [] },
          { name: 3, children: [{ name: 4 }] },
        ],
      };

      const result = mapTree(source, tree => {
        return {
          ...tree,
          age: 3,
        };
      });
      expect(result).toEqual({
        name: 1,
        age: 3,
        children: [
          { name: 2, age: 3, children: [] },
          { name: 3, age: 3, children: [{ name: 4, age: 3 }] },
        ],
      });
    });
    it(`should remove object with name 3`, () => {
      const source: Tree<{ name: number }> = {
        name: 1,
        children: [
          { name: 2, children: [] },
          { name: 3, children: [{ name: 4 }] },
        ],
      };

      const result = mapTree(source, tree => {
        if (tree.name !== 3) {
          return tree;
        }
      });
      expect(result).toEqual({
        name: 1,
        children: [{ name: 2, children: [] }],
      });
    });
  });
});
