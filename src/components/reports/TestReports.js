import React, {useEffect, useState} from "react"
import "./TestReports.css"
import { MDBBtn, MDBScrollbar } from "mdb-react-ui-kit";
import { MDBTreeview, MDBTreeviewItem } from 'mdb-react-treeview';
const {ipcRenderer} = window.require('electron')

const TestReports = props => {

    const [activeTestReport,setActiveTestReport] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [loading,setLoading] = useState(true)
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

    const displayTree = () => {
        if(fileStructure.length === 0) return "No files yet"
        

        return(<><MDBTreeview> 
                    {fileStructure.map(filePath => {
                        return <MDBTreeviewItem name={filePath.replace(rootPath+"\\","")} />
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
            
            <div className="test-reports-content">

  
       




            </div>

        </div>
    
    </>)
}

export default TestReports