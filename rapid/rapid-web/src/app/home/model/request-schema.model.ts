export interface RequestSchema {
  id: string; // or null if it's not yet saved
  name: string;
  description: string | null; // Nullable
  schemaFileName?: string;
  schemaData?: any;
  schema: string;
  createdOn: string,
  createdBy: string,
  updatedOn: string,
  updatedBy: string,
  createdByName: string,
  updatedByName: string
}

export interface ApiResponse<T> {
  statusCode: number;
  status: string;
  body: T;
}