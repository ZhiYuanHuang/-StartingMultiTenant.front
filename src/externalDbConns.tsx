import { Create, CreateButton, Datagrid, DateField, Edit, EditButton, List, Loading, ReferenceInput, RichTextField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, Title, TopToolbar, useCreateController, useRedirect } from "react-admin";
import { DbInfoInput } from "./createDbScripts";
import { Route, useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Card } from "@mui/material";
import { useState } from 'react';
import Button from '@mui/material/Button';
import * as React from 'react';
import { ConnStrShow } from "./internalDbConns";

const filters = [
    <ReferenceInput source="serviceIdentifier" label="serviceIdentifier" reference="serviceInfo" alwaysOn></ReferenceInput>,
];

const filters2 = [
    <ReferenceInput source="tenantDomainId" label="Domain" reference="tenantDomain" alwaysOn></ReferenceInput>,
    <TextInput source="tenantIdentifier" label="tenantIdentifier" alwaysOn></TextInput>,
    ...filters
];

const ListActions = (props) => {
    const { tenantDomain, tenantIdentifier,btnLabel } = props;

    return (
        <TopToolbar>
            {/* <Button label="Create" onClick={handleClick}></Button> */}
            {/* pathname: `/externalDbConn/create/${tenantDomain}/${tenantIdentifier}`, */}
            <Button
                component={Link}
                to={{
                    pathname: `/externalDbConn/create`,
                }}
                state={{ record: { tenantDomain: tenantDomain, tenantIdentifier: tenantIdentifier } }}
            >
                {btnLabel??"Create"}
            </Button>
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

export const TenantExternalDbConnCreate = (props) => {
    let location = useLocation();
    console.log(location.state);
    const [record] = useState(location.state);

    if (record == null) {
        return <ExternalDbConnCreate />;
    }

    const Actions=()=>(
        <TopToolbar>
            <Button
                component={Link}
                to={{
                    pathname: `/externalDbConn`,
                }}
                state={{ record: { tenantDomain: record.record.tenantDomain, tenantIdentifier: record.record.tenantIdentifier } }}
            >
                Return
            </Button>
        </TopToolbar>
    );

    return (
        <Create redirect={false} resource="externalDbConn" record={record.record} 
            actions={<Actions />}>
            <SimpleForm>
                <TextInput source="tenantDomain" disabled></TextInput>
                <TextInput source="tenantIdentifier" disabled></TextInput>
                <ReferenceInput label="serviceIdentifier" source="serviceInfoId" reference="serviceInfo">
                    <SelectInput />
                </ReferenceInput>
                <DbInfoInput source="dbInfoId"></DbInfoInput>
                <TextInput source="dbConnStr" multiline fullWidth />
            </SimpleForm>
        </Create>
    );
};

//==="admin"?:<EditButton label="reset secret"></EditButton>
export const TenantExternalDbConnList = (props) => {
    const { tenantDomain, tenantIdentifier } = props;

    return (
        <List empty={false} actions={<ListActions tenantDomain={tenantDomain} tenantIdentifier={tenantIdentifier} />} resource="externalDbConn" filters={filters} filter={{ tenantDomain: tenantDomain, tenantIdentifier: tenantIdentifier }}>
            <Datagrid  expand={<ConnStrShow source="dbConnStr" hasOverride={true}/>} >
                <TextField source="tenantDomain"></TextField>
                <TextField source="tenantIdentifier"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                {/* <TextField source="dbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField>
                <TextField source="overrideDbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField> */}
                <DateField source="updateTime" showTime />
                <ShowButton></ShowButton>
                <EditButton></EditButton>
            </Datagrid>
        </List>
    )
};

export const ExternalDbConnList = () => {
    let location = useLocation();
    console.log(location.state);
    const [record] = useState(location.state);

    if (record.record != undefined) {

        const { tenantDomain, tenantIdentifier } = record.record;
        return <TenantExternalDbConnList tenantDomain={tenantDomain} tenantIdentifier={tenantIdentifier} />;
    }

    return (
        <List filters={filters2}>
            <Datagrid>
                <TextField source="tenantDomain"></TextField>
                <TextField source="tenantIdentifier"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                <TextField source="dbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField>
                <TextField source="overrideDbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField>
                <DateField source="updateTime" showTime />
                <ShowButton></ShowButton>
                <EditButton></EditButton>
            </Datagrid>
        </List>
    );
}

export const ExternalDbConnCreate = () => {
    let location = useLocation();
    console.log(location.state);
    const [record] = useState(location.state);

    return (
        <Create resource="externalDbConn">
            <SimpleForm>
                <ReferenceInput label="tenantDomain" source="tenantDomainId" reference="tenantDomain">
                    <SelectInput />
                </ReferenceInput>
                <TextInput source="tenantIdentifier"></TextInput>
                <ReferenceInput label="serviceIdentifier" source="serviceInfoId" reference="serviceInfo">
                    <SelectInput />
                </ReferenceInput>
                <DbInfoInput source="dbInfoId"></DbInfoInput>
                <TextInput source="dbConnStr" multiline fullWidth />
            </SimpleForm>
        </Create>
    );
};

export const ExternalDbConnModify = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="tenantDomain" disabled></TextInput>
            <TextInput source="tenantIdentifier" disabled></TextInput>
            <TextInput source="serviceIdentifier" disabled></TextInput>
            <TextInput source="dbIdentifier" disabled></TextInput>
            <TextInput source="dbConnStr" multiline fullWidth />
        </SimpleForm>
    </Edit>
);

export const ExternalDbConnShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="tenantDomain"></TextField>
            <TextField source="tenantIdentifier"></TextField>
            <TextField source="serviceIdentifier"></TextField>
            <TextField source="dbIdentifier"></TextField>
            <DateField source="updateTime" showTime />
            <RichTextField source="dbConnStr" />
        </SimpleShowLayout>
    </Show>
);

