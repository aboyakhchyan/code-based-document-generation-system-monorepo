import { Block } from '@prisma/client';

interface ContentBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  contentType: 'title' | 'description' | 'text';
  defaultContent: string;
  content: string;
  fontSize: number;
  fontWeight: '400' | '700';
  color: string;
  backgroundColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  textDecoration?: string;
  fontStyle?: string;
  isEditMode: boolean;
}

interface ImageBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  path?: string;
  file?: any;
  isEditMode: boolean;
}

interface ShapeBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  shapeType: 'rectangle' | 'circle' | 'line' | 'triangle';
  backgroundColor: string;
  borderColor: string;
  isEditMode: boolean;
  radius?: number;
  x2?: number;
  y2?: number;
  lineWidth?: number;
  points?: [number, number, number, number, number, number];
}

export interface IDocumentTemplate {
  id: string;
  title: string;
  backgroundColor: string;
  isEditMode: boolean;
  previewPath: string;
  dimension: {
    format: string;
    title: string;
    width: number;
    height: number;
    preview?: { width: number; height: number };
  } | null;
  contentBlocks?: ContentBlock[];
  imageBlocks?: ImageBlock[];
  shapeBlocks?: ShapeBlock[];
}

export interface IDocumentWithoutBlocks {
  id?: string;
  userId: string;
  dimension: {
    format: string;
    title: string;
    width: number;
    height: number;
    preview?: { width: number; height: number };
  } | null;
  styles: {
    backgroundColor: string;
    isEditMode: boolean;
  } | null;
}

export interface IBlock {
  id?: string;
  metadata?: Record<string, any>;
  styles?: Record<string, any>;
  blockType: 'content' | 'image' | 'shape';
}

export interface IDocumentTemplateWithBlocks {
  id: number | string;
  title: string;
  styles: {
    backgroundColor: string;
    isEditMode: boolean;
  } | null;
  dimension: {
    format: string;
    title: string;
    width: number;
    height: number;
    preview?: { width: number; height: number };
  } | null;
  blocks: Block[];
}

interface ContentBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  contentType: 'title' | 'description' | 'text';
  defaultContent: string;
  content: string;
  fontSize: number;
  fontWeight: '400' | '700';
  color: string;
  backgroundColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  textDecoration?: string;
  fontStyle?: string;
  isEditMode: boolean;
}

interface ImageBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  path?: string;
  file?: any;
  isEditMode: boolean;
}

interface ShapeBlock {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  shapeType: 'rectangle' | 'circle' | 'line' | 'triangle';
  backgroundColor: string;
  borderColor: string;
  isEditMode: boolean;
  radius?: number;
  x2?: number;
  y2?: number;
  lineWidth?: number;
  points?: [number, number, number, number, number, number];
}
