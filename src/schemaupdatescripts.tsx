import { Create, Datagrid, Error, FileField, FileInput, List, Loading, RecordContextProvider, ReferenceField, ReferenceInput, RichTextField, SelectField, SelectInput, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, Title, useDataProvider, useRecordContext, useShowContext, useShowController } from "react-admin";
import { DbTypeChoices } from "./dbServers";
import { useWatch } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';
import { useParams, Link, useLocation } from "react-router-dom";
import { DataBaseUrl } from "./dataProvider";
import { useCallback, useRef, useState } from "react";
import { TextareaAutosize } from '@mui/base';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import BusinessNotification from "./BusinessNotification";
import { Box } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

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
            <ExecuteUpdateBtn></ExecuteUpdateBtn>
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
                <FileField source="src" title="title" label="updateScriptFile" />
            </FileInput>

            <FileInput source="rollBackScriptAttachments">
                <FileField source="src" title="title" label="RollBackScriptFile" />
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

const ExecuteUpdateBtn = () => {
    var record = useRecordContext();

    return (
        <Button
            component={Link}
            to={{
                pathname: `/schemaupdatescript/execute`,
            }}
            state={{ record: record }}
        >
            execute
        </Button>
    );
};


export const SchemaUpdateScriptExecute = (props) => {
    let location = useLocation();
    console.log(location.state);
    const [data] = useState(location.state);
    const [notifyContent, setNotifyContent] = useState<string>("");
    const [notifyMsgList, setNotifyMsgList] = useState<string[]>([]);
    //const notifyContentRef = useRef(notifyContent)

    if (data == null) {
        return null;
    }

    return (
        <RecordContextProvider value={data.record}>
            <div>
                <Title title="Book Show" />
                <Card>
                    <CardContent>
                        <SimpleShowLayout>
                            <TextField label="name" source="name" />
                            <ReferenceField label="createDbScript" source="createDbScriptId" reference="createDbScript" />
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <span>UpdateScript:</span>
                                    <SqlFileShow scriptId={data.record.id} resource="schemaupdatescript" maxRows={10}></SqlFileShow>
                                </Grid>
                                <Grid xs={6}>
                                    <span>RollBackScript:</span>
                                    <RollBackSqlFileShow maxRows={15} scriptId={data.record.id} resource="schemaupdatescript"></RollBackSqlFileShow>
                                </Grid>
                            </Grid>
                            
                            <BusinessNotification data={data.record.id} notifyBusiness="schemaUpdate"></BusinessNotification>
                            {/* <LogBox logList={notifyMsgList}></LogBox>
                            <TextareaAutosize value={notifyContent} readOnly style={{ textDecoration: "none", fontWeight: "bold", fontSize: "16px", color: "#d500f9", width: "100%" }} maxRows={25}></TextareaAutosize> */}
                        </SimpleShowLayout>
                    </CardContent>
                </Card>

            </div>
        </RecordContextProvider>
    );
};

const SqlFileShow = (props) => {
    const { scriptId, resource,maxRows } = props;
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

    var theMaxRows=25;
    if(maxRows!=undefined && maxRows!=null){
        theMaxRows=maxRows;
    }

    var fileData = { body: fileContent };
    return (
        <TextareaAutosize value={fileContent} readOnly style={{ textDecoration: "none", fontWeight: "bold", fontSize: "16px", color: "#d500f9", width: "100%" }} maxRows={theMaxRows}></TextareaAutosize>
    );
};

const RollBackSqlFileShow = (props) => {
    const { scriptId, resource,maxRows } = props;
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

    var theMaxRows=25;
    if(maxRows!=undefined && maxRows!=null){
        theMaxRows=maxRows;
    }

    var fileData = { body: fileContent };
    return (
        <TextareaAutosize value={fileContent} readOnly style={{ textDecoration: "none", fontWeight: "bold", fontSize: "16px", color: "#d500f9", width: "100%" }} maxRows={theMaxRows}></TextareaAutosize>
    );
};


