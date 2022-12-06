
import React, {useState, useEffect} from "react"
import "./Tests.css"
const {ipcRenderer,shell} = window.require('electron')

const Tests = props => {

    const [globalParam,setGlobalParam] = useState(null)
    const [activeTest,setActiveTest] = useState(null)
    const [fileStructure,setFileStructure] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [fileContents,setFileContents] = useState(null)

    useEffect(() => {
        getFilesAndFoldersForTestReports() 
        return () => unmount()
    },[])

    useEffect(() => {
        if(activeTest)
            readFileContents()
    }, [activeTest])

    const readFileContents = () => {
        ipcRenderer.send('read-file-contents', activeTest)
    }

    ipcRenderer.on('file-contents', (event,contents) => {
        setFileContents(contents)
    })

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


    const displayFileContents = () => {
        if(!fileContents) return 
        return <code> <textarea className="file-contents-textarea" value={fileContents.join("\n")}>
        </textarea></code>
        // return fileContents.map(line => {
        //     return <div className="l" contentEditable>{line}</div>
        // })
    }

    const displayExplorer = () => {
        if(!fileStructure) return 
        let newPaths = {}
        let topPath = [...fileStructure]

        let updatedPaths = topPath.map(p => removeRootPathFromPath(p))

        let obj = {}
        let single = []

           
        updatedPaths.map(path => {
            let s= path.split("\\") 
            var removedFile = s.pop()
            if(s.length > 0) 
            {
                
                let combinedStartPath = s.join('/') 
                if(obj.hasOwnProperty(combinedStartPath))
                {
                    obj[combinedStartPath].push(removedFile)
                }
                else
                {
                    obj[combinedStartPath] = [removedFile]
                }
            }
            else
            {
                if(obj.hasOwnProperty(" "))
                {
                    obj[" "].push(removedFile)
                }
                else
                {
                    obj[" "] = [removedFile]
                }
            }
        })

        
        // return single.map(file => {
        //     return <ul key={file}><li>{file}</li></ul>
        // })
        return Object.keys(obj).map(path => {
            let s = path.split("/")

            
            
            return <ul>
                <span  className="path-header" id={path} onClick={() => pathHeaderClick(path)}> {path}</span>
                
                <ul className={path}>
                {obj[path].map(file => {
                    return <li onClick={() => setTest(path,file)} id={`${path}/${file}`}  >{file}</li>
                })}
                </ul>
            </ul>
        })

        // return topPath.map((path,i) => {
        //     const pathId = removeRootPathFromPath(path)
        //     return <div id={pathId} className="path-item" onClick={() => clickPathItem(pathId,path)}>{pathId}</div>
        // })
    }

    const setTest = (path,file) => {
        let fullPath = path+"/"+file
        setActiveTest(fullPath)

        if(activeTest)
            document.getElementById(activeTest).classList.remove("active-path-item")
        document.getElementById(fullPath).classList.add('active-path-item')
    }

    const pathHeaderClick = (id) => {
        const pathHeader = document.getElementById(id)
        
        let children = document.getElementsByClassName(id)
        Object.values(children).map(el => {
            if(el.classList.contains("hide"))
            {
                el.classList.remove("hide")
                el.classList.add("show")
            }
            else
            {
                el.classList.add("hide")
                el.classList.remove("show")
            }
        })
    }
    

    const displayActiveTestHeader = () => {
        if(!activeTest) return
        const displayName = removeRootPathFromPath(activeTest)
        return displayName
    }

    const removeRootPathFromPath = (path) => {
        return path?.replace(rootPath+"\\", "")
    }

    const runTest = () => {
        if(!activeTest) return
        ipcRenderer.send('run-test', activeTest)
    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer" id="explorer">
                     {displayExplorer() }

                     
                </div>
                <div className="test-reports-explorer-buttons">
                    <button className="set-global-param-btn">Set global param</button>
                    <button className="set-active-test-btn" onClick={runTest}>Run Test</button>
                </div>
            </div>
            
            <div className="active-test-container">
                <div className="active-test-header">
                    Active Test: {displayActiveTestHeader()}
                </div>
                <div className="active-test-contents">
                    {fileContents && displayFileContents()}
                </div>
            </div>

        </div>
    
    </>)

}

export default Tests











/*
<hr />
                    <MDBTreeview openOnItemClick={false}>
                <MDBTreeviewItem name='One' />
                <MDBTreeviewItem name='Two' />
                <MDBTreeviewItem subtree name='Three' show>
                    <MDBTreeviewItem name='Second-one' />
                    <MDBTreeviewItem name='Second-two' />
                    <MDBTreeviewItem name='Second-three' subtree>
                    <MDBTreeviewItem name='Third-one' subtree>
                        <MDBTreeviewItem name='Fourth-one' />
                        <MDBTreeviewItem name='Fourth-two' />
                        <MDBTreeviewItem name='Fourth-three' />
                    </MDBTreeviewItem>
                    <MDBTreeviewItem name='Third-two' />
                    <MDBTreeviewItem name='Third-three' subtree>
                        <MDBTreeviewItem name='Fourth-one' />
                        <MDBTreeviewItem name='Fourth-two' />
                        <MDBTreeviewItem name='Fourth-three' />
                    </MDBTreeviewItem>
                    </MDBTreeviewItem>
                </MDBTreeviewItem>
            </MDBTreeview>
*/