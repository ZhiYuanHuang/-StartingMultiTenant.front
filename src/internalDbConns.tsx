import { RichTextField, Datagrid, FunctionField, List, NotFound, ReferenceField, ReferenceInput, Show, ShowButton, SimpleShowLayout, TextField, TopToolbar, useRecordContext, DateField } from "react-admin";
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

export const ConnStrShow = (props) => (
    <SimpleShowLayout>
        <RichTextField label="DbConnStr" source={props.source} />
        {props.hasOverride && <RichTextField label="OverrideDbConnStr" source="overrideDbConnStr" />}
    </SimpleShowLayout>
);

export const TenantInternalDbConnList = () => {
    let location = useLocation();
    console.log(location.state);
    const [record] = useState(location.state);

    if (record.record == undefined) {
        return <NotFound></NotFound>
    }

    return (
        <List empty={false} actions={<ListActions />} resource="internalDbConn" filters={filters} filter={{ tenantDomain: record.record.tenantDomain, tenantIdentifier: record.record.tenantIdentifier }}>
            <Datagrid expand={<ConnStrShow source="dbConnStr"/>}>
                <TextField source="tenantDomain"></TextField>
                <TextField source="tenantIdentifier"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                <FunctionField label="schema version" render={record => `${record.createScriptName} ${record.createScriptVersion}.${record.curSchemaVersion}`} />
                <ReferenceField source="dbServerId" reference="dbServer" />
                <DateField label="UpdateTime" source="updateTime" showTime></DateField>
                {/* <TextField source="dbConnStr" sx={{ textOverflow: 'ellipsis' }}></TextField> */}
                <ShowButton></ShowButton>
            </Datagrid>
        </List>
    )
};

const HistoryConnDataGrid = () => {
    var record = useRecordContext();
    
    if(record.historyConns==undefined){
        return null;
    }

    const sort = { field: 'id', order: 'DESC' };
    return (
        <Datagrid expand={<ConnStrShow source="decryptDbConn"/>}
            data={record.historyConns}
            total={record.historyConns.length}
            isLoading={false}
            sort={sort}
            bulkActionButtons={false}
        >
            <FunctionField label="Action" render={(record) => {
                if (record.actionType == 1) {
                    return "CreateOverride";
                }
                else if (record.actionType == 2) {
                    return "SchemaUpdateOverride";
                }
                else if (record.actionType == 3) {
                    return "MigrateOverride";
                }
                return "unknown";
            }}></FunctionField>
            <FunctionField label="schema version" render={record => `${record.createScriptName} ${record.majorVersion}.${record.minorVersion}`} />
            <ReferenceField source="dbServerId" reference="dbServer" />
            <DateField label="CreateTime" source="createTime" showTime></DateField>
        </Datagrid>
    );
};

export const InternalDbConnShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="tenantDomain"></TextField>
                <TextField source="tenantIdentifier"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                <FunctionField label="schema version" render={record => `${record.createScriptName} ${record.createScriptVersion}.${record.curSchemaVersion}`} />
                <ReferenceField source="dbServerId" reference="dbServer" />
                <DateField label="UpdateTime" source="updateTime" showTime></DateField>
                <RichTextField source="dbConnStr" />
                <HistoryConnDataGrid></HistoryConnDataGrid>
            </SimpleShowLayout>
        </Show>
    );
};
