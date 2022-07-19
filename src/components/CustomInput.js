import React from "react";

function CustomInput({customInput, setCustomInput}){
    return <div>
        <textarea
        value={customInput}
        onChange={(e)=>{setCustomInput(e.target.value)}}
        />
    </div>
}

export default CustomInput;