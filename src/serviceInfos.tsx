import { Create, Datagrid, Edit, EditButton, List, SimpleForm, TextField, TextInput } from "react-admin";

const filters = [
    <TextInput source="name" label="name" alwaysOn></TextInput>,
    <TextInput source="identifier" label="identifier" alwaysOn></TextInput>
];
//==="admin"?:<EditButton label="reset secret"></EditButton>
export const ServiceInfoList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField source="name"></TextField>
            <TextField source="identifier"></TextField>
            <TextField source="description" sx={{ textOverflow: 'ellipsis' }}></TextField>
            <EditButton></EditButton>
        </Datagrid>
    </List>
);

export const ServiceInfoCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name"></TextInput>
            <TextInput source="identifier"></TextInput>
            <TextInput source="description" multiline  />
        </SimpleForm>
    </Create>
);

export const ServiceInfoModify = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name"></TextInput>
            <TextInput source="identifier"></TextInput>
            <TextInput source="description" multiline fullWidth />
        </SimpleForm>
    </Edit>
);

