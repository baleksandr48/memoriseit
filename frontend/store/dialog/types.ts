export enum DIALOG_TYPE {
  SIMPLE_DIALOG = "SIMPLE_DIALOG",
  ARTICLE_CREATE = "ARTICLE_CREATE"
}

export interface ArticleCreateContext {
  topicId: number;
  isGroup: boolean;
  parentId?: number;
}

export enum SIMPLE_DIALOG_TYPE {
  INPUT = "INPUT",
  QUESTION = "QUESTION"
}

export interface SimpleDialogContext {
  title: string;
  type: SIMPLE_DIALOG_TYPE;
  onSubmit(inputValue?: string): void;
  question?: string;
  inputLabel?: string;
}

export type DialogContext = ArticleCreateContext | SimpleDialogContext;

export interface DialogState {
  openedType?: DIALOG_TYPE;
  context?: DialogContext;
}

export enum DIALOG_ACTION {
  OPEN_SIMPLE_DIALOG = "OPEN_SIMPLE_DIALOG",
  OPEN_DIALOG = "OPEN_DIALOG",
  CLOSE_DIALOG = "CLOSE_DIALOG"
}

export interface OpenDialogPayload {
  type: DIALOG_TYPE;
  context?: DialogContext;
}
