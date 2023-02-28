import { BooleanField, BooleanInput, Create, Datagrid, List, SelectField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, Title, useDataProvider, Loading, RecordContextProvider, ReferenceField, NumberField, Button, useRecordContext, useRedirect, ReferenceInput, useNotify, Confirm, EditButton, Edit } from "react-admin";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { useState } from "react";

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
    <SelectInput source="dbType" choices={DbTypeChoices} alwaysOn />
];

export const DbServerList = () => (
    <List filters={filters}>
        <Datagrid>
            <SelectField source="dbType" choices={DbTypeChoices} />
            <TextField source="serverHost"></TextField>
            <TextField source="serverPort"></TextField>
            <BooleanField source="canCreateNew" />
            <ShowButton />
            <EditButton></EditButton>
            <ExchangeBtn></ExchangeBtn>
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

export const DbServerEdit = () => (
    <Edit>
        <SimpleForm>
            <SelectInput source="dbType" choices={DbTypeChoices} disabled/>
            <TextInput source="serverHost" disabled></TextInput>
            <TextInput source="serverPort" disabled></TextInput>
            <TextInput source="userName" disabled/>
            <TextInput source="userPwd" disabled></TextInput>
            <BooleanInput label="CanCreateNew" source="canCreateNew" />
        </SimpleForm>
    </Edit>
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


const ExchangeBtn = () => {
    var record = useRecordContext();
    const redirect = useRedirect();
    const handleClick = () => {
        redirect('/dbserverExchange/' + record.id);
    };

    return <Button label="Exchange" onClick={handleClick}></Button>;
};

export const DbServerExchange = () => {
    let params = useParams();
    const id = params.id;
    const dataProvider = useDataProvider();
    const [open, setOpen] = useState(true);

    const { data, isLoading, error } = useQuery(
        ['dbServer', 'getServerRef', { id: id }],
        () => dataProvider.getStatRef('dbServer', { id: id })
    );

    const notify = useNotify();
    const navigate = useNavigate();

    const { mutate, isLoading: isSubmitting } = useMutation(
        (formData) => dataProvider.exchangeDbServer(formData)
    );

    const onSubmit = (formData) => {
        if (formData.dbServerId == formData.newDbServerId) {
            notify("cann't same one!");
            return;
        }
        mutate(
            { data: formData },
            {
                onSuccess: () => {
                    notify('exchange success');
                    navigate('/dbserver');
                }
            }
        );
    };

    if (isLoading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    const handleDialogClose = () => {
        setOpen(false);
    };
    const handleConfirm = () => {
        setOpen(false);
    };

    return (
        <RecordContextProvider value={data.data}>
            <div>
                <Title title="exchange db"></Title>
                <Confirm
                    isOpen={open}
                    title="Please manually migrate the database first"
                    content="Are you sure you complete to migrate all dbs?"
                    onConfirm={handleConfirm}
                    onClose={handleDialogClose}
                />
                <Card>
                    <CardContent>
                        <SimpleShowLayout>
                            <ReferenceField label="originDb" source="dbServerId" reference="dbServer" />
                            <NumberField label="domainRef" source="tenantDomainCount" />
                            <NumberField label="tenantRef" source="tenantCount" />
                            <NumberField label="serviceRef" source="serviceCount" />
                            <NumberField label="dbConnRef" source="dbConnCount" />
                        </SimpleShowLayout>
                        <SimpleForm record={data.data} onSubmit={onSubmit}>
                            <ReferenceInput label="toExchangeDb" source="newDbServerId" reference="dbServer">
                                <SelectInput />
                            </ReferenceInput>
                        </SimpleForm>
                    </CardContent>

                </Card>
            </div>
        </RecordContextProvider>

    );
}

