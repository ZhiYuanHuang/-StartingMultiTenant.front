export interface appResponseDto{
    errorCode:number,
    errorMsg:string,
    result?:any,
    resultList?:any,
}

export interface pagingDataDto{
    pageSize:number,
    pageIndex:number,
    pageCount:number,
    recordCount:number,
    data:any,
}