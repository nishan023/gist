export type GistFile = {
  filename: string;
  language: string | null;
  size: number;
  content?: string;
  truncated?: boolean;
};
export type Gist = {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
  files: GistFile[];
};
