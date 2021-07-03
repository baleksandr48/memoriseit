export interface TreeViewData {
  id: number;
  title: string;
  children?: TreeViewData[];
  isExpanded?: boolean;
  isSelected?: boolean;
}
