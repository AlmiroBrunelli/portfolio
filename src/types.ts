export interface Photo {
  path: string;
  label?: string;
  thumbnail?: string;
}

export interface ExplorerItem {
  label: string;
  icon?: string;
  type?: 'folder' | 'txt' | 'image' | 'pdf';
  path?: string;
  thumbnail?: string;
  labelText?: string;
  internalName?: string;
}
