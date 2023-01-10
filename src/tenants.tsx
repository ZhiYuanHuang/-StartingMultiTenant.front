import { List, Datagrid, TextField, ReferenceField, EditButton, Edit, SimpleForm, ReferenceInput, TextInput } from "react-admin";

const tenantFilters = [
    <TextInput source="tenantIdentifier" label="Search" alwaysOn></TextInput>,
    <ReferenceInput source="tenantDomain" label="Domain" reference="tenantDomain"></ReferenceInput>,
];

export const TenantList = () => (
    <List filters={tenantFilters}>
        <Datagrid>
            <TextField source="tenantIdentifier" />
            <TextField source="tenantDomain" />

            <TextField source="tenantGuid"></TextField>
            <EditButton></EditButton>
        </Datagrid>
    </List>
);
