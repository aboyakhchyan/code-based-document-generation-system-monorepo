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

export interface InitialBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface IContentBlock extends InitialBlock {
  content: string;
  defaultContent: string;
  contentType: BlockType;
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

export interface ImageBlock extends InitialBlock {
  path?: string;
  file?: File;
  isEditMode: boolean;
}

export interface IShapeBlockBase extends InitialBlock {
  shapeType: ShapeType;
  backgroundColor: string;
  borderColor: string;
  isEditMode: boolean;
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
  id: number;
  title: string;
  isEditMode: boolean;
  backgroundColor: string;
  dimension: IDimension | null;
  contentBlocks: IContentBlock[];
  imageBlocks: ImageBlock[];
  shapeBlocks: ShapeBlock[];
}
