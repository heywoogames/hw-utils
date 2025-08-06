
const http = require('node:http');
const https = require('node:https');
const os = require('os');
const URL = require( 'url' ).URL;
const fs = require('fs');

let localIps = function() {
    let ifaces = os.networkInterfaces();
    let ips = [];
    let func = function(details) {
      if (details.family === 'IPv4') {
        ips.push(details.address);
      }
    };
    for (let dev in ifaces) {
      ifaces[dev].forEach(func);
    }
    return ips;
}();

let g_localIp = '127.0.0.1';
for( let it of localIps ) {
  if( it !== g_localIp ) {
    g_localIp = it;
    break;
  }
}

/**
 * 
 * @param {string} host 
 * @returns 
 */
function inLocal(host) {
    for (let index in localIps) {
        if (host === localIps[index]) {
        return true;
        }
    }
    return false;
};

/**
 * 
 * @param {String} str 
 */
function parseContentType( str){
  const sp = str.split(';')[0];
  const type = sp.split('/');
  if( type[0] === 'text' ){
    return 'text';
  } else if( type[0] === 'application' ){
    if(type[1] === 'json') {
      return 'json';
    }
  }

  return 'buf'
}


class NNet {
    /** Check The host is local
     * @alias module:utils.isLocal
     * @param {string} host - the host
     * @return {boolean} 
     */
    static isLocal(host) {
        return host === '127.0.0.1' || host === 'localhost' || host === '0.0.0.0' || inLocal(host);
    };

    /** 获取本地IP
     * 
     * @returns {string}
     */
    static localIp() {
      return g_localIp;
    }


  /** 下载支持 http/https
   * 
   * @param {string} url down url 
   * @param {'auto'|'buff'|'text'|'json'} retType 返回数据类型(auto|buff|text|json),缺省buf
   * @returns { Promise<{status: Boolean, statusCode: Number, data?: Buffer|String|JSON, err?:String}> }
   */
  static http_get( url, retType='auto', opt=null ) {
    const u = new URL(url);
    if( ['auto','buff','text','json'].indexOf(retType) < 0  ) {
      retType = 'auto';
    }

    const optT = opt ?? {};
    if(!optT['timeout'] ) {
      optT['timeout'] = 5000;
    }

    return new Promise( (resolve, reject) => {
      ((u.protocol === 'http:') ? http : https).get(url, optT,(res) => {
        const { statusCode } = res;
        const contentLen = res.headers['content-length'];
        if( statusCode !== 200 ) {
            res.resume();
            resolve( {status: false, statusCode} );
            return;
        }

        let receBuf = true;
        if( contentLen !== undefined && Number(contentLen) <= 0 ) {
            res.resume();
            resolve( {status: false, statusCode} );
            return;
        } {
            receBuf = false;
        }

        const bufSize = 0;

        /** @type {Buffer} */
        const rawBuf = null;
        let wOff = 0;
        let rawData = '';

        if( receBuf ) {
            bufSize = Number( contentLen );
            rawBuf = Buffer.allocUnsafe( bufSize);
        }

        res.on('data', (chunk) => {
          if( receBuf ) {
            wOff += chunk.copy( rawBuf, wOff);
          } else {
            rawData += chunk.toString();
          }
          
        });
        res.on('end', () => {
            if(receBuf) {
                if(wOff !== bufSize) {
                    resolve({ status: false, err: 'err size' });
                } else {
                    if(retType === 'auto') {
                        retType = parseContentType(res.headers['content-type']);
                    }
                    switch(retType) {
                        case 'text': 
                            resolve({ status: true, statusCode, data: rawBuf.toString() });
                            return;
                        case 'json': 
                            resolve({ status: true, statusCode, data: JSON.parse(rawBuf.toString()) });
                            return ;
                        default:
                            resolve({ status: true, statusCode, data: rawBuf });
                            return;
                    }
                }                
            } else {
                if(retType === 'auto') {
                    retType = parseContentType(res.headers['content-type']);
                }
                switch(retType) {
                    case 'json':
                        resolve({ status: true, statusCode, data: JSON.parse(rawData) });
                        return;
                    default:
                        resolve({ status: true, statusCode, data: rawData });
                        return;
                }
            }
        });
      }).on('error', (e) => {
        resolve({ status: false, err: e.message })
      });
    });
  }


  /** 发送 POST 请求(支持http和https)
   * @template T
   * @param {string} reqUrl 请求的地址
   * @param {object} postData 请求参数
   * @param {object | null} [socket=null] socket, 通过代理请求的时候才传此参数
   * @param {string} method 'POST | PUT | DELETE'
   * 
   * @returns { Promise<{status: boolean, statusCode: number, data?: Buffer|String|T, err?:String}>}
   */
  static http_post ( reqUrl,postData,socket=null, method='POST' ){
    let u = new URL( reqUrl );
    let szPostData = null;
    /** @type {any} */
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,    
      method: method
    };

    if( socket ) {
      options.socket = socket;
    }
    
    if( postData ) {
      szPostData = JSON.stringify( postData );
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength( szPostData )
      }
    }

    return new Promise( ( resolve/*, rejecte*/ )=> {
      const req = ( ( u.protocol === 'http:' ) ? http : https ).request( options, ( res ) => {
        const { statusCode } = res;

        if( statusCode !== 200 ) {
          res.resume();
          resolve( {status: false, statusCode: statusCode ?? 500} );
          return;
        }

        res.setEncoding( 'utf8' );
        let rawData = '';
        res.on( 'data', ( chunk ) => { 
          rawData += chunk; 
        } );
        res.on( 'end', () => {
          try {
            const retType = parseContentType(res.headers['content-type']);
            switch(retType) {
              case 'json':
                  resolve({ status: true, statusCode, data: JSON.parse(rawData) });
                return;
              case 'text':
                  resolve({ status: true, statusCode, data: rawData });
                return;
              default:
                  resolve({ status: true, statusCode, data: rawData });
                return;
            }
          } catch ( /**@type {any}*/e ) {
            resolve( { status:false, statusCode, err: e.toString() } );
            return;
          }
        } );
      } );
              
      req.on( 'error', ( e ) => {
        resolve( { status:false,statusCode:-1, err: e.toString()} );
        return;
      } );
              
      // Write data to request body
      if( szPostData !== null ) {
        req.write( szPostData );
      }
      req.end();
    } );
  }

  /** 发送 POST 请求(支持http和https)
     *
     * @param {String} reqUrl 请求的地址
     * @param {Object} postData 请求参数
     * @param {{host:string, port: number}} proxy 代理信息
     * @param {string} method 'POST | PUT | DELETE'
     * 
     * @returns { Promise<{status: boolean, statusCode: number, data?: Buffer|String|JSON, msg?:string}>}
     */
  static https_post_byProxy ( reqUrl,postData, proxy, method='POST' ){
    let u = new URL( reqUrl );
    let port = ( u.port === '' ) ? 443 : u.port;  
    return new Promise( ( resolve/*, rejecte*/ )=> {
      http.request( {
        host: proxy.host, // IP address of proxy server
        port: proxy.port, // port of proxy server
        method: 'CONNECT',
        path: `${u.host}:${port}`, // some destination, add 443 port for https!
        headers: {
          //'Proxy-Authorization': auth
        },
      } ).on( 'connect', ( res, socket ) => {
        if ( res.statusCode === 200 ) { // connected to proxy server
          ( async () =>{
            let res = await NNet.http_post( reqUrl, postData,socket, method );
            resolve( res );
          } )();
        }
      } ).on( 'error', ( /*err*/ ) => {
        resolve( {status:false, statusCode: 500, msg:'proxy error 1!'} );
      } ).end();
    } );
  }

}


module.exports = NNet;



