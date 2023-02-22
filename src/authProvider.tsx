import decodeJwt from 'jwt-decode';

const envLists = import.meta.env
const authBaseUrl=envLists.VITE_authBaseUrl

export default{
    login:({username,password})=>{
        const request=new Request(authBaseUrl+'/api/connect/token',{
            method:'POST',
            mode:'cors',
            body:JSON.stringify({
                data:{
                    ClientId:username,
                    ClientSecret:password
                }
            }),
            headers:new Headers({'Content-Type':'application/json'}),
        });
        return fetch(request)
            .then(response=>{
                if(response.status<200 || response.status > 300){
                    throw new Error(response.statusText);
                }
                
                return response.json();
            })
            .then(({errorCode,errorMsg,result})=>{
                if(errorCode!=0){
                    throw new Error(errorMsg);
                }
                const decodedToken=decodeJwt(result);
                console.log('token:'+JSON.stringify( decodedToken));
                localStorage.setItem('token',result);
            });
    },

    logout:()=>{
        localStorage.removeItem('token');
        return Promise.resolve();
    },
    checkError:(error)=>{
        const status=error.status;
        if(status===401||status===403){
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => Promise.resolve(''),
}