import React from "react"
import "./Jobs.css"


const Jobs = props=> {

    const displayExplorer = () => {

    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer" id="explorer">
                     {displayExplorer() }

                     
                </div>
                <div className="test-reports-explorer-buttons">
                    <button className="set-global-param-btn">Add To Job</button>
                    <button className="set-active-test-btn" >Create Job</button>
                </div>
            </div>
            
            <div className="active-test-container">
                <div className="active-test-header">
                    Job:
                </div>
                <div className="active-test-contents">
                    tests here
                    
                </div>
            </div>

        </div>
    </>)
}

export default Jobs