
import React, {useState, useEffect} from "react"
import "./Tests.css"
import {MDBTreeview,MDBTreeviewItem} from "MDBTreeview"
import "./tview.css"
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

    const isFile = pathname => {
        return pathname.split("/").pop().indexOf('.') > -1
    }

    const displayExplorer = () => {
        if(!fileStructure) return 
        let newPaths = {}
        let topPath = [...fileStructure]

        // loop over each path in the filestructure and separate out
        topPath.map(element => { 
            let strippedPath = removeRootPathFromPath(element)
            let s = strippedPath.split("\\")
            if(newPaths.hasOwnProperty(s.length))
            {
                newPaths[`${s.length}`].push(s)
            }
            else
            {
                newPaths[`${s.length}`] = [s]
            }
        });
        

        
        {/* loop over each key in the newPaths object and create sub elements */}
        let newPathKeys = Object.keys(newPaths).reverse()
        
        
        return newPathKeys.map(k => { 
            let items = createItems(newPaths[k]) 
            //return items
            return items.map(i => {
                return <div>{i}</div> 
            })
        })



        
           

        // return topPath.map((path,i) => {
        //     const pathId = removeRootPathFromPath(path)
        //     return <div id={pathId} className="path-item" onClick={() => clickPathItem(pathId,path)}>{pathId}</div>
        // })
    }

    const createItems = arr => {
        let len = arr.length
        let elements = []
        //  console.log(arr)   
        for(var i =0; i < len-1;i++)
        {
            let tmpArr = arr[i]
            for(var j =0;j < tmpArr.length-1;j++)
            {
                var ul = document.createElement("ul")
                console.log(tmpArr[i])
                ul.appendChild(document.createTextNode(tmpArr[i]))
                elements.push(ul)  
            }
            let li = document.createElement('li')
            if(li)
                li.appendChild(document.createTextNode(tmpArr[tmpArr.length-1])) 
                ul.appendChild(li)  
 
        } 
        console.log(elements)
        
        return elements
    }

    const displayActiveTestHeader = () => {
        if(!activeTest) return
        const displayName = removeRootPathFromPath(activeTest.path)
        return displayName
    }

    const removeRootPathFromPath = (path) => {
        return path?.replace(rootPath+"\\", "")
    }

    const runTest = () => {
        if(!activeTest) return
        ipcRenderer.send('run-test', activeTest.path)
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