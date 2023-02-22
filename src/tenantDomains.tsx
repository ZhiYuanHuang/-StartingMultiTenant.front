import { List, Datagrid, TextField, ReferenceField, EditButton,Edit, SimpleForm, ReferenceInput, TextInput, Create } from "react-admin";

const filters=[
    <TextInput source="tenantDomain" label="Search" alwaysOn></TextInput>,
];

export const TenantDomainList = () => (
  <List filters={filters}>
    <Datagrid>
      <TextField source="tenantDomain" />
    </Datagrid>
  </List>
);

export const TenantDomainCreate=()=>(
    <Create>
        <SimpleForm>
            <TextInput source="tenantDomain"></TextInput>
        </SimpleForm>
    </Create>
);

