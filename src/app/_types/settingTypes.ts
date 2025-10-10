import { UUID } from "crypto";

export interface Setting{
    uuid: UUID;
    title: string;
    value: string;
    section: string;
    
  }
  export interface SettingResponseT {
    code: number;
    message: string;
    data: Setting[];
  }