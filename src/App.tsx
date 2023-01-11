import { Admin, EditGuesser, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./users";
import { PostEdit, PostList } from "./posts";
import { Dashboard } from "./Dashboard";
import authProvider from "./authProvider";
import {dataProvider} from "./dataProvider";
import { TenantList } from "./tenants";
import { TenantDomainCreate, TenantDomainList } from "./tenantDomains";
import { ApiClientCreate, ApiClientList } from "./apiClients";

//const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider} dashboard={Dashboard}>
    <Resource name="users" list={UserList} recordRepresentation="name"></Resource>
    <Resource name="posts" list={PostList} edit={PostEdit}></Resource>
    <Resource name="apiClient" list={ApiClientList} create={ApiClientCreate}></Resource>
    <Resource name="tenantDomain" list={TenantDomainList} create={TenantDomainCreate} recordRepresentation="tenantDomain"></Resource>
    <Resource name="tenant" list={TenantList}></Resource>
  </Admin>
)

export default App
