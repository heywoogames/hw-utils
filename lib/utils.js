const fs = require( 'node:fs' );
const {spawn,exec} = require('node:child_process');
const crypto = require('crypto');
const os = require('os');
const fsP = fs.promises;
const path = require('path');

/**
 * 获取 CPU 信息
 * @returns { {user:number,sys: number, idle: number,total:number} } CPU 信息
 */
function _getCPUInfo() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

  for (let cpu in cpus) {
    const times = cpus[cpu].times;
    user += times.user;
    nice += times.nice;
    sys += times.sys;
    idle += times.idle;
    irq += times.irq;
  }

  total += user + nice + sys + idle + irq;

  return {
    user,
    sys,
    idle,
    total,
  }
}

const g_env = JSON.parse(JSON.stringify(process.env));


class Utils {
  /**
  * @param {Number} time 超时时间 ms
  */
  static timeout ( time ) {
    return new Promise( ( resolve, /*reject*/ ) =>{
      // @ts-ignore
      setTimeout( ()=> { resolve();}, time );
    } );
  }


 /**
 * 读取本地文件
 * @param {string} path 文件路径
 * 
 * @returns {Promise< false|Buffer >}
 */
  static loadFile ( path ) {
  
    return new Promise( ( resolve/*, reject*/ ) => {
      try{
        fs.readFile( path, ( err, data )=>{
          if( err ) {
            console.error( err );
            resolve( false );
          }
  
          resolve( data );
        } );
      }catch( err ) {
        console.error( err );
        resolve( false );
      }
      
    } );
  
  }

  /**
   * Get the count of elements of object
   * @alias module:utils.size
   * @param {object} obj The object
   */
  static size(obj){
    let count = 0;
    for (let i in obj) {
      // @ts-ignore
      if (obj.hasOwnProperty(i) && typeof obj[i] !== 'function') {
        count++;
      }
    }
    return count;

  }


  /**
   * check if has Chinese characters.
   * @alias module:utils.hasChineseChar
   * @param {string} str - the string
   * @return {boolean} the result
   */
  static hasChineseChar (str) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * transform unicode to utf8
   * @alias module:utils.unicodeToUtf8
   * @param {string} str - the string
   * @return {string} the utf8 string
   */
  static unicodeToUtf8 (str) {
    let i, len, ch;
    let utf8Str = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      ch = str.charCodeAt(i);

      if ((ch >= 0x0) && (ch <= 0x7F)) {
        utf8Str += str.charAt(i);

      } else if ((ch >= 0x80) && (ch <= 0x7FF)) {
        utf8Str += String.fromCharCode(0xc0 | ((ch >> 6) & 0x1F));
        utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

      } else if ((ch >= 0x800) && (ch <= 0xFFFF)) {
        utf8Str += String.fromCharCode(0xe0 | ((ch >> 12) & 0xF));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

      } else if ((ch >= 0x10000) && (ch <= 0x1FFFFF)) {
        utf8Str += String.fromCharCode(0xF0 | ((ch >> 18) & 0x7));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

      } else if ((ch >= 0x200000) && (ch <= 0x3FFFFFF)) {
        utf8Str += String.fromCharCode(0xF8 | ((ch >> 24) & 0x3));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

      } else if ((ch >= 0x4000000) && (ch <= 0x7FFFFFFF)) {
        utf8Str += String.fromCharCode(0xFC | ((ch >> 30) & 0x1));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 24) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
        utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

      }

    }
    return utf8Str;
  };


  /**
   * Compare the two arrays and return the difference.
   * 
   * The difference between array2 and array1, where array1 exists but array2 does not
   * 
   * @template T
   * @alias module:utils.arrayDiff
   * @param {T[]} array1  - the array1
   * @param {T[]} array2 - the array2
   * 
   * @returns {T[]} the difference
   */
  static arrayDiff (array1, array2) {
    const o = {};
    for(let i = 0, len = array2.length; i < len; i++) {
      // @ts-ignore
      o[array2[i]] = true;
    }

    const result = [];
    for(let i = 0, len = array1.length; i < len; i++) {
      const v = array1[i];
      // @ts-ignore
      if(o[v]) continue;
      result.push(v);
    }
    return result;
  }

  /**
   * 计算两个数组的交集
   * @template T
   * @param {T[]} arr1 数组1
   * @param {T[]} arr2 数组2
   * @returns {T[]} 数组交集
   */
  static arrayIntersect (arr1, arr2) {
    return arr2.filter(function (v) {
      return arr1.indexOf(v) !== -1; // 利用filter方法来遍历是否有相同的元素
    });
  }

  /**
   * 数组去重
   * @template T
   * @param {T[]} arr 需要去重源数组
   * @param {string?} key 如果是对象数组，可以根据这个进行处理
   * @return {T[]} 去重后的数组
   */
  static arrayUnique (arr,key=null) {
    const res = [];
    const json = {};
    for (let i = 0; i < arr.length; i++) {
      // @ts-ignore
      let keyT = (key!==null) ? arr[i][key] : arr[i];
      // @ts-ignore
      if (!json[keyT]) {
        res.push(arr[i]);
        // @ts-ignore
        json[keyT] = 1;
      }
    }
    return res;
  }

  /**
   * 数组乱序
   * @template T
   * @param {T[]} arr 
   * @returns {T[]}
   */
  static arrayShuffle (arr) {
    // @ts-ignore
    for (let j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  }

  /** 数组转对象
   *  - 如果有相同ID的字段，改字段的值是一个数组
   * @template T
   * @param {T[]} arr 对象数组
   * @param {string} idFieldName 作为key 的字段名字
   * @return { Record<string, T> } 转换后对象
   */
  static arrayToObject (arr, idFieldName) {
    if ((arr instanceof Array) === false) {
      return {};
    }
    /** @type { Record<string, T> } */
    const ret = {};
    for (const it of arr) {
      // @ts-ignore
      if (it[ idFieldName ] !== undefined) {
        // @ts-ignore
        const key = it[ idFieldName ];
        if (ret[key] === undefined) {
          ret[key] = it;
        } else {
          if (ret[key] instanceof Array) {
            ret[key].push(it);
          } else {
            const tmp = ret[key];
            // @ts-ignore
            ret[key] = [ tmp, it ];
          }
        }
      }
    }

    return ret;
  }

  /** 对象转数组，数组顺序根据arrkey顺序存放
   *  - 如对象 { a: 1, b: 2,c:3 } 转换为数组
   *    ObjectToArray(ob, ['c','b','a']),那么生成的数组顺序按照['c','b','a']顺序存放
   *  - 如果指定了 arr 参数，则只返回arr里有的键
   * @template T
   * 
   * @param {T} ob 要转换的对象
   * @param {string[]?} arr 数组存放顺序
   * 
   * @returns {T[]}
   */
  static objectToArray (ob, arr) {
    const data = [];
    if (arr instanceof Array) {
      for (const id of arr) {
        // @ts-ignore
        const b = ob[id];
        data.push(b ?? null);
      }
    } else {
      for (const k in ob) {
        data.push(ob[k]);
      }
    }

    return data;
  }


/**
 * 
 * @param {string} cmd 
 * @param {string | null} [cwd = null]
 * @returns { Promise< {code:number, data: string, err: string} > }
 */
static runExec(cmd, cwd = null) {
  return new Promise( (resolve, reject) => {
      const opt = {};
      if( typeof cwd === 'string' ) {
          opt.cwd = cwd;
      }

      exec(cmd, opt, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }else {
            resolve( { code: 0, data: stdout, err: stderr} );
        }
      });
  });
}



/**
 * 
 * @param {string} cmd 命令
 * @param {string[]} params 命令参数
 * @param {string} cwd 工作路径
 * @param {Object.<string,string> | undefined | null} [env = null] 环境变量
 * @param {string} filter 过滤字符串
 * @param { {printMsg?: boolean, timeout: number, ignoreExitCode?: boolean}  } opts - 可选参数
 *        - opt.printMsg 过滤字符串,缺省不打印
 *        - timeout 超时，缺省 0, 一直等待，单位 ms
 *        - ignoreExitCode, 如果有过滤并且过滤结果有数据，则忽略进程退出不为0的调用,缺省false
 * @returns { Promise< {code:number, data: string[]} > }
 */
 static runSpawn( cmd, params,cwd, env = null,filter='', opts={printMsg: false,timeout: 0} ) {
    if( typeof(opts) === 'boolean' ) {
      opts = {
        printMsg: opts,
        timeout: 0
      };
    } 

    opts.printMsg = opts?.printMsg ?? false;
    opts.timeout = opts?.timeout ?  Number(opts.timeout) : 0;
    
    let cmdInfo = '';
    if( opts.printMsg === true ) {
      cmdInfo = ( params === undefined )? `. [ ${cmd}]`:`. [ ${cmd} ${params.join(' ')} ]`;
      console.info( cmdInfo );
    }

    let startRec = false;
    return new Promise( (resolve, reject) => {
        const opt = {
          //stdio:'inherit',
        }

        if( env !== undefined && env !== null){
            opt.env = Object.assign({}, g_env, env);
        }

        if( typeof cwd === 'string' ) {
          opt.cwd = cwd;
        }

        const sp = spawn( cmd, params, opt );
        let errMsg = ''
        /** @type {string[]} */
        let outData = [];

        if( opts.timeout > 0 ) {
          setTimeout( () => { sp.kill()  } , opts.timeout )
        }

        sp.stdout.on('data', (data) => {
          const msg = data.toString();

          if( opts.printMsg === true ) {
            console.log( `${cmd} ${msg}` );
          }
          if( filter.length > 0 ) {
            if( msg.indexOf(filter) >= 0 || startRec === true) {
              outData.push( msg );
              startRec = true;
            }
          } else {
            outData.push( msg );
          }
        });

        sp.on('error', (err) => {
            errMsg = `[ ${cmdInfo} ] : ${err}`;
        });

        sp.on('close', (code,signal) => {
            const ignoreErCode = (opts.ignoreExitCode === true) && (filter.length > 0) && (outData.length > 0);

            // 正常退出或者 有过滤，并且过滤的内容 > 1
            if( code === 0 || ignoreErCode === true) {
              if( filter.length > 0 ) {
                resolve( {code: 0, data: [outData.join('')]} );
              } else {
                resolve( {code: 0, data: outData} );
              }
                
            }else{
                if( errMsg === '' ) {
                  if(signal !== null)  {
                    errMsg = `cmd spawn error: timeout signal: ${signal}`;
                  } else {
                    errMsg = `cmd spawn error: ${code}`;
                  }
                }

                reject(errMsg)
            }
        });
    });
  }


  /**
 * 
 * @param {string} cmd 命令
 * @param {string[]} params 命令参数
 * @param {string} cwd 工作路径
 * @param {Record<string,string>} env 环境变量
 * @returns { Promise< {code:number, data: string[]} > }
 */
 static runSpawnStream( cmd, params,cwd, env ) {
    

    return new Promise( (resolve, reject) => {
      /** @type {any} */
      const opt = {
        stdio:'inherit'
      };

      if( env !== undefined ){
          opt.env = Object.assign({}, g_env, env);
      }

      if( typeof cwd === 'string' ) {
        opt.cwd = cwd;
      }

      let errMsg = ''
      const sp = spawn( cmd, params, opt );
      sp.on('error', (err) => {
          let cmdInfo = ( params === undefined )? `[ ${cmd}]` : `[ ${cmd} ${params.join(' ')} ]`;
          errMsg = `[ ${cmdInfo} ] : ${err}`;
      });

      sp.on('close', (code) => {
          if( code === 0 ) {
              resolve({code: 0, data:[]} );
          }else{
              if( errMsg === '' ) {
                  errMsg = `cmd spawn error: exit ${code}`;
              }
              reject(errMsg)
          }
      });
    });
  }
  

  /**
   * 随机指定的范围一个数字
   *
   * @param {number} min -  min
   * @param {number} max - max
   * @param { 1 | 0} [closeFlag=1] -  closeFlag 
   * 
   * @example
   *   
   *  ```js
   *  nnet.rand( 1, 10);    // 可能返回 1 到 10（包含 10）
   *  nnet.rand( 1, 10, 0); // 可能返回 1 到 9（不包含 10）
   *  ```
   * 
   * @endexample
   * 
   * @returns 
   */
  static rand ( min, max, closeFlag = 1 ){
    if( closeFlag === 1 ) {
      return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    } 

    return Math.floor( Math.random() * ( max - min ) ) + min;
  }

  /** 从数组里随机选择一个元素
     *
     * @param {any[]} arr 数组
     * @param {boolean} retIdx 是否返回索引
     * @return { any | {data:any, idx: number} | undefined } 数组元素，数组为空返回 undefined
     *  - retIdx = true， 返回{data:any, idx: number}
     *  - 数组长度0 返回 undefined
     *  - 否则，随机返回数组元素
     */
  static randFromArray (arr, retIdx) {
    const len = arr.length;
    if (len > 0) {
      if (retIdx !== true) {
        return arr[Math.floor(Math.random() * len)];
      }
      const idx = Math.floor(Math.random() * len);
      return { data: arr[idx], idx };

    }
  }


  /** 随机字符串生成
   *
   * @param {number} length 生成的长度
   * @param {number} style 生成样式
   *       - -1, 数字，大小写字母
   *       - 0, 数字
   *       - 1, 小写字母
   *       - 2, 大写字母
   *       - 3, 大小写字母
   *       - 4, 数字，小写字母
   *       - 5, 数字，大写字母
   * @return {string} 随机字符串
   */
  static randomString (length, style = -1) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (style === 0) {
      chars = '0123456789';
    } else if (style === 1) {
      chars = 'abcdefghijklmnopqrstuvwxyz';
    } else if (style === 2) {
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (style === 3) {
      chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (style === 4) {
      chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    } else if (style === 5) {
      chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }


  /** 解码base64字符串
   *
   * @param {string} str base64字符串
   * @param {boolean} isGetReq 字符串是否是通过 get request 传过来的
   * @return {string} 解码后的字符串
   */
  static base64_decode (str, isGetReq = false) {
    if (isGetReq === true) {
      const a = str.replace(new RegExp(' ', 'gm'), '+');
      return Buffer.from(a, 'base64').toString();
    }
    return Buffer.from(str, 'base64').toString();
  }

  /**
   * 
   * @param {string} str - 
   * @returns 
   */
  static base64_url_decode (str) {
    // const a = str.replace(new RegExp(' ', 'gm'), '+');
    const b = str.replace(new RegExp('-_', 'gm'), '+/');
    return Buffer.from(b, 'base64').toString();
  }

  /** 生成字符串的base64编码
   *
   * @param {string} str 原始字符串
   * @return {string} base64字符串
   */
  static base64_encode (str) {
    return Buffer.from(str).toString('base64');
  }


  /** 计算MD5
   *
   * @param {String} str 原始字符串
   * @return {String} MD5
   */
  static md5 (str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  /**
   *
   * @param {string} filePath 文件路径
   * @return {Promise< string >} MD5
   */
  static md5File (filePath) {
    return new Promise((resolve/* , reject*/) => {
      if (fs.existsSync(filePath)) {
        const fsHash = crypto.createHash('md5');
        fsHash.setEncoding('hex');
        const fd = fs.createReadStream(filePath);
        fd.on('end', function () {
          fsHash.end();
          const md5 = fsHash.read();
          resolve(md5);
        });

        fd.pipe(fsHash);
      } else {
        resolve('');
      }
    });
  }

  /**
   * 
   * @param {*} cb - callback function
   * @param {*} caller -  caller
   * @returns 
   */
  static async checkCallCb( cb, caller ){
    if( typeof(cb) === 'function' ) {
        let args = arguments;
        if( args.length > 2 ) {
            let paras = [];
            for(let i=2;i<args.length;i++) {
                paras.push( args[i] );
            }
            return await cb.call(caller, ...paras);
        } else {
            return await cb.call(caller);
        }
    }

    return;
  }

  /** 根据概率区间获取位置
   *
   * @param {number[]} prob 概率数组
   * @returns {number} 中奖位置
   */
  static getAreaByProbability ( prob ) {
    let total = 0;
    for ( const it of prob ) {
      total += it;
    }

    const probT = new Array( prob.length );
    for ( const it in prob ) {
      probT[ it] = prob[it] / total;
    }


    const cntAward = probT.length;
    /** @type { Record< number , [number,number] >} */
    const awardRange = {};
    let idx = 1;
    for ( let i = 0; i < cntAward; i++ ) {
      if ( probT[i] === 0 ) { continue; }
      const min = idx;
      const max = idx + Math.round( probT[i] * 10000 ) - 1;
      awardRange[i] = [ min, max ];
      idx = max + 1;
    }

    let val = 0;
    const rVal = Utils.rand( 1, 10000 );
    for ( const key in awardRange ) {
      const v = awardRange[key];
      if ( rVal >= v[0] && rVal < v[1] ) {
        val = parseInt( key );
        break;
      }
    }

    return val;
  }


  /**
   * 规范路径， 如果指定的路径不满足规范，则使用缺省路径代替
   * 使用缺省路径
   * 
   * @param {string} path 要规范的路径
   * @param {string} defPath 缺省路径, 以 / 开头，windows 会加上 D盘盘符
   * @param {boolean?} make 如果路径不存在是否创建，缺省创建
   * 
   * @returns { {path: string, useDef:boolean }} - path 最后路径， useDef 是否使用了缺省路径
   */
  static normalizePath(path, defPath, make=true) {
    const platform = os.platform();
    const isWinPath = /^([a-zA-Z]:)/.test(path);

    const ret = {
      path: path,
      useDef: false,
    }


    if( platform === 'linux' ) { // 是windows 路径，
        if( isWinPath === true ) {
            // 创建缺省路径
            ret.path = defPath;
            ret.useDef = true;
        }
    }else{ // windows
        if( isWinPath === false ) {
            ret.path = `D:${defPath}`;
            ret.useDef = true;
        }
    }

    if( make === true ) {
      if( !fs.existsSync(ret.path) ) {
        fs.mkdirSync( ret.path, {recursive: true} );
      }
    }

    return ret;
  }

  /** 从指定目录读取文件列表
   * 
   * @param {string} dir 文件目录 
   * @param {string[]} ext 关注的扩展名 
   * @param {RegExp[] } regex 匹配的正则表达式
   * @param {boolean} recursive 是否递归查询, default false
   */
  static async getFileList( dir, ext=[], regex= [], recursive = false ) {
    /** @type {string[]} */
    const ls = [];
    for( let i=0; i<regex.length; i++) {
      let it =  regex[i];
      if( typeof(it) === 'string') {
        regex[i] = new RegExp( it );
      }
    }

    if(fs.existsSync( dir )) {
      const files = await fsP.readdir( dir );
      for( let it of files  ) {
        const filePath = path.join( dir, it );
        const stat = await fsP.stat( filePath );
        if( stat.isDirectory() ) {
          if( recursive === true ) {
            const lsT = await Utils.getFileList( filePath, ext, regex, recursive );
            for(let itT of lsT) {
              ls.push( itT );
            }
          }
        } else {
          const par = path.parse( filePath );
          if( ext.length > 0 ) {
            if( ext.indexOf(par.ext) < 0 ) {
              continue;
            }
          }

          let isMat = (regex.length === 0);
          for( let reg of regex ) {
            if( reg.test( par.name ) ) {
              isMat = true;
              continue;
            }
          }

          if( isMat === true ) {
            ls.push( filePath );
          }
        }
      }
    }
    return ls;
  }


  /**
     * 获取某时间段 CPU 利用率
     * @param { number } interval -[时间段，默认是 1000ms，即 1 秒钟]
     * @returns { Promise<number> }
     */
  static async getCPUUsage(interval) {
    const cpuUsageMS = interval || 1000;
    const t1 = _getCPUInfo(); // t1 时间点 CPU 信息

    await Utils.timeout(cpuUsageMS);

    const t2 = _getCPUInfo(); // t2 时间点 CPU 信息
    const idle = t2.idle - t1.idle;
    const total = t2.total - t1.total;
    let usage = 1 - idle / total;

    return usage;
  }


  /** move file，会删除源文件
   * 
   * @param {string} filePath src file path
   * @param {string} destPath  dst file path
   * @returns { Promise< true | string  >} -- 成功返回true，失败返回string，描述失败原因
   */
  static mv( filePath, destPath )
  {
    return new Promise( (reslove, reject) =>{
      fs.rename(filePath, destPath, function(err) {
        if (!err) {
          reslove( true );
        } else {
          if (err.code !== 'EXDEV') {
            reslove( err.toString() );
          } else {
            fs.copyFile( filePath, destPath, function(err){
              if (!err) {
                fs.unlinkSync( filePath );
                reslove( true );
              } else {
                reslove(err.toString());
              }
            });
          }
        }
      });
    });
  }


  /**
   * 检测指定的文件是否拥有执行权限,如果没有，可以根据bChange参数决定是否设置为可执行权限
   * 
   * @param {string} filePath 要检测的文件
   * @param {boolean} bChange 如果文件没有执行权限，是否更改权限，缺省true，要更改权限 
   * 
   * @returns {Promise<{status:boolean, err?:string}>}
   */
  static checkFileExec( filePath, bChange=true ) {
    return new Promise( (resolve, reject) =>{
      fs.access( filePath,fs.constants.F_OK|fs.constants.X_OK, (err)=>{
          if(err) {
              switch(err.code){
                  case 'ENOENT':
                      resolve( {status: false, err: err.code} );
                  break;
                  case  'EACCES':{
                      if(bChange === true){
                        fs.chmod( filePath, 0o776,(err1)=>{
                            if(err1) {
                                resolve( {status: false, err: err1.code} );
                            } else {
                                resolve( {status:true} );
                            }
                        });                        
                      } else {
                        resolve( {status: false, err: err.code} );
                      }
                  }break;
                  default:
                      resolve({status: false, err: err.code});
                  break;
              } 
          }else{
              resolve( {status:true} );
          }
      });
    });
  }

  /**
   * 二分法，查找并返回最接近的值，需要传入数组为有序数组
   * @template T
   * @param {T[]} arr -- 原数组 
   * @param {number} target -- 目标值
   * @param {string?} field  -- 判断字段名（数组为对象时使用）
   * @param {boolean?} retIdx -- 是否返回索引，缺省不返回
   * @returns {T | {idx:number,val:T}}
   */
  static findNearest(arr,target,field=null, retIdx=false) 
  {
    let mid;
    let l = 0;
    let r = arr.length - 1;
    let idx = -1;
  
    if( field !== null ) {
        while (r - l > 1) {
            mid = Math.floor((l + r) / 2);
            // @ts-ignore
            if (target < arr[mid][field]) {
                r = mid;
            } else {
                l = mid;
            };
        };
        // @ts-ignore
        idx = Math.abs(target - arr[l][field]) <= Math.abs(target - arr[r][field])?l:r;
    } 
    else {
        while (r - l > 1) {
            mid = Math.floor((l + r) / 2);
            // @ts-ignore
            if (target < arr[mid]) {
                r = mid;
            } else {
                l = mid;
            };
        };
        // @ts-ignore
        idx = Math.abs(target - arr[l]) <= Math.abs(target - arr[r]) ? l : r;
    }
  
    if( retIdx === true ) {
      return { idx, val: arr[idx] };
    } else {
      return arr[idx];
    }
  }

  /**
   * 递归删除文件夹
   * 
   * @param {string} path - 删除的文件夹路径 
   */
  static async rmdirRecursive(path)
  {
    if (fs.existsSync(path)) {
      const ls = await fsP.readdir( path );
      for( let file of ls ) {
        const curPath = path + '/' + file;
        const stat = await fsP.lstat(curPath);
        if(stat.isDirectory()) {
          await Utils.rmdirRecursive(curPath);
        } else {
          await fsP.unlink( curPath );
        }
      }
  
      await fsP.rmdir(path);
    }
  }

  /**
   * 扁平化对象
   * @overload
   * @param {Object} obj - 要处理的对象
   * @return { Object } 扁平化后的新对象
   */

  /**
   * 扁平化对象
   * @param {Object} obj - 要处理的对象
   * @param {string} parentKey - 父级键名
   * @param {Object} result - 结果对象
   * @return { Object } 扁平化后的新对象
   */
  static flattenObject(obj, parentKey = '', result = {}) {
    for (const key of Object.keys(obj).sort()) {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // 递归处理嵌套对象
        Utils.flattenObject(value, newKey, result);
      } else if (Array.isArray(value)) {
        // 处理数组，例如 hobbies: ['a', 'b'] => a,b
        result[newKey] = value.join(',');
      } else {
        // 基本类型直接赋值
        result[newKey] = value;
      }
    }

    return result;
  }

  /**
   * 获取对象的 md5 签名
   * - 先会把对象扁平化（排序），再计算签名
   * 
   * @param {object} obj - 要计算签名的对象
   */
  static getObjectSign( obj ) {
    const sortedObj = Utils.flattenObject( obj );
    return crypto.createHash( 'md5' ).update( JSON.stringify( sortedObj ) ).digest( 'hex' );
  }

}


module.exports = Utils;



