import { List, Datagrid, TextField, TextInput, SimpleForm, Create, PasswordInput, Edit, EditButton, useRecordContext, FunctionField, WrapperField, Button, CustomRoutes, Resource, Admin, Title, useRedirect, EditBase, SelectInput, RecordContextProvider, useGetOne, useDataProvider, Loading, Error, SelectArrayInput, useNotify, useUpdate } from 'react-admin';
import { Route, useParams,useNavigate } from "react-router-dom";
import { useQuery, useMutation } from 'react-query';
import { TenantList } from './tenants';
import { Card, CardContent } from '@mui/material';
import { useState } from 'react';
import { dataProvider } from './dataProvider';

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
    const id = params.id;
    const dataProvider = useDataProvider();
    const { data, isLoading, error } = useQuery(
        ['apiclient', 'getApiClientScopes', { id: id }],
        () => dataProvider.getApiClientScopes('apiclient', { id: id })
    );

    const {mutate, isLoading: isSubmitting } = useMutation(
        //['authorizeApiClient', { id: id }],
         (formData)=>dataProvider.authorizeApiClient(formData)
    );
//     const [update, { isLoading: isSubmitting }] = useUpdate();
  const navigate = useNavigate();
  const onSubmit = (formData) => {
    mutate(
        {data:formData},
        { onSuccess: () => { navigate('/apiclient'); } }
    );
  };

    // const { mutate  } = useMutation(
    //     ['authorizeApiClient', { ...data.data }],
    //     () => dataProvider.authorizeApiClient({ ...data.data })
    // );

    if (isLoading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    //const { data, isLoading, error } = useGetOne('apiclient', { id });
    //const navigate = useNavigate();
    
    return (
        <div>
            <Title title="ApiClient Authorize" />
            <Card>
                <SimpleForm record={data.data} onSubmit={onSubmit}>
                    <TextInput source="clientId" disabled></TextInput>
                    <ScopeSelectForm></ScopeSelectForm>
                    {/* <SelectArrayInput label="scopes" source="scopes" choices={[
                { id: 'read', name: 'read' },
                { id: 'write', name: 'write' },
                { id: 'ss', name: 'ss' },
            ]} /> */}
                </SimpleForm>
            </Card>
        </div>
    );
};

const ScopeSelectForm = () => {
    const dataProvider = useDataProvider();
    const { data, isLoading, error } = useQuery(
        ['apiscope', 'getApiScopes'],
        () => dataProvider.getApiScopes('apiscope')
    );

    if (isLoading) return <SelectArrayInput label="scopes" source="scopes" disabled />;
    if (error) return null;
    if (!data) return null;

    const choices = data.data.map(value => ({ id: value.name, name: value.name }));

    return (
        <SelectArrayInput label="scopes" source="scopes" choices={choices} />
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
