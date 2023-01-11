import {List,Datagrid, TextField, TextInput, SimpleForm, Create, PasswordInput} from 'react-admin';

const filters=[
    <TextInput source="clientId" label="Search" alwaysOn></TextInput>
];

export const ApiClientList=()=>(
    <List filters={filters}>
        <Datagrid>
            <TextField source="clientId"></TextField>
            <TextField source="role"></TextField>
        </Datagrid>
    </List>
);

export const ApiClientCreate=()=>(
    <Create>
        <SimpleForm>
            <TextInput source="clientId"></TextInput>
            <PasswordInput source='clientSecret'></PasswordInput>
        </SimpleForm>
    </Create>
);