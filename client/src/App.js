import React, {useEffect, useState} from 'react';
import {
    Button,
    Card, CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField, Typography
} from "@mui/material";
import { io } from 'socket.io-client';

const defaultQueryState = {
    type: '',
    identifier: ''
};

const socket = io("ws://localhost:5000");

const App = () => {
    const [dog, setDog] = useState({});

    const [query, setQuery] = useState(defaultQueryState);

    const handleQueryChange = (event) => {
        const { name, value } = event.target;
        setQuery(previous => {
            return {
                ...previous,
                [name]: value.trim(),
            }
        });
    };

    const apiRequest = async (endpoint, method) => {
        try {
            const res = await fetch(endpoint, { method: method });
            if (res.ok) {
                const json = await res.json();
                setDog(json);
            } else if (res.status === 404) {
                alert('Resource not found');
            } else if (res.status === 400) {
                alert('Invalid identifier');
            } else if (res.status === 500) {
                alert('Server error');
            } else {
                alert(`Unexpected response status ${res.status}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitQuery = async () => {
        if (query.type === "") {
            alert('Select an identifier type');
            return;
        }

        if (query.identifier === "") {
            alert('Input a non-empty identifier');
            return;
        }

        const endpoint = `http://localhost:5000/api/${query.type === 'uuid' ? 'tag' : 'dog'}/${query.identifier}`;

        await apiRequest(endpoint, "GET");
    }

    const handleChangeStatus = async () => {
        const endpoint = `http://localhost:5000/api/dog/${dog.id}`;

        await apiRequest(endpoint, "POST");
    }

    useEffect(() => {
        const onConnect = () => console.log('client socket connected');

        const onDisconnect = () => console.log('client socket disconnected');

        const onDataEvent = (value) => setDog(value);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('data', onDataEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('data', onDataEvent);
        };
    }, []);

    return (
        <Grid container alignItems="center" justifyContent="center" style={{ minHeight: '100vh', textAlign: "center" }}>
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={4}>
                    <FormControl>
                        <FormLabel>Type</FormLabel>
                        <RadioGroup
                            name="type"
                            row
                            value={query.type}
                            onChange={handleQueryChange}
                        >
                            <FormControlLabel value="uuid" control={<Radio />} label="UUID" />
                            <FormControlLabel value="id" control={<Radio />} label="ID" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField name="identifier" label="Enter identifier here" value={query.identifier} onChange={handleQueryChange} />
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" onClick={handleSubmitQuery}>SUBMIT</Button>
                </Grid>
            </Grid>
            <Grid container item spacing={5} justifyContent="center" alignItems="center">
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Dog ID
                            </Typography>
                            <br />
                            <TextField disabled variant="standard" value={typeof dog.id !== "undefined" ? dog.id : ""} InputProps={{ readOnly: true }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Dog Name
                            </Typography>
                            <br />
                            <TextField disabled variant="standard" value={typeof dog.name !== "undefined" ? dog.name : ""} InputProps={{ readOnly: true }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Dog Status
                            </Typography>
                            <br />
                            <TextField disabled variant="standard" value={dog.status ? "Checked In" : (typeof dog.status !== "undefined" ? "Checked Out" : "")} InputProps={{ readOnly: true }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {typeof dog.status !== "undefined" &&
                <Grid item justifyContent="center" alignItems="center">
                    <Button variant="contained" onClick={handleChangeStatus}>
                        {dog.status ? "Check out" : "Check in"}
                    </Button>
                </Grid>
            }
        </Grid>
    );
}

export default App;
