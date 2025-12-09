export interface IDimension {
  format: string;
  title: string;
  size?: string;
  sizeType?: string;
  width: number;
  height: number;
  preview?: IPreview;
}

export interface IPreview {
  width: number;
  height: number;
}

export type BlockType = "title" | "description" | "text";
export type ShapeType = "rectangle" | "circle" | "line" | "triangle";
export type FontWeightType = "400" | "700";
export type TextAlignType = "left" | "center" | "right";
export type BlockCategory = "contentBlocks" | "imageBlocks" | "shapeBlocks";

export interface InitialBlockStyle {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface IContentBlockStyle extends InitialBlockStyle {
  fontSize: number;
  fontWeight: FontWeightType;
  color: string;
  backgroundColor: string;
  fontFamily: string;
  fontStyle?: string;
  textAlign: TextAlignType;
  textDecoration?: string;
  isEditMode: boolean;
}

export interface IContentBlock {
  id: number;
  content: string;
  defaultContent: string;
  contentType: BlockType;
  styles: IContentBlockStyle;
}

export interface ImageBlockStyle extends InitialBlockStyle {
  isEditMode: boolean;
}

export interface ImageBlock {
  id: number;
  path?: string;
  file?: File;
  styles: ImageBlockStyle;
}

export interface IShapeBlockStyle extends InitialBlockStyle {
  backgroundColor: string;
  borderColor: string;
  isEditMode: boolean;
}

export interface IShapeBlockBase {
  id: number;
  shapeType: ShapeType;
  styles: IShapeBlockStyle;
}

export interface RectangleBlock extends IShapeBlockBase {
  shapeType: "rectangle";
}

export interface CircleBlock extends IShapeBlockBase {
  shapeType: "circle";
  radius: number;
}

export interface LineBlock extends IShapeBlockBase {
  shapeType: "line";
  x2: number;
  y2: number;
  lineWidth?: number;
}

export interface TriangleBlock extends IShapeBlockBase {
  shapeType: "triangle";
  points: [number, number, number, number, number, number];
}

export type ShapeBlock = RectangleBlock | CircleBlock | LineBlock | TriangleBlock;

export interface IDocument {
  id: number | string;
  previewPath?: string;
  title: string;
  isEditMode: boolean;
  backgroundColor: string;
  dimensions: IDimension | null;
  contentBlocks?: IContentBlock[];
  imageBlocks?: ImageBlock[];
  shapeBlocks?: ShapeBlock[];
}

export interface IDocumentTemplate {
  id: number | string;
  previewPath: string;
  title: string;
  isEditMode: boolean;
  backgroundColor: string;
  dimension: IDimension | null;
  contentBlocks?: IContentBlock[];
  imageBlocks?: ImageBlock[];
  shapeBlocks?: ShapeBlock[];
}
