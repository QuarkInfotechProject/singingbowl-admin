export interface MenuResponse {
    code: number;
    message: string;
    data: Menu[];
  }
export interface Menu{
    groupId: number,
    menuId: number,
    permissionId:number,

}