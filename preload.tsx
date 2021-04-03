
import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()

process.on("unhandledRejection", (reason, p) => console.log("没有promise.catch", { p, reason }))
import React, { FC } from "react"
import ReactDom from 'react-dom'
import { ErrorBoundary } from 'react-error-boundary'
export default (root?: HTMLDivElement): Promise<{
    appRoot: HTMLDivElement,
    appDiv: (Css: FC, newdivName?: string) => void,
}> => new Promise((ok) => document.addEventListener('DOMContentLoaded', (event) => {
    let appRoot: HTMLDivElement
    // console.log(navigator.userAgent)
    if (root) {
        appRoot = root
    } else {
        appRoot = document.createElement('div');
        document.body.appendChild(appRoot)
    }
    // appRoot.setAttribute('id', 'appRoot')
    appRoot.style.position = 'fixed'
    appRoot.style.zIndex = '99'
    // appRoot.style.width = '260px'
    // appRoot.style.left = '10px'
    // appRoot.style.bottom = '30px'
    appRoot.style.top = '30px'
    // appRoot.style.backgroundColor = 'white'
    //appRoot.classList.add(domName)
    // appRoot.innerHTML = '<div id="AppRoot"></div>'
    // return import('../app_edit/components/email')
    ok({
        appRoot,
        appDiv: (Css, newdivName = 'TEST') => {
            const dom = document.createElement('div')
            dom.classList.add(newdivName);
            appRoot.appendChild(dom)
            ReactDom.render(
                <ErrorBoundary
                    FallbackComponent={({ error, resetErrorBoundary }) => {
                        return (
                            <div role="alert">
                                <p>Something went wrong:</p>
                                <pre>{error.message}</pre>
                                <button onClick={resetErrorBoundary}>Try again</button>
                            </div>
                        )
                    }}
                    onReset={() => {
                        console.log('ok')
                    }}
                >
                    <Css />
                </ErrorBoundary>,
                dom
            )
        }
    })
}))


