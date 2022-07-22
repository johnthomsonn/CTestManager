import React, {useEffect, useState} from "react"
import "./TestReports.css"
import { MDBBtn, MDBScrollbar } from "mdb-react-ui-kit";
import { MDBTreeview, MDBTreeviewItem } from 'mdb-react-treeview';
const {ipcRenderer,shell} = window.require('electron')

const TestReports = props => {

    const [activeTestReportPath,setActiveTestReportPath] = useState(null)
    const [activeTestReport,setActiveTestReport] = useState(null)
    const [activeTestReportId, setActiveTestReportId] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [loading,setLoading] = useState(true)
    const [readingReport,setReadingReport] = useState(true)
    const [fileStructure,setFileStructure] = useState(null)

    useEffect(() => {
        getFilesAndFoldersForTestReports()
    },[])

    const getFilesAndFoldersForTestReports = () => {
        ipcRenderer.send("get-reports-explorer")
    }

    ipcRenderer.on('reports-explorer', (event,data,root) => {
        setFileStructure(data)
        setRootPath(root)
        setLoading(false)
    })

    ipcRenderer.on('test-report-contents', (event,fileContents) => {
        setActiveTestReport(fileContents)
        console.log(fileContents)
    })  

    const explorerReportClick = (filepath,i) => {
        
        setActiveTestReportPath(filepath)
        /*
        setActiveTestReportId(`filepath${i}`)
        document.getElementById(`filepath${i}`).classList.add('active-report')
        if(activeTestReportId)
            document.getElementById(activeTestReportId).classList.remove('active-report')
            */
           ipcRenderer.send('get-test-report', filepath)

        
    }

    const displayTree = () => {
        if(fileStructure.length === 0) return "No files yet"
        

        return(<><MDBTreeview> 
                    {fileStructure.map((filePath,i) => {
                        return <MDBTreeviewItem name={filePath.replace(rootPath+"\\","")} id={`filepath${i}`} onClick={() => explorerReportClick(filePath,i)} />
                    })}
                </MDBTreeview>
        </>)
    }




    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer">
                    {loading && "Fetching Files..."}
                    {!loading && displayTree()}



                </div>
                <div className="test-reports-explorer-buttons">
                </div>
            </div>
            
            <div className="test-reports-content-container">

                <div className="test-reports-active">
                    Active Report: {activeTestReportPath ? activeTestReportPath.replace(rootPath+"\\","") : ""}
                </div>
       

                <div className="test-reports-content">
                    {activeTestReportPath && readingReport && <span>Reading Report...</span>}
                </div>


            </div>

        </div>
    
    </>)
}

export default TestReports