
import * as _ from "lodash";
import RNFetchBlob from "rn-fetch-blob";
const SHA1 = require("crypto-js/sha1");
const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
const BASE_DIR = RNFetchBlob.fs.dirs.CacheDir + "/rn-img-cache";



export type DownloadOptions = {
  md5?: boolean,
  method?: { [string]: string },
  headers?: { [string]: string }
};

export class CacheEntry {

    uri: string;
    options: DownloadOptions;
    path: string;

    constructor(uri: string, options: DownloadOptions) {
        this.uri = uri;
        this.options = options;
    }

    async getPath(): Promise<?string> {
        const {uri, options} = this;
        const {realPath, exists, tmpPath} = await getCacheEntry(uri);
        if (exists) {
            return realPath;
        }
        const method = options.method ? options.method : "GET";
		let isSuccess = false;
		let downloaded = false
		//the RNFetchBlob.config need a 'path'
		let path = tmpPath;
        //fetch the img from remote
		let task = await RNFetchBlob.config({ path }).fetch(method, uri, options.headers).then(() => {
			downloaded = true;
        }).catch(() => {
            // Parts of the image may have been downloaded already, (see https://github.com/wkh237/react-native-fetch-blob/issues/331)
            RNFetchBlob.fs.unlink(tmpPath);
        });
        console.log("fetching moving [" + tmpPath + "] to [" + realPath + "]");
        await RNFetchBlob.fs.mv(tmpPath, realPath).then((ret)=>{
                isSuccess = ret;
                if (ret) {
                }else{
                    console.warn("CacheManager-->move file [" + tmpPath + "] to [" + realPath + "] failed!");
                    RNFetchBlob.fs.unlink(tmpPath);
                }
            }).catch((err)=>{
                console.warn("CacheManager-->" + err);
                RNFetchBlob.fs.unlink(tmpPath);
            });
        return realPath;
    }
}

export default class CacheManager {

    static entries: { [uri: string]: CacheEntry } = {};

    static get(uri: string, options: DownloadOptions): CacheEntry {
        if (!CacheManager.entries[uri]) {
            CacheManager.entries[uri] = new CacheEntry(uri, options);
        }
        return CacheManager.entries[uri];
    }

    static async clearCache(): Promise<void> {
    	await RNFetchBlob.fs.unlink(BASE_DIR);
    }
    static async getCacheSize(): Promise<number> {
        const size = await RNFetchBlob.fs.stat(BASE_DIR);
        return size;
    }
}

const getCacheEntry = async (uri: string): Promise<{ exists: boolean, path: string, tmpPath: string }> => {
    const filename = uri.substring(uri.lastIndexOf("/"), uri.indexOf("?") === -1 ? uri.length : uri.indexOf("?"));
    const ext = filename.indexOf(".") === -1 ? ".jpg" : filename.substring(filename.lastIndexOf("."));
    const realPath = `${BASE_DIR}/${SHA1(uri)}${ext}`;
    const tmpPath = `${BASE_DIR}/${SHA1(uri)}-${_.uniqueId()}${ext}`;

    let exists = false;
	await RNFetchBlob.fs.exists(realPath).then((_exists) => {
        exists = _exists;
    });    
    return { exists, realPath, tmpPath };
};