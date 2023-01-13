import { Admin, CustomRoutes, EditGuesser, ListGuesser, Resource } from "react-admin";
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

//const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="users" list={UserList} recordRepresentation="name"></Resource>
    <Resource name="posts" list={PostList} edit={PostEdit}></Resource>
    <Resource name="apiClient" list={ApiClientList} create={ApiClientCreate} edit={ApiClientModifySecret}></Resource>
    <Resource name="tenantDomain" list={TenantDomainList} create={TenantDomainCreate} recordRepresentation="tenantDomain"></Resource>
    <Resource name="tenant" list={TenantList}></Resource>
    <CustomRoutes>
            <Route path="/clientAuthorize/:id" element={<ApiClientAuthorize />} />
    </CustomRoutes>
  </Admin>
)

export default App
