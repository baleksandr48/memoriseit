export type Tree<Type = object> = {
  [key in keyof Type]: Type[key];
} & {
  children?: Tree<Type>[];
};

export const findTree = <Type>(
  tree: Tree<Type>,
  callback: (el: Tree<Type>) => boolean,
): Tree | null => {
  if (callback(tree)) {
    return tree;
  }
  for (const child of tree.children || []) {
    const result = findTree(child, callback);
    if (result) {
      return result;
    }
  }
  return null;
};

export const forEachTree = <Type>(
  element: Tree<Type>,
  callback: (el: Tree<Type>) => void,
): void => {
  callback(element);
  for (const child of element.children || []) {
    forEachTree(child, callback);
  }
};

export const mapTree = <SourceType, OutputType>(
  element: Tree<SourceType>,
  callback: (
    el: Tree<SourceType>,
  ) => (Omit<Tree<SourceType>, keyof SourceType> & OutputType) | undefined,
): Tree<OutputType> | undefined => {
  const result = callback(element);
  if (result) {
    // @ts-ignore
    const sourceChildren: Tree<SourceType>[] = result.children;
    if (sourceChildren) {
      const outputChildren = sourceChildren.map(child =>
        mapTree(child, callback),
      );
      // @ts-ignore
      result.children = outputChildren.filter(child => !!child) as Tree<
        SourceType
      >[];
    }
  }
  return result;
};
