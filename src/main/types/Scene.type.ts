export interface Scene {
  uuid: string;
  name: string;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSceneInput {
  name: string;
  remark?: string;
}
