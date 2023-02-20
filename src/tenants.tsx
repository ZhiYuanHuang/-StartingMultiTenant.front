import { List, Datagrid, TextField, ReferenceField, EditButton, Edit, SimpleForm, ReferenceInput, TextInput, WrapperField, useRecordContext, useRedirect, Create, SelectInput, useDataProvider, CheckboxGroupInput, SelectArrayInput, RadioButtonGroupInput, TopToolbar, FilterButton, CreateButton, DateField, reactAdminFetchActions, Loading, useNotify, LinearProgress, Confirm } from "react-admin";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import * as React from 'react';
import { Button } from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { useState } from "react";
import { appResponseDto } from "./generalClass";
import { DataBaseUrl } from "./dataProvider";

const tenantFilters = [
    <TextInput source="tenantIdentifier" label="tenantIdentifier" alwaysOn></TextInput>,
    <ReferenceInput source="tenantDomain" label="Domain" reference="tenantDomain"></ReferenceInput>,
];

const ListActions = (props) => {
    return (
        <TopToolbar>
            <FilterButton />
            <CreateButton />
            <Button
                component={Link}
                to={{
                    pathname: `/batchExecute`,
                }}
                state={{ record: { TaskType: "fullSyncToExternalStore" } }}
            >
                BatchSyncEnternalStore
            </Button>
            <Button
                component={Link}
                to={{
                    pathname: `/batchExecute`,
                }}
                state={{ record: { TaskType: "TriggerAllClear" } }}
            >
                TriggerAllClear
            </Button>
        </TopToolbar>
    )
};

export const TenantList = () => (
    <List actions={<ListActions></ListActions>} filters={tenantFilters}>
        <Datagrid>
            <TextField source="tenantIdentifier" />
            <TextField source="tenantDomain" />
            <TextField source="tenantName"></TextField>
            {/* <TextField source="tenantGuid"></TextField> */}
            <DateField source="createTime" showTime></DateField>
            <DateField source="updateTime" showTime></DateField>
            <WrapperField>
                <EditButton label="Modify"></EditButton>
                <EditInternalDbConn />
                <EditExternalDbConn />
                <TriggerModifyButton></TriggerModifyButton>
                <SyncEnternalStore></SyncEnternalStore>

            </WrapperField>
        </Datagrid>
    </List>
);

export const TenantCreateModify = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="tenantDomain" disabled></TextInput>
            <TextInput source="tenantIdentifier" disabled></TextInput>
            <TextInput source="tenantGuid" disabled></TextInput>
            <TextInput source="tenantName"></TextInput>
            <TextInput source="description"></TextInput>
            {/* <CreateDbScriptInput isModify={true} source="createDbScriptIds" ></CreateDbScriptInput> */}
            <CreateDbScriptInput2></CreateDbScriptInput2>
        </SimpleForm>
    </Edit>
);

export const TenantCreate = () => {

    const testdata = {
        createDbScriptIds: [9, 10]
    };
    const choice1 = [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
    ];
    const choice2 = [
        { id: 4, name: "4" },
        { id: 5, name: "5" },
        { id: 6, name: "6" },
    ];
    const choice3 = [
        { id: 7, name: "7" },
        { id: 8, name: "8" },
        { id: 9, name: "9" },
    ];
    const source1 = "testids.test1";
    const source2 = "testids.test2";
    const source3 = "testids.test3";
    return (
        <Create >
            <SimpleForm>
                <ReferenceInput label="tenantDomain" source="tenantDomainId" reference="tenantDomain">
                    <SelectInput />
                </ReferenceInput>
                <TextInput source="tenantIdentifier"></TextInput>
                <TextInput source="tenantName"></TextInput>
                <TextInput source="description"></TextInput>

                {/* <CreateDbScriptInput source="createDbScriptIds" ></CreateDbScriptInput> */}
                <CreateDbScriptInput2></CreateDbScriptInput2>
                {/* <SelectInput label="1" source={source1} choices={choice1}></SelectInput>
                <SelectInput label="2" source={source2} choices={choice2}></SelectInput>
                <SelectInput label="3" source={source3} choices={choice3}></SelectInput> */}
            </SimpleForm>
        </Create>
    );
};


export const CreateDbScriptInput = props => {
    const { isModify } = props;
    var record = useRecordContext();
    var executedDbScriptIds: number[];
    if (record != undefined || record != null) {
        executedDbScriptIds = record.createDbScriptIds;
    }


    const dataProvider = useDataProvider();

    const { data, isLoading, error } = useQuery(
        ['createDbScript', 'getAll'],
        () => dataProvider.getAll('createDbScript')
    );

    if (isLoading) return <SelectArrayInput label="createDbScript" source={isModify ? "newCreateDbScriptIds" : "createDbScriptIds"} choices={[]} disabled />;
    if (error) return null;
    if (!data) return null;

    const choices = data.data.map(value => {
        if (executedDbScriptIds != undefined && executedDbScriptIds.length > 0 && executedDbScriptIds.indexOf(value.id) > -1) {
            return { id: value.id, name: `${value.name} ${value.majorVersion}(Created)`, disabled: true };
        }
        return { id: value.id, name: `${value.name} ${value.majorVersion}` };
    });
    return <SelectArrayInput label="createDbScript" source={isModify ? "newCreateDbScriptIds" : "createDbScriptIds"} choices={choices} />;
};

export const CreateDbScriptInput2 = props => {
    const { isModify } = props;
    var record = useRecordContext();
    var executedDbScriptIds: number[];
    if (record != undefined || record != null) {
        executedDbScriptIds = record.createDbScriptIds;
    }


    const dataProvider = useDataProvider();

    const { data, isLoading, error } = useQuery(
        ['createDbScript', 'getGroupCreateScript'],
        () => dataProvider.getGroupCreateScript('createDbScript')
    );

    if (isLoading) return null;
    if (error) return null;
    if (!data) return null;

    const createDbs = "createDbs";
    return data.data.map((item, index) => {
        const source = `${createDbs}.${item.name}`;

        const choices = item.versionScripts.map(value => {
            if (executedDbScriptIds != undefined && executedDbScriptIds.length > 0 && executedDbScriptIds.indexOf(value.id) > -1) {
                return { id: value.id, name: `${value.name} ${value.majorVersion}.${value.minorVersion}(Created)`, disabled: true };
            }
            return { id: value.id, name: `${value.name} ${value.majorVersion}.${value.minorVersion}` };
        });

        return (
            <RadioButtonGroupInput key={source} label={`${item.name}(${item.serviceName}——${item.dbName})`} source={source} choices={choices} />
        );
    });
};

const EditExternalDbConn = (props) => {
    var record = useRecordContext();
    // const redirect = useRedirect();
    // const handleClick = () => {
    //     redirect('/externalDbConn/' + record.tenantDomain+'/'+record.tenantIdentifier);
    // };

    return (
        <Button
            component={Link}
            to={{
                pathname: `/externalDbConn`,
            }}
            state={{ record: { tenantDomain: record.tenantDomain, tenantIdentifier: record.tenantIdentifier } }}
        >
            externalDbConn
        </Button>
    );
    // return <Button label="externalDbConn" onClick={handleClick}></Button>;
};

const EditInternalDbConn = (props) => {
    var record = useRecordContext();

    return (
        <Button
            component={Link}
            to={{
                pathname: `/internalDbConn`,
            }}
            state={{ record: { tenantDomain: record.tenantDomain, tenantIdentifier: record.tenantIdentifier } }}
        >
            internalDbConn
        </Button>
    );
};

const SyncEnternalStore = (props) => {
    var record = useRecordContext();

    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(false);
    const notify = useNotify();

    if (loading) {
        return (<LinearProgress />)
    }

    const handleClick = () => {
        setLoading(true);

        dataProvider.syncToExternalStore(record)
            .then((json: appResponseDto) => {
                if (json.errorCode == 0) {
                    notify('success');
                }
                else {
                    notify('error');
                }
            })
            .catch((e) => {
                notify('Error', { type: 'error' })
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (<Button onClick={handleClick}>SyncToEnternalStore</Button>);
};

export const BatchExecuteTask = (props) => {
    let location = useLocation();
    const redirect = useRedirect();
    console.log(location.state);
    const [record] = useState(location.state);
    const [open, setOpen] = useState(true);
    const notify = useNotify();
    const dataProvider = useDataProvider();

    if (record == null) {
        redirect('tenant');
    }

    const { mutate, isLoading, isError } = useMutation(
        ['tenant', 'fullTask', { id: record.record.TaskType }],
        () => dataProvider.fullExecute(record.record)
    );

    if (isLoading) {
        return <Loading />
    }
    if (isError) {
        return <Error></Error>
    }


    const handleDialogClose = () => {
        setOpen(false);

        redirect('list', 'tenant');
    };
    const handleConfirm = () => {
        mutate(null, {
            onSuccess: () => {
                notify('success');
                redirect('list', 'tenant');
            },
            onError: () => {
                notify('error');
                redirect('list', 'tenant');
            }
        });
        setOpen(false);
    };

    return (
        <div>
            <Confirm
                isOpen={open}
                title={record.record.TaskType=="fullSyncToExternalStore"? "Full Sync To ExternalStore":"FullTriggerModify"}
                content="Are you sure you want to full execute?"
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </div>
    );
};

const TriggerModifyButton = (props) => {
    var record = useRecordContext();

    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(false);
    const notify = useNotify();

    if (loading) {
        return (<LinearProgress />)
    }

    const handleClick = () => {
        setLoading(true);

        dataProvider.triggerDbConnsModify(record)
            .then((json: appResponseDto) => {
                if (json.errorCode == 0) {
                    notify('success');
                }
                else {
                    notify('error');
                }
            })
            .catch((e) => {
                notify('Error', { type: 'error' })
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (<Button onClick={handleClick}>TriggerModify</Button>);
};

