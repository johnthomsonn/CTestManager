import React, {useState} from "react"


const Tests = props => {

    const [globalParam,setGlobalParam] = useState(null)
    const [activeTest,setActiveTest] = useState(null)


    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer">
                Explorer window
                </div>
                <div className="test-reports-explorer-buttons">
                    <button>Set global param</button>
                    <button>Set active test</button>
                </div>
            </div>
            

        </div>
    
    </>)

}

export default Tests