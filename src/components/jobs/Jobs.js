import React, {useState,useEffect} from "react"
import "./Jobs.css"
const {ipcRenderer} = window.require('electron')

const Jobs = props=> {

    const [fileStructure,setFileStructure] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [selectedTest,setSelectedTest] = useState(null)
    const [jobOptionTab,setJobOptionTab] = useState("tests")
    const [jobTestList,setJobTestList] = useState([])

    const [jobName,setJobName] = useState("")

    useEffect(() => {
        getFilesAndFoldersForTestReports() 
        return () => unmount()
    },[])

    const getFilesAndFoldersForTestReports = () => {
        ipcRenderer.send("get-tests-explorer")
    }

    const unmount = () => {
        setSelectedTest(null)
        setJobTestList([])
    }

    ipcRenderer.on('tests-explorer', (event,structure,rootPath) => {
        setFileStructure(structure)
        setRootPath(rootPath)
    }) 

    const removeRootPathFromPath = (path) => {
        return path?.replace(rootPath+"\\", "")
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

        
        return Object.keys(obj).map(path => {
            let s = path.split("/")
            return <ul>
                <span  className="path-header" id={path} onClick={() => pathHeaderClick(path)}> {path}</span>
                
                <ul className={path}>
                {obj[path].map(file => {
                    return <li onClick={() => setSelectedTest(path+"/"+file)} id={`${path}/${file}`}  >{file}</li>
                })}
                </ul>
            </ul>
        })
    }

    

    const displayJobs = () => {
       return <div> jobs here</div>
    }

    const displayJobTestList = () => {
        return jobTestList.map(test => {
            return <div>{test}</div>
        })
    }

    const addJobToJobList = () => {
        if(!selectedTest) return
        if(!jobTestList.includes(selectedTest))
        {
            setJobTestList(p => [...p,selectedTest])
            setSelectedTest(null)
        }

    }

    const runJob = () => {
        if(jobTestList.length ===0) return

        ipcRenderer.send('run-job',jobTestList)
    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer" id="explorer">
                    <div className="job-option-tab">
                        <div className="show-tests" onClick={() => setJobOptionTab("tests")} style={{backgroundColor : jobOptionTab === "tests" ? "rgb(241, 176, 176)" : "white"}}>Show Tests</div>
                        <div className="show-jobs" onClick={() => setJobOptionTab("jobs")} style={{backgroundColor : jobOptionTab === "jobs" ? "rgb(241, 176, 176)" : "white"}}>Show Jobs</div>
                    </div>
                    {jobOptionTab == "tests" && displayExplorer() }
                    {jobOptionTab == "jobs" && displayJobs()}
                     

                     
                </div>
                <div className="test-reports-explorer-buttons">
                    <button className="set-global-param-btn" onClick={() => addJobToJobList()}>Add To Job</button>
                    <button className="set-active-test-btn" >{jobOptionTab === "tests" ? "Save Job" : "Load Job"}</button>
                    <button className="run-job-btn"onClick={runJob}>Run Job</button>
                </div>
            </div>
            
            <div className="active-test-container">
                <div className="active-test-header">
                    Job:
                </div>
                <div className="active-test-contents">
                    <div className="job-list-div">
                        Selected Test : {selectedTest ? selectedTest : "None selected"}
                        <div className="job-test-list">
                            {displayJobTestList()}
                        </div>
                    </div>
                    <div className="job-info">
                        <form>
                            <label for="job-name">Job Name:
                                <input type="text" value={jobName} onChange={e => setJobName(e.target.value)}></input>
                            </label>
                        </form>
                    </div>
                    
                </div>
            </div>

        </div>
    </>)
}

export default Jobs