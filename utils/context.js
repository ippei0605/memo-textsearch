/**
 * Memo with pager アプリのコンテキスト
 *
 * @module utils/context
 * @author Ippei SUZUKI
 */

// Cloudantサービス名
var CLOUDANT_SERVICE_NAME = 'Cloudant NoSQL DB-cc';

// メモデータベース名
var MEMO_DB_NAME = 'memo';

// 環境変数を取得する。
var appEnv = require('cfenv').getAppEnv();
var cloudantCreds = appEnv.getServiceCreds(CLOUDANT_SERVICE_NAME);

/** 環境変数 */
exports.appEnv = appEnv;

/** メモデータベース名 */
exports.MEMO_DB_NAME = MEMO_DB_NAME;

/** データベース接続 */
exports.cloudant = require('cloudant')(cloudantCreds.url);