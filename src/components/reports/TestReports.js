import React, {useState} from "react"
import "./TestReports.css"
const {ipcRenderer} = window.require('electron')

const TestReports = props => {

    const [activeTestReport,setActiveTestReport] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [loading,setLoading] = useState(true)
    const [fileStructure,setFileStructure] = useState([])

    const getFilesAndFolders = () => {
        console.log("About to fetch files")
        ipcRenderer.send("get-reports-explorer")
    }

    ipcRenderer.on('reports-explorer', (event,data,root) => {
        setFileStructure(data)
        setRootPath(root)
        console.log(root)
        setLoading(false)
    })

    const displayTree = () => {
        if(fileStructure.length === 0) return "No files yet"
        
        return fileStructure.map(filePath => {
            return <div>
                {filePath.replace(rootPath+"\\","")}
            </div>
        })
    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer">
                    {/* {getFilesAndFolders()} */}
                    {loading && "Fetching Files..."}
                    {!loading && displayTree()}
                </div>
                <div className="test-reports-explorer-buttons">
                </div>
        <button onClick={getFilesAndFolders}>fetch files</button>
            </div>
            

        </div>
    
    </>)
}

export default TestReports