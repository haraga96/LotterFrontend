import { MetaData } from "./metadata";

export interface ApiResponse<T> {
  data: T;
  metadata: MetaData;
}
