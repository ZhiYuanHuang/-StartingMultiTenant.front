import { BooleanField, BooleanInput, Create, Datagrid, List, SelectField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput } from "react-admin";

export const DbTypeChoices = [
    {
        id: 0,
        name: 'Postgres'
    },
    {
        id: 1,
        name: 'Mysql'
    },
];

const filters = [
    <TextInput source="serverHost" label="serverHost" alwaysOn></TextInput>,
    <SelectInput source="dbType" choices={DbTypeChoices} alwaysOn/>
];

export const DbServerList = () => (
    <List filters={filters}>
        <Datagrid>
            <SelectField source="dbType" choices={DbTypeChoices} />
            <TextField source="serverHost"></TextField>
            <TextField source="serverPort"></TextField>
            <BooleanField source="canCreateNew" />
            <ShowButton/>
        </Datagrid>
    </List>
);

export const DbServerCreate = () => (
    <Create>
        <SimpleForm>
            <SelectInput source="dbType" choices={DbTypeChoices} />
            <TextInput source="serverHost"></TextInput>
            <TextInput source="serverPort"></TextInput>
            <TextInput source="userName" />
            <TextInput source="userPwd"></TextInput>
            <BooleanInput label="CanCreateNew" source="canCreateNew" />
        </SimpleForm>
    </Create>
);

export const DbServerShow = () => (
    <Show>
        <SimpleShowLayout>
            <SelectField source="dbType" choices={DbTypeChoices} />
            <TextField source="serverHost"></TextField>
            <TextField source="serverPort"></TextField>
            <TextField source="userName"></TextField>
            <TextField source="userPwd"></TextField>
            <BooleanField source="canCreateNew" />
        </SimpleShowLayout>
    </Show>
);


