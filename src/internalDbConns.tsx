import { RichTextField,Datagrid, FunctionField, List, NotFound, ReferenceField, ReferenceInput, Show, ShowButton, SimpleShowLayout, TextField, TopToolbar } from "react-admin";
import Button from '@mui/material/Button';
import * as React from 'react';
import { useState } from 'react';
import { Route, useParams, useNavigate, useLocation, Link } from "react-router-dom";

const ListActions = (props) => {
    return (
        <TopToolbar>
            
            <Button
                component={Link}
                to={{
                    pathname: `/tenant`,
                }}
            >
                Return
            </Button>
        </TopToolbar>
    )
};

const filters = [
    <ReferenceInput source="serviceIdentifier" label="serviceIdentifier" reference="serviceInfo" alwaysOn></ReferenceInput>,
];

export const TenantInternalDbConnList = () => {
    let location = useLocation();
    console.log(location.state);
    const [record] = useState(location.state);

    if (record.record == undefined) {
        return <NotFound></NotFound>
    }

    return (
        <List empty={false} actions={<ListActions />} resource="internalDbConn" filters={filters} filter={{ tenantDomain: record.record.tenantDomain, tenantIdentifier: record.record.tenantIdentifier }}>
            <Datagrid>
                <TextField source="tenantDomain"></TextField>
                <TextField source="tenantIdentifier"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                <FunctionField label="schema version" render={record => `${record.createScriptName} ${record.createScriptVersion}.${record.curSchemaVersion}`} />
                <ReferenceField source="dbServerId" reference="dbServer" />

                <TextField source="dbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField>
                <ShowButton></ShowButton>
            </Datagrid>
        </List>
    )
};

export const InternalDbConnShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="tenantDomain"></TextField>
            <TextField source="tenantIdentifier"></TextField>
            <TextField source="serviceIdentifier"></TextField>
            <TextField source="dbIdentifier"></TextField>
            <FunctionField label="schema version" render={record => `${record.createScriptName} ${record.createScriptVersion}.${record.curSchemaVersion}`} />
            <ReferenceField source="dbServerId" reference="dbServer" />
            <RichTextField source="dbConnStr" />
        </SimpleShowLayout>
    </Show>
);