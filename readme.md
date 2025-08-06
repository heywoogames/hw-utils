# The hw utils library



# API
* ndate: Date utils Class,
* nnet: Net utils Class,
* utils: misc utils Class


## nnet
* isLocal
* http_get

## ndate
* dateFormat
* dateFormatISO
* dateFormatT
* dateFormatT
* getTimeZoneDiff
* getDayStartTime

* isToday
* getTodayLeftSecond
* dateDiffDay
* getNextDay
* getNextDayStartTimeStamp

* getCurUTCDate
* getCurUTCTime
* getCurUTCDateTime
* getDateTimeByTodayOff
* getNanoSecTime
* getMicroSecTime


## utils
* timeout
* loadFile
* size
* hasChineseChar
* unicodeToUtf8

* arrayDiff
* arrayIntersect
* arrayUnique
* arrayShuffle

* arrayToObject 
* objectToArray

* runExec
* runSpawn
* runSpawnStream

* rand
* randFromArray
* randomString

* md5
* md5File
* base64_encode

* getAreaByProbability 根据概率区间获取位置
* parseProductName 解析产品文件名

* normalizePath 规范路径， 如果指定的路径不满足规范，则使用缺省路径代替
* getFileList 从指定目录读取文件列表

