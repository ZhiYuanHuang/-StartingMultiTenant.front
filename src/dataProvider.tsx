import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { appResponseDto, pagingDataDto } from "./generalClass";

const envLists = import.meta.env
export const DataBaseUrl = envLists.VITE_dataBaseUrl

const fetchJson = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: 'Bearer ' + localStorage.getItem('token')
    };

    return fetchUtils.fetchJson(url, options);
};

const httpClient = fetchJson;

export const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const jsonBody = {
            data: {
                pageSize: perPage,
                pageIndex: page - 1,
                filter: getFilterContent(params)
            }

        };

        const url = `${DataBaseUrl}/api/${resource}/getlist`;
        return httpClient(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(jsonBody)
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return json.result;
        }).then((pagingData: pagingDataDto) => {
            return {
                data: pagingData.data,
                total: pagingData.recordCount
            };
        });
    },
    getOne: (resource, params) =>
        httpClient(`${DataBaseUrl}/api/${resource}/get?id=${params.id}`, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.result };
        }),
    getMany: (resource, params) => {


        return httpClient(`${DataBaseUrl}/api/${resource}/getmany`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                data: [...params.ids]
            }),
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.resultList };
        });
    },
    create: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/Add`;
        return httpClient(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                data: params.data
            }),
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return json.result;
        }).then((id: number) => ({
            data: { ...params.data, id: id },
        }));
    },
    delete: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/delete`;
        return httpClient(url, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify({
                data: params.id
            }),
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return {
                data: json.result
            };
        });
    },
    deleteMany: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/deletemany`;
        return httpClient(url, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify({
                data: params.ids
            }),
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return {
                data: json.result
            };
        });
    },
    update: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/update`;
        return httpClient(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                data: params.data
            })
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return {
                data: json.result
            };
        });
    },
    getApiClientScopes: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/GetWithScopes?id=${params.id}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            console.info(json.result);
            return { data: json.result };
        });
    },
    getApiScopes: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/getall`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.resultList };
        });
    },
    getAll: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/getall`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.resultList };
        });
    },
    getGroupCreateScript: (resource, params) => {
        const url = `${DataBaseUrl}/api/createDbScript/GetAllGroup`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.resultList };
        });
    },
    getDbInfoByService: (resource, params) => {
        const url = `${DataBaseUrl}/api/dbinfo/GetDbInfosByService?serviceInfoId=${params.id}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.resultList };
        });
    },
    getDbScriptContent: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/GetScriptContent?scriptId=${params.id}`;

        return fetch(url,{
            method: 'GET',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        }).then(response=>{
            if(response.status!=200){
                throw new Error(response.statusText);
            }
            return response.blob();
        }).then(blob=>{
            
            return blob;
        });
        
        // return httpClient(url, {
        //     method: 'GET',
        //     mode: 'cors',
        //     responseType: 'blob',
        // }).then(response => {
        //     console.log(result)

        //     // 需要指定文件类型，谷歌浏览器不能打开xlsx、doc等等

        //     var blob = new Blob([result], {

        //         type: "application/pdf;chartset=UTF-8"

        //     });
        // });
    },
    getRollBackScriptContent: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/GetRollBackScriptContent?scriptId=${params.id}`;

        return fetch(url,{
            method: 'GET',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        }).then(response=>{
            if(response.status!=200){
                throw new Error(response.statusText);
            }
            return response.blob();
        }).then(blob=>{
            
            return blob;
        });
    },
    authorizeApiClient: (params) => {
        const url = `${DataBaseUrl}/api/apiclient/authorize`;
        return httpClient(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                data: params.data
            })
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return {
                data: json.result
            };
        });
    },
    syncToExternalStore: (params) => {
        const url = `${DataBaseUrl}/api/tenant/SyncToExternalStore?id=${params.id}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
           
            return json;
        });
    },
    triggerDbConnsModify: (params) => {
        const url = `${DataBaseUrl}/api/tenant/TriggerDbConnsModify?id=${params.id}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
           
            return json;
        });
    },
    fullExecute: (params) => {
        const url = `${DataBaseUrl}/api/tenant/${params.TaskType}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
           
            return json;
        });
    },
    getStatRef: (resource, params) => {
        const url = `${DataBaseUrl}/api/${resource}/GetStatRef?id=${params.id}`;
        return httpClient(url, {
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return { data: json.result };
        });
    },
    exchangeDbServer: (params) => {
        const url = `${DataBaseUrl}/api/dbserver/ExchangeDbServer`;
        return httpClient(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                data: params.data
            })
        }).then(response => {
            return response.json;
        }).then((json: appResponseDto) => {
            if (json.errorCode != 0) {
                throw new Error(json.errorMsg);
            }
            return {
                data: json.result
            };
        });
    },
};



function getFilterContent(params: any) {
    if (typeof params.filter === "undefined" || params.filter === null) {
        return null;
    }
    // if(typeof params.filter==="object"){
    //     return JSON.stringify(params.filter);
    // }

    return params.filter;
}

