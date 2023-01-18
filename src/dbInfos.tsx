import { Create, Datagrid, Edit, EditButton, List, ReferenceInput, SelectInput, SimpleForm, TextField, TextInput } from "react-admin";

const filters = [
    <TextInput source="name" label="name" alwaysOn></TextInput>,
    <TextInput source="identifier" label="identifier" alwaysOn></TextInput>,
    <ReferenceInput source="serviceInfoId" label="serviceInfo" reference="serviceInfo" alwaysOn></ReferenceInput>,
];

export const DbInfoList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField source="name"></TextField>
            <TextField source="identifier"></TextField>
            <TextField source="description" sx={{ textOverflow: 'ellipsis' }}></TextField>
            <EditButton></EditButton>
        </Datagrid>
    </List>
);

export const DbInfoCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput label="serviceInfo" source="serviceInfoId" reference="serviceInfo">
                <SelectInput />
            </ReferenceInput>
            <TextInput source="name"></TextInput>
            <TextInput source="identifier"></TextInput>
            <TextInput source="description" multiline />
        </SimpleForm>
    </Create>
);

export const DbInfoModify = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput label="serviceInfo" source="serviceInfoId" reference="serviceInfo">
                <SelectInput disabled/>
            </ReferenceInput>
            <TextInput source="name"></TextInput>
            <TextInput source="identifier"></TextInput>
            <TextInput source="description" multiline fullWidth />
        </SimpleForm>
    </Edit>
);

