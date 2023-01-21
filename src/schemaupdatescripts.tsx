import { Create, Datagrid, Error, FileField, FileInput, List, Loading, RecordContextProvider, ReferenceField, ReferenceInput, RichTextField, SelectField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, useDataProvider, useRecordContext, useShowContext, useShowController } from "react-admin";
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
    <ReferenceInput source="createDbScriptId" label="createDbScript" reference="createDbScript" alwaysOn></ReferenceInput>,
];
export const SchemaUpdateScriptList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField label="name" source="name"></TextField>
            <ReferenceField source="createDbScriptId" reference="createDbScript" />
            <TextField label="minorVersion" source="minorVersion"></TextField>
            
            <ShowButton></ShowButton>
        </Datagrid>
    </List>
);

export const SchemaUpdateScriptCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="name" source="name"></TextInput>
            
            <ReferenceInput label="createDbScript" source="createDbScriptId" reference="createDbScript">
                <SelectInput />
            </ReferenceInput>
            
            <FileInput source="updateScriptAttachments">
                <FileField source="src" title="title" label="updateScriptFile"/>
            </FileInput>

            <FileInput source="rollBackScriptAttachments">
                <FileField source="src" title="title" label="RollBackScriptFile"/>
            </FileInput>
        </SimpleForm>
    </Create>
);

export const SchemaUpdateScriptShow = () => {

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
                <TextField source="name"></TextField>
                <TextField source="minorVersion"></TextField>
                <ReferenceField source="createDbScriptId" reference="createDbScript" />
                <span>UpdateScript:</span>
                <SqlFileShow scriptId={id} resource="schemaupdatescript"></SqlFileShow>
                <span>RollBackScript:</span>
                <RollBackSqlFileShow scriptId={id} resource="schemaupdatescript"></RollBackSqlFileShow>
            </SimpleShowLayout>
        </Show>
    );
};

const SqlFileShow = (props) => {
    const { scriptId, resource } = props;
    const dataProvider = useDataProvider();
    const [fileContent, setFileContent] = useState<string>("");
    const { data, isLoading, error } = useQuery(
        [resource, 'getDbScriptContent', { id: scriptId }],
        () => dataProvider.getDbScriptContent(resource, { id: scriptId })
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
    );
};

const RollBackSqlFileShow = (props) => {
    const { scriptId, resource } = props;
    const dataProvider = useDataProvider();
    const [fileContent, setFileContent] = useState<string>("");
    const { data, isLoading, error } = useQuery(
        [resource, 'getRollBackScriptContent', { id: scriptId }],
        () => dataProvider.getRollBackScriptContent(resource, { id: scriptId })
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
    );
};


