import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import "../../App.css";
import { addEvent, deleteEvent, getEvents } from "../../services/calendarService";
import { CalendarItem } from "../CalendarItem/CalendarItem";
import config from "../../config.js";
import CircularProgress from "@mui/material/CircularProgress";
import { AddEvent } from "./AddEvent";
import { getWeek } from "date-fns";

export function Calendar() {
    const [range, setRange] = useState(7);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [groupedEvents, setGroupedEvents] = useState([]);
    const _ = require("lodash");
    let eventAdded = false;
    const daysArray = [...Array(7).keys()];

    const gapi = window.gapi;

    const addDays = (days) => {
        var date = new Date();
        date.setDate(date.getDate() + days);
        var formattedDate = date.toLocaleString("en-GB", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
        return formattedDate;
    };

    const comparableDate = (e) => {
        return (
            e.date &&
            new Date(e.date.substring(6, 10), e.date.substring(3, 5), e.date.substring(0, 2))
        );
    };

    const groupEventsByWeek = (range) => {
        if (range === 30) {
            let eventsMap = events.map((e) => ({
                key: getWeek(comparableDate(e)),
                eventItem: e,
            }));
            const result = _.groupBy(eventsMap, "key");
            const sortedResult = Object.entries(result).map(([key, value]) => {
                    value = value.sort((a, b) =>
                    comparableDate(a.eventItem) > comparableDate(b.eventItem)
                        ? 1
                        : comparableDate(b.eventItem) > comparableDate(a.eventItem)
                        ? -1
                        : 0
                );
                return (key, value)
            });
            setGroupedEvents(sortedResult);
        }
    };

    const preProcessEvents = (rawEvents) => {
        let arr = rawEvents.map((e) => ({
            id: e.id,
            summary: e.summary,
            date: new Date(e.start.dateTime.split("T")[0]).toLocaleString("en-GB", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            }),
            time: e.start.dateTime.substring(11, 16) + " - " + e.end.dateTime.substring(11, 16),
        }));
        eventAdded ? setEvents([...events, ...arr]) : setEvents(arr);
    };

    const handleRangeChange = (e) => {
        setRange(e.target.value);
    };

    const addEventToCalendar = async (eventData) => {
        const { result } = await addEvent(eventData);
        eventAdded = true;
        preProcessEvents([result]);
    };

    const handleDeleteEvent = async (id) => {
        setDeleteLoading(true);
        try {
            await deleteEvent(id);
            setEvents(events.filter((x) => x.id !== id));
        } catch (e) {
            alert("Error while deleting", e);
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        groupEventsByWeek(range);
    }, [range, events]);

    useEffect(() => {
        setLoading(true);
        gapi.load("client:auth2", () => {
            gapi.client
                .init({
                    apiKey: config.apiKey,
                    clientId: config.clientId,
                    discoveryDocs: config.discoveryDocs,
                    scope: config.scope,
                })
                .then(() =>
                    getEvents().then((res) => {
                        if (res.status === 200) {
                            preProcessEvents(res.result.items);
                            setLoading(false);
                        } else alert("Error while fetching events");
                    })
                );
        });
    }, []);

    return (
        <div className="component-container">
            <div className="options-container">
                <Button className="new-button" onClick={() => setModalOpen(true)}>
                    New
                </Button>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="demo-simple-select-label">Range</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={range}
                        onChange={handleRangeChange}
                        label="Range"
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {loading ? (
                <div className="loader">
                    <CircularProgress thickness={5} size={60} />
                </div>
            ) : (
                <div className="calendar-container">
                    <div className={`items-columns-${range}`}>
                        {range === 1 ? (
                            <div className="item">
                                <p>
                                    <b>
                                        <u>{addDays(0)}</u>
                                    </b>
                                </p>
                                {events.map((e) =>
                                    e.date === addDays(0).toString() ? (
                                        <CalendarItem
                                            key={e.id}
                                            id={e.id}
                                            title={e.summary}
                                            date={e.date}
                                            time={e.time}
                                            handleDeleteEvent={handleDeleteEvent}
                                            loading={deleteLoading}
                                        />
                                    ) : (
                                        ""
                                    )
                                )}
                            </div>
                        ) : range === 7 ? (
                            daysArray.map((d) => (
                                <div key={d} className="item">
                                    <p>
                                        <b>
                                            <u>{addDays(d)}</u>
                                        </b>
                                    </p>
                                    {events.map((e) =>
                                        e.date === addDays(d).toString() ? (
                                            <CalendarItem
                                                key={e.id}
                                                id={e.id}
                                                title={e.summary}
                                                date={e.date}
                                                time={e.time}
                                                handleDeleteEvent={handleDeleteEvent}
                                                loading={deleteLoading}
                                            />
                                        ) : (
                                            ""
                                        )
                                    )}
                                </div>
                            ))
                        ) : range === 30 ? (
                            Object.entries(groupedEvents).map(([key, value], index) => (
                                <div key={key} className="item">
                                    <p>
                                        <b>
                                            <u>Week {index + 1}</u>
                                        </b>
                                    </p>
                                    {value.map((e) => (
                                        <CalendarItem
                                            key={e.eventItem.id}
                                            id={e.eventItem.id}
                                            title={e.eventItem.summary}
                                            date={e.eventItem.date}
                                            time={e.eventItem.time}
                                            handleDeleteEvent={handleDeleteEvent}
                                            loading={deleteLoading}
                                        />
                                    ))}
                                </div>
                            ))
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            )}
            <AddEvent
                open={modalOpen}
                close={() => setModalOpen(false)}
                addEventToCalendar={addEventToCalendar}
            />
        </div>
    );
}
