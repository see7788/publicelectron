import { IpcMainInvokeEvent, IpcRendererEvent } from 'electron'
type CTTYPE = Record<string, { req: {}, res: {} }>
type CTREQ<T extends Record<string, {}>> = T & { orderBy?: Omit<T, 'set'> }
export type WebStart<T extends CTTYPE> = {
    web: {
        invoke: <
            api extends keyof T,
            req extends CTREQ<T[api]['req']>,
            res extends T[api]['res']
            >(...c: req extends void ? [api] : [api, req]) => Promise<res>
        //监听Main来的
        on: <
            api extends keyof T,
            res extends T[api]['res']
            >(
            api: api,
            callback: res extends void
                ? (enent: IpcRendererEvent) => void
                : (enent: IpcRendererEvent, res: res) => void) => void
    }
    main: {
        handle: <
            api extends keyof T,
            req extends CTREQ<T[api]['req']>
            >(
            api: api,
            callback: (
                enent: IpcMainInvokeEvent,
                req: req extends void ? never : req
            ) => void
        ) => void
        handleSend: <
            api extends keyof T,
            res extends T[api]['res']
            >(api: api, res: res extends void ? never : res) => void
    }
}

/**
 * 
 '@fluffy-spoon/name-of'
 interface SomeType {
  foo: boolean;
  a:{b:{c:123}}
  someNestedObject: {
      bar: string;
  }
}
 */
function getPropertyNameInternal<T = unknown>(expression: (instance: T) => any) {
    let propertyThatWasAccessed = "";
    var proxy: any = new Proxy({} as any, {
        get: function (_: any, prop: any) {
            if (propertyThatWasAccessed) {
                propertyThatWasAccessed += ".";
            }
            propertyThatWasAccessed += prop;
            return proxy;
        }
    });
    expression(proxy);
    return propertyThatWasAccessed;
}