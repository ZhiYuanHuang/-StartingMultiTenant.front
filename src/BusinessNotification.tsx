import React, { useRef } from "react";
import * as signalR from '@microsoft/signalr';
import { Box } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { Button } from '@mui/material';

const envLists = import.meta.env
export const DataBaseUrl = envLists.VITE_signalRUrl

interface NotifyDataDto {
    scriptId: number,
    notifyLevel: number,
    notifyTitle: string,
    notifyBody: string,
}

class BusinessNotification extends React.Component {
    connection!: signalR.HubConnection;
    constructor(props) {
        super(props);
        this.state = { notifyMsgList: [] };
        this.notifyUpdate = this.notifyUpdate.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    notifyUpdate(data) {
        if (this.props.notifyBusiness == "schemaUpdate") {
            const { scriptId, notifyLevel, notifyTitle, notifyBody } = data;
            console.info(JSON.stringify(data));
            this.setState((state) => ({
                notifyMsgList: [...state.notifyMsgList, data]
            }));
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { message } = this.state;
        this.scrollToBottom();

    }

    scrollToBottom = () => {
        const messagesEndRef = document.getElementById("messagesEndRef");
        messagesEndRef.scrollIntoView({ behavior: "smooth" });
    };

    handleClick = () => {
        this.send(this.props.data);
    };

    render() {
        return (
            // <Container  sx={{maxHeight:300, overflow: 'auto'}}>
            <Grid  >
                <Grid xs={2} >
                    <Button variant="contained" onClick={this.handleClick}>execute</Button>
                </Grid>

                <Box sx={{
                    height: 400,
                    overflow: 'auto',
                    border: 2,
                    borderColor: 'grey.500',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    p: 2,
                    minWidth: 300,
                }}>

                    {this.state.notifyMsgList.map((item, index) => {
                        if (item.notifyLevel == undefined || item.notifyLevel == null || item.notifyLevel == 0) {
                            return (
                                <Typography sx={{ m: 0 }} color="textInfo" key={index} variant="body1" gutterBottom>{`${item.notifyTitle}  ${item.notifyBody ?? ''}`}</Typography>
                            )
                        }
                        else if (item.notifyLevel == 1) {
                            return (
                                <Typography sx={{ m: 0 }} color="textSuccess" key={index} variant="body1" gutterBottom>{`${item.notifyTitle}  ${item.notifyBody ?? ''}`}</Typography>
                            )
                        }
                        else if (item.notifyLevel == 2) {
                            return (
                                <Typography sx={{ m: 0 }} color="textError" key={index} variant="body1" gutterBottom>{`${item.notifyTitle}  ${item.notifyBody ?? ''}`}</Typography>
                            )
                        }
                    })}
                    <div id="messagesEndRef" />
                </Box>
            </Grid>
            //</Container>
        );
    }

    componentDidMount() {
        const protocol = new signalR.JsonHubProtocol();
        const transport = signalR.HttpTransportType.WebSockets;
        const token = localStorage.getItem('token')
        const options = {

            accessTokenFactory: () => token,
            transport: transport,
        }
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${DataBaseUrl}/api/TaskNotification`, options)
            .withHubProtocol(protocol)
            .withAutomaticReconnect()
            .build();
        this.connection.on(this.props.notifyBusiness, this.notifyUpdate);
        this.connection.start()
            .then(() => {
                this.notifyUpdate({ notifyTitle: 'Connected', notifyBody: '' });
                console.info('SignalR Connected');
                
            })
            .catch(err => {
                console.error('SignalR Connection Error: ', err);
                //this.notifyUpdate({ notifyTitle: 'Connect failed' ,notifyBody:''});
            });
    }
    send(data) {
        this.connection.send(this.props.notifyBusiness, data);
    }

    componentWillUnmount() {
        this.connection.stop();
    }
};

export default BusinessNotification;