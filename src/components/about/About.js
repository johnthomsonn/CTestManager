import React, { useEffect } from "react"

const About = props => {

    useEffect(() => {
        document.title = "About"
    },[])

    return(<>
    
     <div className="d-flex justify-content-center align-items-center" style={{height:"100vh", backgroundColor: "#d6d6d6"}}>
        Version: {process.env.REACT_APP_VERSION} <br/>
        Description: CTestManager allows you to run Python tests, create jobs and view completed test reports.
     </div>
    
    </>)
}

export default About