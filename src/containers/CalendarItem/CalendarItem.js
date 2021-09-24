import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CircularProgress from "@mui/material/CircularProgress";

export function CalendarItem(props) {

    return(
        <div className="item-container">
            <div className="item-header">
                <h5 className="item-text">{props.title}</h5>
                <div className="delete-icon" onClick={() => props.handleDeleteEvent(props.id)}>
                    {!props.loading ? <DeleteOutlinedIcon style={{cursor: "pointer"}} /> : <CircularProgress size={14} />}
                </div>
            </div>
            <p className="item-text">{props.date}</p>
            <p className="item-text">{props.time}</p>
        </div>
    )
}