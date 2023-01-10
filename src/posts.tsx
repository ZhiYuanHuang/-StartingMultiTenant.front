import { List, Datagrid, TextField, ReferenceField, EditButton,Edit, SimpleForm, ReferenceInput, TextInput } from "react-admin";

export const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="id"></TextField>
      <ReferenceField source="userId" reference="users" />
      <TextField source="id" />
      <TextField source="title" />
      <EditButton></EditButton>
    </Datagrid>
  </List>
);

export const PostEdit=()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled></TextInput>
            <ReferenceInput source="userId" reference="users"></ReferenceInput>
            <TextInput source="title"></TextInput>
            <TextInput source="body" multiline rows={5}></TextInput>
        </SimpleForm>
    </Edit>
);