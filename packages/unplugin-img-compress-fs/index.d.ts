/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export declare function readFile(path: string): Array<number>
export declare function outPutFile(path: string, data: Array<number>): void
export declare function pathExists(path: string): Promise<boolean>
export declare function remove(path: string): Promise<void>
export declare function copy(src: string, dest: string): void
export declare function readJson(path: string): unknown
export declare function jsObjectToHashmap(jsObj: object): Record<string, any>
