import {hot} from 'react-hot-loader'
import React, {useState, useEffect} from 'react'

import fs from 'fs'
import { ipcRenderer } from 'electron'

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

const Search = () => {
    const [query, setqQuery] = useState('');
    const [results, setResults] = useState([]);
    useEffect(() => {
        ipcRenderer.on('search-response',(event, response) => setResults(response))
    })
    return <div>
        <button onClick={() => ipcRenderer.send('search-init-request')}>Initialise</button>
        <input type="text" value={query} onChange={e => setqQuery(e.target.value)}/>
        <button onClick={() => ipcRenderer.send('search-request',query)}>Search</button>
        <div>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    </div>
}

const Caps = () => {
    const [input, setInput] = useState<string>('capitalise me')
    const [output, setOutput] = useState<string>('')
    useEffect(() => {
        ipcRenderer.on('indexFolder-response',(event, arg) => setOutput(JSON.stringify(arg)))
    },[])
    return <div>
        
        <input value={input} onChange={e => setInput(e.target.value)}/>
        <button onClick={() => ipcRenderer.send('indexFolder-request',input)}>CAPS</button>
        <p>{output}</p>
    </div>
}

const App = () => { 
    const [path, setPath] = useState('D:\\Simey')
    const files = useFiles(path)
    const [contents, setContents] = useState([])
    // useEffect(()=> {
    //     setContents(indexFolder('D:/Downloads/_Ebooks'))
    // },[])

    return <div>
            <h1>Hello React</h1>
            <Search />
            <input type="text" value={path} onChange={e => setPath(e.target.value)}/>
            <p>{JSON.stringify(contents)}</p>
            <p>{path}</p>
            {files.map(file => <p>{file}</p>)}

        </div>

}
export default hot(module)(App)