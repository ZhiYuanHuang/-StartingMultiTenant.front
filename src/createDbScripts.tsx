import { Create, Datagrid, Error, FileField, FileInput, List, Loading, RecordContextProvider, ReferenceInput, RichTextField, SelectField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, useDataProvider, useRecordContext, useShowContext, useShowController } from "react-admin";
import { DbTypeChoices } from "./dbServers";
import { useWatch } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';
import { useParams } from "react-router-dom";
import { DataBaseUrl } from "./dataProvider";
import { useCallback, useState } from "react";
import { TextareaAutosize } from '@mui/base';
import {useDropzone} from 'react-dropzone';

const filters = [
    <TextInput source="name" label="name" alwaysOn></TextInput>,
];
export const CreateDbScriptList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField label="name" source="name"></TextField>
            <TextField label="majorVersion" source="majorVersion"></TextField>
            <TextField label="serviceIdentifier" source="serviceIdentifier"></TextField>
            <TextField label="dbIdentifier" source="dbIdentifier"></TextField>
            <SelectField label="dbType" source="dbType" choices={DbTypeChoices} />
            
            <ShowButton></ShowButton>
        </Datagrid>
    </List>
);

export const CreateDbScriptCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="name" source="name"></TextInput>
            {/* <TextInput label="majorVersion" source="majorVersion"></TextInput> */}
            <ReferenceInput label="serviceIdentifier" source="serviceInfoId" reference="serviceInfo">
                <SelectInput />
            </ReferenceInput>
            <DbInfoInput source="dbInfoId"></DbInfoInput>
            <SelectInput label="dbType" source="dbType" choices={DbTypeChoices} />
            {/* <MyDropzone ></MyDropzone> */}
            <FileInput source="attachments">
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
);

const DbInfoInput = props => {
    const serviceInfoId = useWatch({ name: 'serviceInfoId' });

    const dataProvider = useDataProvider();

    const { data, isLoading, error } = useQuery(
        ['dbinfo', 'getDbInfoByService', { id: serviceInfoId }],
        () => {
            if (serviceInfoId == null || serviceInfoId === 0) {
                return Promise.resolve({
                    data: []
                })
            }
            return dataProvider.getDbInfoByService('getDbInfoByService', { id: serviceInfoId });
        }
    );

    if (isLoading) return <SelectInput label="dbIdentifier" source="dbInfoId" choices={[]} disabled />;
    if (error) return null;
    if (!data) return null;

    const choices = data.data.map(value => ({ id: value.id, name: value.identifier }));

    return (
        <SelectInput label="dbIdentifier" source="dbInfoId" choices={choices} />
    );
};

export const CreateDbScriptShow = () => {

    let params = useParams();
    const id = params.id;

    const url = `${DataBaseUrl}/api/createdbscript/GetScriptContent?scriptId=${id}`;

    const data = {
        //id:record.id,
        url: url
    }
    return (
        <Show>
            <SimpleShowLayout>
                {/* <SelectField source="dbType" choices={dbTypeChoices} /> */}
                <TextField source="name"></TextField>
                <TextField source="majorVersion"></TextField>
                <TextField source="serviceIdentifier"></TextField>
                <TextField source="dbIdentifier"></TextField>
                <SelectField source="dbType" choices={DbTypeChoices} />
                <SqlFileShow scriptId={id} resource="createdbscript"></SqlFileShow>
                {/* <RecordContextProvider value={data}>
                    <FileField source="url" title="sqlFile" target="_blank" />
                </RecordContextProvider> */}
                {/* <FileField source={url} title="" target="_blank" /> */}
            </SimpleShowLayout>
        </Show>
    );
};


export const SqlFileShow = (props) => {
    const { scriptId, resource } = props;
    const dataProvider = useDataProvider();
    const [fileContent, setFileContent] = useState<string>("");
    const { data, isLoading, error } = useQuery(
        ['createdbscript', 'getDbScriptContent', { id: scriptId }],
        () => dataProvider.getDbScriptContent('createdbscript', { id: scriptId })
    );

    if (isLoading) {
        return <RichTextField fullWidth stripTags></RichTextField>
    }
    if (error) {
        return <Error />;
    }
    if (!data) return null;

    const reader = new FileReader();

    reader.readAsText(data, 'utf-8');
    reader.onload = function () {
        console.log(this.result)
        setFileContent(this.result as string);
    }

    var fileData = { body: fileContent };
    return (
        <TextareaAutosize value={fileContent} readOnly style={{ textDecoration: "none", fontWeight: "bold", fontSize: "16px", color: "#d500f9", width: "100%" }} maxRows={25}></TextareaAutosize>
        // <RecordContextProvider value={fileData}>
        //     <TextareaAutosize value={} style={{ width: 150 }}
        //         placeholder="Enter your text here!" />
        //     {/* <TextField source="body" sx={{ Multiline: 'Multiline' }}/> */}
        //     {/* <textarea value={fileContent} readOnly ></textarea> */}
        //     {/* <RichTextField  source="body" label="sqlFile" fullWidth /> */}
        // </RecordContextProvider>
    );
};


