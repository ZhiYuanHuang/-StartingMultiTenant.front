import {fetchUtils} from "react-admin";
import {stringify} from "query-string";
import {appResponseDto,pagingDataDto} from "./generalClass";

const envLists = import.meta.env
const dataBaseUrl=envLists.VITE_dataBaseUrl

const fetchJson = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token:'Bearer '+localStorage.getItem('token')
    };
    return fetchUtils.fetchJson(url, options);
};

const httpClient=fetchJson;

export const dataProvider={
    getList:(resource,params)=>{
        const { page, perPage } = params.pagination;
        const jsonBody={
            data:{
                pageSize:perPage,
                pageIndex:page-1,
                filter:getFilterContent(params)
            }
            
        };

        const url=`${dataBaseUrl}/api/${resource}/getlist`;
        return httpClient(url,{
            method:'POST',
            mode:'cors',
            body:JSON.stringify(jsonBody)
        }).then(response=>{
            return response.json;
        }).then((json:appResponseDto)=>{
            if(json.errorCode!=0){
                throw new Error(json.errorMsg);
            }
            return json.result;
        }).then((pagingData:pagingDataDto)=>{
            return {
                data:pagingData.data,
                total:pagingData.pageCount
            };
        });
    },
    create:(resource,params)=>{
        const url=`${dataBaseUrl}/api/${resource}/Add`;
        return httpClient(url,{
            method:'POST',
            mode:'cors',
            body:JSON.stringify({
                data: params.data
            }),
        }).then(response=>{
            return response.json;
        }).then((json:appResponseDto)=>{
            if(json.errorCode!=0){
                throw new Error(json.errorMsg);
            }
            return json.result;
        }).then((id:number)=>({
            data: { ...params.data, id: id },
        }));
    },
};
function getFilterContent(params: any) {
    if(typeof params.filter === "undefined" || params.filter===null){
        return null;
    }
    // if(typeof params.filter==="object"){
    //     return JSON.stringify(params.filter);
    // }
    
    return params.filter;
}

