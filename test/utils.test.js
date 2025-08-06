const yw = require('../index');
const { test, describe, it } = require('node:test');
const assert = require('node:assert');

console.log("Test run in:", new Date() );
console.log("Test run ip:", yw.nnet.localIp() );

test('utils.timeout', async() => {
    const sTime = Date.now();
    await yw.utils.timeout(1000);
    const useTime = Date.now() - sTime;
    console.log(`utils.timeout use: ${useTime} ms`);
    assert.equal( useTime > 999 && useTime < 1010, true );
});

test('utils.size', async() => {
    const size = yw.utils.size({a:1, b:false});
    assert.equal( size, 2 );
});

test('utils.hasChineseChar', async() => {
    assert.equal( yw.utils.hasChineseChar('11你好22'), true );
});

// test('utils.unicodeToUtf8', async() => {
//     assert.equal( yw.utils.unicodeToUtf8('11你好22'), true );
// });

test('utils.arrayDiff', async() => {
    assert.deepStrictEqual( yw.utils.arrayDiff(['a','b'],['a','v']), ['b'] );
});

test('utils.arrayDiff', async() => {
    assert.deepStrictEqual( yw.utils.arrayDiff(['a','b'],['a','v']), ['b'] );
});

test('utils.arrayIntersect', async() => {
    assert.deepStrictEqual( yw.utils.arrayIntersect(['a','b'],['a','v']), ['a'] );
});

test('utils.arrayUnique', async() => {
    assert.deepStrictEqual( yw.utils.arrayUnique(['a','b','a','v']).sort(), ['a','b','v'] );
});

// test('utils.arrayShuffle', async() => {
//     assert.deepStrictEqual( yw.utils.arrayShuffle(['a','b','a','v']), true );
// });

test('utils.flattenObject', async() => {
    assert.deepStrictEqual( yw.utils.flattenObject({
        a: {a:{a: 1}, b:2}, c:3
    }), {
        'a.a.a': 1,
        'a.b': 2,
        'c': 3
    });
});

test('utils.getObjectSign', async() => {
    assert.deepStrictEqual( yw.utils.getObjectSign({
        a: {a:{a: 1}, b:2}, c:3
    }), 'f2ebff651a2d22b5a4c8a47819bc7d45');
});

describe('encode/decode', () => {
    test('base64_encode', () => {
        assert.strictEqual( yw.utils.base64_encode('111111'), 'MTExMTEx');
    });
    test('base64_decode', () => {
        assert.strictEqual( yw.utils.base64_decode('MTExMTEx'), '111111');
    });
    
    test('md5', () => {
        assert.strictEqual( yw.utils.md5('111111'), '96e79218965eb72c92a549dd5a330112');
    });

    test('md5File', async () => {
      const v = await yw.utils.md5File('./test/example.json');
      assert.strictEqual( v, 'd97231b025ab59b1beb377c9b386d348');
    });
});

describe('spawn', () => {

  test.skip('runExec', () => {
    assert.strictEqual( yw.utils.runExec('ping 127.0.0.1 -n 1'), 'AaWvq');
  });


  test.skip('runSpawn', () => {
    assert.strictEqual( yw.utils.runSpawn('ping', ['127.0.0.1', '-t'], '', undefined,'',{
        printMsg: true,
        timeout: 5000
    }), 'AaWvq');
  });
});

describe('rand', () => {
  test.skip('randomString', () => {
    assert.strictEqual( yw.utils.randomString(6,4), 'AaWvq');
  });

  test.skip('randFromArray', () => {
    assert.strictEqual( yw.utils.randFromArray( [{id:0, val: 'te' },{id:1, val: 'te2' }], false), {id:1, val: 'te2' });
  });

  test('rand', () => {
    const v = yw.utils.rand(4,6);
    assert.strictEqual( v>=4 && v<=6, true );
  });

  test('getAreaByProbability', () => {
    const v = yw.utils.getAreaByProbability([10,10,10,10,10]);
    assert.strictEqual( v >=0 && v <= 4, true );
  });

});


const testDate = new Date('2025-08-03T08:00:00Z');
const testTm = testDate.getTime();
const testTmSec = Math.trunc( testDate.getTime() );

describe('日期测试', () => {
   test.skip( 'ndate.dateFormat', () => {
      assert.strictEqual( yw.ndate.dateFormat(testDate), '2025-08-03 08:00:00' );
   });

   test( 'ndate.dateFormatISO', () => {
      assert.strictEqual( yw.ndate.dateFormatISO(testDate), '2025-08-03 08:00:00' );
   });

   test( 'ndate.dateFormatT', () => {
      assert.strictEqual( yw.ndate.dateFormatT(true, testDate), '2025-08-03 08:00:00' );
   });

   test.skip( 'ndate.dateFormatT', () => {
      assert.strictEqual( yw.ndate.dateFormatT(false, testDate), '2025-08-03 08:00:00' );
   });

   test.skip( 'ndate.getTimeZoneDiff', () => {
      assert.strictEqual( yw.ndate.getTimeZoneDiff(), 8 );
   });

   test( 'ndate.isToday', () => {
      assert.strictEqual( yw.ndate.isToday( Math.trunc(Date.now() / 1000), true ), true );
   });

   test( 'ndate.isToday', () => {
      assert.strictEqual( yw.ndate.isToday(testTmSec, false), false );
   });

});


describe('nnet', () => {
  test( 'nnet.isLocal', () => {
    assert.strictEqual( yw.nnet.isLocal('127.0.0.1'), true );
  });

  test( 'nnet.isLocal', () => {
    assert.strictEqual( yw.nnet.isLocal('8.8.8.81'), false );
  });
  
  test( 'nnet.localIp', () => {
    const localIp = yw.nnet.localIp();
    assert.strictEqual( yw.nnet.isLocal(localIp), true );
  });

  test.skip( 'nnet.http_get', () => {
  });

  test.skip( 'nnet.http_post', () => {
  });

  test.skip( 'nnet.https_post_byProxy', () => {
  });
});



