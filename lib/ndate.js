"use strict";


class NDate {

  /** 获取 本地 日期时间字符串
   *
   * @param {Date} date Date Object
   * @param {boolean} ms 是否显示毫秒, 缺省 false
   * @param {string} sp 分隔符 '' | '-' | 'ISO'
   *    - '' 空字符串 缺省
   *    - '-' 日期用 - 链接
   *    - '/' 日期用 / 链接
   *    - 'ISO' ISO格式
   *
   * @return {string} 格式化后的字符串
   */
  static getLocaleDateTimeString (date, ms = false, sp = '') {
    let curMonth = (date.getMonth() + 1);
    if (curMonth < 10) { curMonth = '0' + curMonth; }

    let curDay = date.getDate();
    if (curDay < 10) { curDay = '0' + curDay; }

    let curHour = date.getHours();
    if (curHour < 10) { curHour = '0' + curHour; }

    let curMin = date.getMinutes();
    if (curMin < 10) { curMin = '0' + curMin; }

    let curSec = date.getSeconds();
    if (curSec < 10) { curSec = '0' + curSec; }

    let curMs = '';
    if (ms === true) {
      curMs = date.getMilliseconds();
      if (sp !== '') {
        curMs = '.' + curMs;
      }
    }

    const curYear = date.getFullYear();

    switch (sp) {
    case '':
      return `${curYear}${curMonth}${curDay}${curHour}${curMin}${curSec}${curMs}`;
    case 'ISO':
      return `${curYear}-${curMonth}-${curDay}T${curHour}:${curMin}:${curSec}${curMs}Z`;
    default:
      return `${curYear}${sp}${curMonth}${sp}${curDay} ${curHour}:${curMin}:${curSec}${curMs}`;
    }
  }

  /** 获取 本地 日期时间字符串
   *
   * @param {Date} date Date Object
   * @param {string} sp 日期分隔符, 缺省 '-'
   * @return {string} 格式化后的字符串
   */
  static getLocaleDateString (date, sp = '-') {
    let curMonth = (date.getMonth() + 1);
    if (curMonth < 10) { curMonth = '0' + curMonth; }

    let curDay = date.getDate();
    if (curDay < 10) { curDay = '0' + curDay; }

    return `${date.getFullYear()}${sp}${curMonth}${sp}${curDay}`;
  }

  /** 获取 本地 时间字符串
   *
   * @param {date} date Date Object
   * @param {boolean} ms 是否显示毫秒, 缺省 false
   * @param {string} sp 分隔符 '' |'ISO'
   *    - '' 空字符串
   *    - 'ISO' ISO格式
   * @return {string} 格式化后的字符串
   */
  static getLocaleTimeString (date, ms = false, sp = ':') {
    let curHour = date.getHours();
    if (curHour < 10) { curHour = '0' + curHour; }

    let curMin = date.getMinutes();
    if (curMin < 10) { curMin = '0' + curMin; }

    let curSec = date.getSeconds();
    if (curSec < 10) { curSec = '0' + curSec; }

    let curMs = '';
    if (ms === true) {
      curMs = date.getMilliseconds();
      if (sp !== '') {
        curMs = '.' + curMs;
      }
    }

    return `${curHour}${sp}${curMin}${sp}${curSec}${curMs}`;
  }


  /** 获取 ISO 日期时间字符串
   *
   * @param {Date} date Date Object
   *
   * @param {string} sp 日期分隔符, 缺省 '-'

   * @return {string} 格式化后的字符串
   */
  static getISODateString (date, sp = '-') {
    let curMonth = (date.getUTCMonth() + 1);
    if (curMonth < 10) { curMonth = '0' + curMonth; }

    let curDay = date.getUTCDate();
    if (curDay < 10) { curDay = '0' + curDay; }

    return `${date.getUTCFullYear()}${sp}${curMonth}${sp}${curDay}`;
  }

  /** 获取 ISO 日期时间字符串
   *
   * @param {date} date Date Object
   * @param {boolean} ms 是否显示毫秒, 缺省 false
   * @param {string} sp 分隔符 '' |'ISO', 缺省 ':'
   *    - '' 空字符串
   *    - 'ISO' ISO格式
   * @return {string} 格式化后的字符串
   */
  static getISOTimeString (date, ms = false, sp = ':') {
    let curHour = date.getUTCHours();
    if (curHour < 10) { curHour = '0' + curHour; }

    let curMin = date.getUTCMinutes();
    if (curMin < 10) { curMin = '0' + curMin; }

    let curSec = date.getUTCSeconds();
    if (curSec < 10) { curSec = '0' + curSec; }

    let curMs = '';
    if (ms === true) {
      curMs = date.getUTCMilliseconds();
      if (sp !== '') {
        curMs = '.' + curMs;
      }
    }

    return `${curHour}${sp}${curMin}${sp}${curSec}${curMs}`;
  }

  /** 获取 ISO 日期时间字符串
   *
   * @param {Date} date Date Object
   * @param {boolean} ms 是否显示毫秒, 缺省 false
   * @param {string} sp 分隔符 '' | '-' | 'ISO'
   *    - '' 空字符串, 缺省
   *    - '-' 日期用 - 链接
   *    - '/' 日期用 / 链接
   *    - 'ISO' ISO格式
   *
   * @return {string} 格式化后的字符串
   */
  static getISODateTimeString (date, ms = false, sp = '') {
    let curMonth = (date.getUTCMonth() + 1);
    if (curMonth < 10) { curMonth = '0' + curMonth; }

    let curDay = date.getUTCDate();
    if (curDay < 10) { curDay = '0' + curDay; }

    let curHour = date.getUTCHours();
    if (curHour < 10) { curHour = '0' + curHour; }

    let curMin = date.getUTCMinutes();
    if (curMin < 10) { curMin = '0' + curMin; }

    let curSec = date.getUTCSeconds();
    if (curSec < 10) { curSec = '0' + curSec; }

    let curMs = '';
    if (ms === true) {
      curMs = date.getUTCMilliseconds();
      if (sp !== '') {
        curMs = '.' + curMs;
      }
    }

    const curYear = date.getUTCFullYear();

    switch (sp) {
    case '':
      return `${curYear}${curMonth}${curDay}${curHour}${curMin}${curSec}${curMs}`;
    case 'ISO':
      return `${curYear}-${curMonth}-${curDay}T${curHour}:${curMin}:${curSec}${curMs}Z`;
    default:
      return `${curYear}${sp}${curMonth}${sp}${curDay} ${curHour}:${curMin}:${curSec}${curMs}`;
    }
  }


  /**
   * 格式化日期字符串,本地时间
   * @param {Date | number | string} dateObj Date 对象 或者 时间戳
   * @param {String} fmt 格式化字符串 默认 'yyyy-MM-dd hh:mm:ss'
   * @returns {String}
   */
  static dateFormat ( dateObj = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss' ) {
    if ( dateObj instanceof Date === false ) {
      dateObj = new Date( dateObj );
    }
  
    if ( fmt === 'yyyy-MM-dd hh:mm:ss' ) {
      return NDate.getLocaleDateTimeString( dateObj, false, '-' );
    } else if ( fmt === 'yyyy-MM-dd' ) {
      return NDate.getLocaleDateString( dateObj );
    }
  
    const o = {
      'M+': dateObj.getMonth() + 1, // 月份
      'd+': dateObj.getDate(), // 日
      'h+': dateObj.getHours(), // 小时
      'm+': dateObj.getMinutes(), // 分
      's+': dateObj.getSeconds(), // 秒
      'q+': Math.floor( ( dateObj.getMonth() + 3 ) / 3 ), // 季度
      S: dateObj.getMilliseconds(), // 毫秒
    };
  
    let reY = fmt.match(/(y+)/);
    if(reY !== null) {
        fmt = fmt.replace( reY[1],
            ( dateObj.getFullYear() + '' ).substring( 4 - reY[1].length )
        );
    }
    for ( const k in o ) {
      const re = new RegExp( '(' + k + ')' );
        let m = fmt.match(re);
        if( m !== null ) {
            fmt = fmt.replace( m[1],
                m[1].length === 1 ? o[k] : ( '00' + o[k] ).substring( ( '' + o[k] ).length )
            );
        }
    }
    return fmt;
  }

  /**
   * 格式化日期字符串,UTC时间
   * @param {Date | number | string} dateObj Date 对象 或者 时间戳
   * @param {String} fmt 格式化字符串 默认 'yyyy-MM-dd hh:mm:ss'
   * @returns {String}
   */
  static dateFormatISO ( dateObj = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss' ) {
    if ( dateObj instanceof Date === false ) {
      dateObj = new Date( dateObj );
    }
  
    if ( fmt === 'yyyy-MM-dd hh:mm:ss' ) {
      return NDate.getISODateTimeString( dateObj, false, '-' );
    } else if ( fmt === 'yyyy-MM-dd' ) {
      return NDate.getISODateString( dateObj );
    }
  
    const o = {
      'M+': dateObj.getUTCMonth() + 1, // 月份
      'd+': dateObj.getUTCDate(), // 日
      'h+': dateObj.getUTCHours(), // 小时
      'm+': dateObj.getUTCMinutes(), // 分
      's+': dateObj.getUTCSeconds(), // 秒
      'q+': Math.floor( ( dateObj.getUTCMonth() + 3 ) / 3 ), // 季度
      S: dateObj.getUTCMilliseconds(), // 毫秒
    };
  
    let reY = fmt.match(/(y+)/);
    if(reY !== null) {
        fmt = fmt.replace( reY[1],
            ( dateObj.getFullYear() + '' ).substring( 4 - reY[1].length )
        );
    }
    for ( const k in o ) {
      const re = new RegExp( '(' + k + ')' );
      let m = fmt.match(re);
      if( m !== null ) {
          fmt = fmt.replace( m[1],
              m[1].length === 1 ? o[k] : ( '00' + o[k] ).substring( ( '' + o[k] ).length )
          );
      }
    }
    return fmt;
  }
  
  
  /**
   * 格式化日期字符串,UTC时间
   * @param {boolean} isUtc utc is true
   * @param {Date | number | string} dateObj Date 对象 或者 时间戳
   * @param {string} fmt 格式化字符串 默认 'yyyy-MM-dd hh:mm:ss'
   * @returns {string}
   */
  static dateFormatT ( isUtc, dateObj = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss' ) {
    if ( isUtc === true ) {
      return NDate.dateFormatISO( dateObj, fmt );
    }
  
    return NDate.dateFormat( dateObj, fmt );
  }
  
  /**
   * 获取本地时间和UTC时间的时间差，小时 
   * @returns {number}
   */
  static getTimeZoneDiff () {
    let date = new Date();
    let curMonth = ( date.getMonth() + 1 );
    if ( curMonth < 10 ) { curMonth = '0' + curMonth; }
  
    let curDay = date.getDate();
    if ( curDay < 10 ) { curDay = '0' + curDay; }
  
    let curHour = date.getHours();
    if ( curHour < 10 ) { curHour = '0' + curHour; }
  
    let curMin = date.getMinutes();
    if ( curMin < 10 ) { curMin = '0' + curMin; }
  
    let curSec = date.getSeconds();
    if ( curSec < 10 ) { curSec = '0' + curSec; }
  
    const curYear = date.getFullYear();
    const t = `${curYear}-${curMonth}-${curDay}T${curHour}:${curMin}:${curSec}Z`;
    const date1 = new Date( t );
    const diff = date1.getTime() - date.getTime();
    return Math.ceil( diff / 1000 / 3600 );
  }

  /** 时间戳是不是当天的
   *
   * @param {number} tm 时间戳，秒
   * @param { boolean } isISO 是否ISO
   *
   * @return {boolean} true,是当天
   */
  static isToday (tm, isISO) {
    const sTime = NDate.getDayStartTime(new Date(), isISO);
    return (tm >= sTime && tm < (sTime + 86400));
  }

  /** 获取今天剩余的时间
   * @param {boolean} isISO 是否是ISO
  */
  static getTodayLeftSecond (isISO = true) {
    const curTm = Date.now();
    return NDate.getNextDayStartTimeStamp(curTm, isISO) - Math.floor(curTm / 1000);
  }
  
  /** 时间与时间差（天数）
   * @param {Date} timeStamp0 时间戳
   * @param {Date} timeStamp1 基准时间戳,缺省表示获取今天的时间戳
   * @param {boolean} isISO 返回 UTC 相差天数
   * @return {Number} 相差的天数
   */
  static dateDiffDay (timeStamp0, timeStamp1 = 0, isISO = true) {
    let time0 = null;
    let time1 = null;
    const type0 = typeof timeStamp0;
    if (type0 === 'string' || type0 === 'number') {
      time0 = NDate.getDayStartTime(timeStamp0, isISO);
    } else {
      time0 = NDate.getDayStartTime(timeStamp0.getTime(), isISO);
    }

    if (timeStamp1 === 0) {
      time1 = NDate.getDayStartTime(Date.now(), isISO);
    } else {
      const type1 = typeof timeStamp1;
      if (type1 === 'string' || type1 === 'number') {
        time1 = NDate.getDayStartTime(timeStamp1, isISO);
      } else {
        time1 = NDate.getDayStartTime(timeStamp1.getTime(), isISO);
      }
    }
    const diff = time0 - time1;
    return Math.floor(diff / 86400);
  }

  /** 获取指定日期的下一天
   * @param {Date|String|number} day Date对象，日期字符串或者时间戳
   * @return {Date} 下一天
   */
  static getNextDay (day) {
    const dateCur = new Date(day);
    const dayNext = new Date(dateCur);
    dayNext.setUTCDate(dayNext.getUTCDate() + 1);
    return dayNext;
  }


  /** 获取指定日期下一天的时间戳
   * @param {Date|String|number} day Date对象，日期字符串或者时间戳
   * @param {boolean} isISO 是否是ISO
   * @return {number} 下一天0秒时间戳
   */
  static getNextDayStartTimeStamp (day, isISO = true) {
    const dayNext = new Date(day);
    if (isISO === true) {
      dayNext.setUTCDate(dayNext.getUTCDate() + 1);
      return NDate.getDayStartTime(dayNext, isISO);
    }

    // 本地时间
    dayNext.setDate(dayNext.getDate() + 1);
    return NDate.getDayStartTime(dayNext, isISO);
  }

  /** 获取指定日期开始时间戳
   * @param {Date|String|number} date Date对象，日期字符串或者时间戳
   * @param { boolean } isISO 是否ISO
   * @return {number} 下一天0秒时间戳, 秒
   */
  static getDayStartTime (date, isISO) {
    let dateCur = date;
    if ((date instanceof Date) === false) {
      dateCur = new Date(date);
    }

    const curTime = Math.floor(dateCur.getTime() / 1000);

    const h = (isISO) ? dateCur.getUTCHours() : dateCur.getHours();
    const m = (isISO) ? dateCur.getUTCMinutes() : dateCur.getMinutes();
    const s = (isISO) ? dateCur.getUTCSeconds() : dateCur.getSeconds();
    return curTime - (h * 3600 + m * 60 + s);
  }


  /** 获取当前UTC日期字符串 */
  static getCurUTCDate () {
    return NDate.dateFormatISO(new Date(), 'yyyy-MM-dd');
  }

  /** 获取当前UTC时间字符串 */
  static getCurUTCTime () {
    return NDate.dateFormatISO(new Date(), 'hh:mm:ss');
  }

  /** 获取当前UTC日期 时间字符串 */
  static getCurUTCDateTime () {
    return NDate.dateFormatISO(new Date(), 'yyyy-MM-dd hh:mm:ss');
  }

  /** 获取当前时间偏移指定秒数的时间
   * @param {Number} secondOff 偏移秒数
   * @param {String} fmt 日期格式化字符串
   * @return {String} 日期字符串
   */
  static getDateTimeByTodayOff (secondOff = 0,isISO = false, fmt = 'yyyy-MM-dd hh:mm:ss') {
    const tm = Date.now() + secondOff * 1000; // 3600 * 24 * 1000;
    return (isISO === true)?NDate.dateFormatISO(tm, fmt) : NDate.dateFormat(tm, fmt);
  }

  static getNanoSecTime () {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
  }

  static getMicroSecTime () {
    const hrTime = process.hrtime();
    return Math.floor((hrTime[0] * 1000000000 + hrTime[1]) / 1000);
  }

}






module.exports = NDate;



