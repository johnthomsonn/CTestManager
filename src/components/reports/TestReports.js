import React, {useEffect, useState} from "react"
import "./TestReports.css"
const {ipcRenderer,shell} = window.require('electron')

const TestReports = props => {

    const [activeTestReportPath,setActiveTestReportPath] = useState(null)
    const [activeTestReportXML,setActiveTestReportXML] = useState(null)
    const [activeTestReportId, setActiveTestReportId] = useState(null)
    const [rootPath,setRootPath] = useState(null)
    const [loading,setLoading] = useState(true)
    const [readingReport,setReadingReport] = useState(true)
    const [fileStructure,setFileStructure] = useState(null)

    const [parameters,setParameters] = useState(null)
    const [executionMessages,setExecutionMessages] = useState(null)
    const [totalPasses,setTotalPasses] = useState(null)
    const [totalFails,setTotalFails] = useState(null)
    const [totalInfos,setTotalInfos] = useState(null)

    useEffect(() => {
        getFilesAndFoldersForTestReports() 
        return () => unmount()
    },[])

    // useEffect(() => {
    //     readReportXML() 
 
    //     return () => unmount() 

    // }, activeTestReportRaw) 

    const unmount = () => {
        setTotalFails(null) 
        setTotalInfos(null)
        setTotalPasses(null) 
    }

    const readReportXML = (activeTestReportRaw) => {
        if(!activeTestReportRaw) return  
        const xml = new DOMParser().parseFromString(activeTestReportRaw, "text/xml")
        setActiveTestReportXML(xml)
        //console.log(xml)
        const parametersNode = xml.getElementsByTagName("Parameters")
        const allParameterNodes = parametersNode[0].children

        const ignoreList = ["__builtins__", "__cached__", "__file__", "__loader__","__name__", "__package__", "__spec__"]
        const allParameters = []
        for(let param of allParameterNodes)
        {
            if(!ignoreList.includes(param.getAttribute("Param")))
            {
                const paramObj = {}
            
                paramObj.Param = param.getAttribute("Param")
                paramObj.Value = param.getAttribute("Value")  
                paramObj.Type = param.getAttribute("type")
                allParameters.push(paramObj)
            }
            
        }
        setParameters(allParameters)



        setReadingReport(false)
    } 

    const getFilesAndFoldersForTestReports = () => {
        ipcRenderer.send("get-reports-explorer")
    }

    ipcRenderer.on('reports-explorer', (event,data,root) => {
        setFileStructure(data)
        setRootPath(root)
        setLoading(false)
    })

    ipcRenderer.on('test-report-contents', (event,fileContents) => {
        readReportXML(fileContents)
        
    })  

    const explorerReportClick = (filepath,i) => {
        
        setActiveTestReportPath(filepath)
        
        setActiveTestReportId(`filepath${i}`)
        document.getElementById(`filepath${i}`).classList.add('active-report')
        if(activeTestReportId)
            document.getElementById(activeTestReportId).classList.remove('active-report')
            
        ipcRenderer.send('get-test-report', filepath)

        
    }

    const displayTree = () => {
        if(fileStructure.length === 0) return "No files yet"
        

        return(<><div>s
                    {fileStructure.map((filePath,i) => {
                        
                        return <div id={`filepath${i}`} onClick={() => explorerReportClick(filePath,i)}>{filePath.replace(rootPath+"\\","")}</div>
                    })}
                </div>
        </>)
    }

    const getDictValues = (dict) => {
        const dictStr = `"${dict}"`
        const dictObj = JSON.parse(dictStr)
        const keys = Object.keys(dictObj)
        
        //console.log(dictObj)
    }

    const displayParameterList = () => {
        if(!parameters) return
        return parameters.map((param,i) => {
            return (<>
            <div className="parameter-item" key={i}>
                <div className="parameter-item-param">{param.Param}</div>
                    {/* {param.Type && param.Type === "dict" ? getDictValues(param.Value) : <div className="parameter-item-value">{param.Value}</div>} */}
                    <div className="parameter-item-value">{param.Value}</div>
            </div>
                
            </>)
        })
    }

    const getValueFromParameter = (key) => {
        let val = -99

        parameters.map(p => {
            if(p.Param === key)
                val = p.Value
        })
        return val
    }

    const determineOverallResult = () => {
        const passes = getValueFromParameter("passes")
        const fails = getValueFromParameter("fails")
        const resultdiv = document.getElementById('result')
        if(fails > 0)
        {
            if(resultdiv)
                resultdiv.classList.add("red")
            return "FAIL"
        }
        else if(passes > 0)
        {
            if(resultdiv)
                resultdiv.classList.add("green") 
            return "PASS"
        }
        else
        { 
            return "INDETERMINATE" 
        }
    }

    return (<>
    
        <div className="test-reports-container">
            <div className="test-reports-explorer-container">
                <div className="test-reports-explorer">
                    {loading ? "Fetching Files..." : displayTree()}
                    



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
                    {activeTestReportPath && !readingReport && activeTestReportXML && <>
                    
                        <div className="left-side">
                            <div className="parameters-container">
                                <div className="sub-title" id="parameters-title">
                                <center> Parameters:</center>
                                </div>
                                <div className="parameters-list-container">
                                    {displayParameterList()} 
                                </div>

                            </div>

                            <div className="test-report-overview-container">
                                <div className="test-overview-result" >
                                    Test Time: 45m 
                                </div>
                                <div className="test-overview-passes">
                                    Total Passes: {getValueFromParameter("passes")}
                                </div>
                                <div className="test-overview-info">
                                    Total Infos: {getValueFromParameter("infos")}
                                </div>
                                <div className="test-overview-fails">
                                    Total Fails: {getValueFromParameter("total_fails")}
                                </div>
                                <div className="test-overview-result" id="result">
                                    Overall Result: {determineOverallResult()}
                                </div>
                            </div>
                        </div>

                        <div className="right-side">

                            content of messages here 
                        </div>
                        

                        



                    
                    
                    
                    
                    
                    
                    </>}
                </div>


            </div>

        </div>
    
    </>)
}

export default TestReports