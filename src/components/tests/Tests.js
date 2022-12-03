import React, {useState, useEffect} from "react"
import "./Tests.css"
const {ipcRenderer,shell} = window.require('electron')

const Tests = props => {

    const [globalParam,setGlobalParam] = useState(null)
    const [activeTest,setActiveTest] = useState(null)
    const [fileStructure,setFileStructure] = useState(null)
    const [rootPath,setRootPath] = useState(null)

    useEffect(() => {
        getFilesAndFoldersForTestReports() 
        return () => unmount()
    },[])

    const getFilesAndFoldersForTestReports = () => {
        ipcRenderer.send("get-tests-explorer")
    }

    const clickPathItem = (pathId,path) => {
        setActiveTest({
            path,
            pathId
        })
        document.getElementById(activeTest.pathId).classList.remove('active-path-item')
        document.getElementById(pathId).classList.add('active-path-item')
    }

    const unmount = () => {
        setActiveTest(null)
    }

    ipcRenderer.on('tests-explorer', (event,structure,rootPath) => {
        setFileStructure(structure)
        setRootPath(rootPath)
    }) 

    const displayExplorer = () => {
        if(!fileStructure) return

        return fileStructure.map((path,i) => {
            const pathId = path.replace(rootPath+"\\","")
            return <div id={pathId} className="path-item" onClick={() => clickPathItem(pathId,path)}>{pathId}</div>
        })
    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer">
                    {displayExplorer()}
                </div>
                <div className="test-reports-explorer-buttons">
                    <button className="set-global-param-btn">Set global param</button>
                    <button className="set-active-test-btn">Run Test</button>
                </div>
            </div>
            

        </div>
    
    </>)

}

export default Tests