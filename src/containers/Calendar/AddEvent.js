import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    Input,
    InputLabel,
    Modal,
    Typography,
    CircularProgress,
} from "@mui/material";
import DateTimePicker from "react-datetime-picker";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export function AddEvent(props) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddEvent = async () => {
        const eventDto = {
            summary,
            start: {
                dateTime: startDate.toISOString(),
            },
            end: {
                dateTime: endDate.toISOString(),
            },
        };
        setLoading(true);
        try {
            await props.addEventToCalendar(eventDto);
            props.close();
        } catch (e) {
            alert("Adding event failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={props.open} onClose={props.close}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add new event
                </Typography>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="title" className="modal-item">
                            Title
                        </InputLabel>
                        <Input
                            id="title"
                            className="modal-item"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <DateTimePicker
                            clearIcon={null}
                            className="modal-item"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <DateTimePicker
                            clearIcon={null}
                            className="modal-item"
                            value={endDate}
                            onChange={(newValue) => {
                                setEndDate(newValue);
                            }}
                        />
                    </FormControl>
                    {startDate && endDate ? startDate.toISOString().split("T")[0] !== endDate.toISOString().split("T")[0] ? <p>Please enter the same value for start date and end date</p> : "" : ""}
                    <Button onClick={handleAddEvent} disabled={summary === "" || startDate === null || endDate === null || startDate.toISOString().split("T")[0] !== endDate.toISOString().split("T")[0]}>
                        {loading ? <CircularProgress size={14} /> : "Add event to calendar"}
                    </Button>
                </FormGroup>
            </Box>
        </Modal>
    );
}
