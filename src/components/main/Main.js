import React, { useState } from "react"
import TestReports from "../reports/TestReports"
import Tests from "../tests/Tests"
import "./Main.css"

const Main = props => {

    const [activeTab,setActiveTab] = useState("tests")

    const changeTab = tabName => {
        setActiveTab(tabName)
        const oldTab = document.getElementById(`${activeTab}-tab`).classList.remove("active-tab")
        const newTab = document.getElementById(`${tabName}-tab`).classList.add("active-tab")
    }

    

return(<>


    <div className="main-window-container">

        <div className="main-window-navbar">
            <div className="main-window-navbar-container">
                <div className="main-window-navbar-tab" id="tests-tab" onClick={() => changeTab("tests")} >
                    Tests
                </div>
                <div className="main-window-navbar-tab" id="jobs-tab"  onClick={() => changeTab("jobs")} >
                    Jobs
                </div>
                <div className="main-window-navbar-tab" id="reports-tab"  onClick={() => changeTab("reports")}>
                    Reports
                </div>
            </div>
        </div>

        <div className="main-window-content">
            {activeTab === "" || activeTab === "tests" && <Tests {...props} /> }
            {activeTab === "jobs" && <div>Showing Jobs</div>}
            {activeTab === "reports" && <TestReports {...props} />}
        </div>
    </div>

</>)


}


export default Main