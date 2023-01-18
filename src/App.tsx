import { Admin, combineDataProviders, CustomRoutes, DataProviderContext, EditGuesser, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Route } from "react-router-dom";
import { UserList } from "./users";
import { PostEdit, PostList } from "./posts";
import { Dashboard } from "./Dashboard";
import authProvider from "./authProvider";
import {dataProvider} from "./dataProvider";
import { TenantList } from "./tenants";
import { TenantDomainCreate, TenantDomainList } from "./tenantDomains";
import { ApiClientCreate, ApiClientList, ApiClientModifySecret, ApiClientAuthorize } from "./apiClients";
import { ServiceInfoCreate, ServiceInfoList, ServiceInfoModify } from "./serviceInfos";
import { DbInfoCreate, DbInfoList, DbInfoModify } from "./dbInfos";
import { DbServerCreate, DbServerList, DbServerShow } from "./dbServers";
import { CreateDbScriptCreate, CreateDbScriptList, CreateDbScriptShow } from "./createDbScripts";
import { uploadFileProvider } from "./uploadFileProvider";

//const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const combineDataProvider = combineDataProviders((resource) => {
  switch (resource) {
      case 'createDbScript':
        return uploadFileProvider;
      default:
        return dataProvider;
  }
});

const App = () => (
  <Admin authProvider={authProvider} dataProvider={combineDataProvider}>
    <Resource name="users" list={UserList} recordRepresentation="name"></Resource>
    <Resource name="posts" list={PostList} edit={PostEdit}></Resource>
    <Resource name="apiClient" list={ApiClientList} create={ApiClientCreate} edit={ApiClientModifySecret}></Resource>
    <Resource name="serviceInfo" list={ServiceInfoList} create={ServiceInfoCreate} edit={ServiceInfoModify} recordRepresentation="identifier"></Resource>
    <Resource name="dbInfo" list={DbInfoList} create={DbInfoCreate} edit={DbInfoModify}></Resource>
    <Resource name="dbServer" list={DbServerList} create={DbServerCreate} show={DbServerShow} recordRepresentation={(record) => `${record.serverHost}:${record.serverPort}`}></Resource>
    <Resource name="createDbScript" list={CreateDbScriptList} create={CreateDbScriptCreate} show={CreateDbScriptShow} recordRepresentation="name"></Resource>
    <Resource name="tenantDomain" list={TenantDomainList} create={TenantDomainCreate} recordRepresentation="tenantDomain"></Resource>
    <Resource name="tenant" list={TenantList}></Resource>
    <CustomRoutes>
            <Route path="/clientAuthorize/:id" element={<ApiClientAuthorize />} />
    </CustomRoutes>
  </Admin>
)

export default App
