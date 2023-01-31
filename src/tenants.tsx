import { List, Datagrid, TextField, ReferenceField, EditButton, Edit, SimpleForm, ReferenceInput, TextInput, WrapperField, useRecordContext, useRedirect, Create, SelectInput, useDataProvider, CheckboxGroupInput, SelectArrayInput } from "react-admin";
import { Link } from "react-router-dom";
import * as React from 'react';
import { Button } from '@mui/material';
import { useQuery} from 'react-query';

const tenantFilters = [
    <TextInput source="tenantIdentifier" label="tenantIdentifier" alwaysOn></TextInput>,
    <ReferenceInput source="tenantDomain" label="Domain" reference="tenantDomain"></ReferenceInput>,
];

export const TenantList = () => (
    <List filters={tenantFilters}>
        <Datagrid>
            <TextField source="tenantIdentifier" />
            <TextField source="tenantDomain" />

            <TextField source="tenantGuid"></TextField>
            <WrapperField>
                <EditInternalDbConn />
                <EditExternalDbConn />
            </WrapperField>
        </Datagrid>
    </List>
);

export const TenantCreate = () => {
    const testdata={
        createDbScriptIds:[9,10]
    };
    return (
        <Create >
            <SimpleForm>
                <ReferenceInput label="tenantDomain" source="tenantDomainId" reference="tenantDomain">
                    <SelectInput />
                </ReferenceInput>
                <TextInput source="tenantIdentifier"></TextInput>
                <CreateDbScriptInput source="createDbScriptIds" ></CreateDbScriptInput>
            </SimpleForm>
        </Create>
    );
};

export const CreateDbScriptInput=props=>{
    
    var record = useRecordContext();
    var executedDbScriptIds: number[];
    if(record!=undefined || record!=null)
    {
        executedDbScriptIds=record.createDbScriptIds;
    }
    

    const dataProvider = useDataProvider();

    const { data, isLoading, error } = useQuery(
        ['createDbScript', 'getAll'],
        () => dataProvider.getAll('createDbScript')
    );

    if (isLoading) return <SelectArrayInput label="createDbScript" source="createDbScriptIds" choices={[]} disabled />;
    if (error) return null;
    if (!data) return null;

    const choices = data.data.map(value => {
        if(executedDbScriptIds!=undefined && executedDbScriptIds.length>0 && executedDbScriptIds.indexOf(value.id)>-1){
            return { id: value.id, name: `${value.name} ${value.majorVersion}(Created)`,disabled:true };
        }
       return { id: value.id, name: `${value.name} ${value.majorVersion}` };
    });
    
    return <SelectArrayInput label="createDbScript" source="createDbScriptIds" choices={choices} />;
};

const EditExternalDbConn = (props) => {
    var record = useRecordContext();
    // const redirect = useRedirect();
    // const handleClick = () => {
    //     redirect('/externalDbConn/' + record.tenantDomain+'/'+record.tenantIdentifier);
    // };

    return (
        <Button
            component={Link}
            to={{
                pathname: `/externalDbConn`,
            }}
            state={{ record: { tenantDomain: record.tenantDomain, tenantIdentifier: record.tenantIdentifier } }}
        >
            externalDbConn
        </Button>
    );
    // return <Button label="externalDbConn" onClick={handleClick}></Button>;
};

const EditInternalDbConn = (props) => {
    var record = useRecordContext();

    return (
        <Button
            component={Link}
            to={{
                pathname: `/internalDbConn`,
            }}
            state={{ record: { tenantDomain: record.tenantDomain, tenantIdentifier: record.tenantIdentifier } }}
        >
            internalDbConn
        </Button>
    );
};
