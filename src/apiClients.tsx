import { List, Datagrid, TextField, TextInput, SimpleForm, Create, PasswordInput, Edit, EditButton, useRecordContext, FunctionField, WrapperField, Button, CustomRoutes, Resource, Admin, Title, useRedirect, EditBase, SelectInput, RecordContextProvider, useGetOne, useDataProvider, Loading,Error  } from 'react-admin';
import { Route,useParams } from "react-router-dom";
import { useQuery } from 'react-query';
import { TenantList } from './tenants';
import { Card, CardContent } from '@mui/material';

const filters = [
    <TextInput source="clientId" label="Search" alwaysOn></TextInput>
];
//==="admin"?:<EditButton label="reset secret"></EditButton>
export const ApiClientList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField source="clientId"></TextField>
            <TextField source="role"></TextField>
            <FunctionField label="Operation" render={record =>
                record.role !== "admin" && (
                    <WrapperField>
                        <EditButton label="reset secret"></EditButton>
                        <Authorize />
                    </WrapperField>
                )
            }>
            </FunctionField>

        </Datagrid>
    </List>
);

export const ApiClientCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="clientId"></TextInput>
            <PasswordInput source='clientSecret'></PasswordInput>
        </SimpleForm>
    </Create>
);

export const ApiClientModifySecret = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="clientId" disabled></TextInput>
            <TextInput source="clientSecret"></TextInput>
        </SimpleForm>
    </Edit>
);

export const ApiClientAuthorize = () => {
    let params = useParams();
    const id=params.id;
    const dataProvider = useDataProvider();
    const { data, isLoading, error } = useQuery(
        ['apiclient', 'getApiClientScopes', { id: id }], 
        () => dataProvider.getApiClientScopes('apiclient', { id: id })
    );

    if (isLoading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    //const { data, isLoading, error } = useGetOne('apiclient', { id });
    return(
        <div>
            <Title title="Book Edition" />
            <Card>
                <SimpleForm record={data.data}>
                    <TextInput source="clientId" disabled></TextInput>
                    
                </SimpleForm>
            </Card>
        </div>
    );
};


const Authorize = () => {
    var record = useRecordContext();
    const redirect = useRedirect();
    const handleClick = () => {
        redirect('/clientAuthorize/' + record.id);
    };

    return <Button label="authorize" onClick={handleClick}></Button>;
};
