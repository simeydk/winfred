import {hot} from 'react-hot-loader'
import React, {useState, useEffect} from 'react'

const {ipcRenderer} = require('electron')


import fs from 'fs'

const useFiles = (path: string) => {
    const [files, setFiles] = useState<String[]>([])
    useEffect(()=>{
        // setFiles(path.split(''))
        try{
            setFiles(fs.readdirSync(path))
            // fs.promises.readdir(path).then(setFiles)
        } catch {

        }
    },[path])
    return files
}

const App = () => { 
    const [path, setPath] = useState('D:\\Simey')
    const files = useFiles(path)

    useEffect(() => {
        ipcRenderer.on('asynchronous-reply', (_, arg) => {
            const message = `Asynchronous message reply: ${arg}`
            setPath(message)
          })
    },[])
    
    return <div>
        <h1>Hello React</h1>
        <input type="text" value={path} onChange={e => setPath(e.target.value)}/>
        <p>{path}</p>
{files.map(file => <p>{file}</p>)}
        <button onClick={ipcRenderer.send('asynchronous-message', path)}>click me</button>
        </div>

}
export default hot(module)(App)