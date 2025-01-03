import React from "react";
import AddIcon from '@mui/icons-material/Add';

const CreateTaskButton = ({ openForm }) => {
    return (
        <div className="ea">
            <div className="fa" onClick={openForm}>
                <div className="bold">Create a TASK</div>
                <div>
                    <AddIcon className="mui-icons" fontSize="" />
                </div>
            </div>
        </div>
    );
};

export default CreateTaskButton;
