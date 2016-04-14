/**
 * Memo with Text Search アプリのルーティング
 *
 * @module routes/index
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('../utils/context');
var memo = require('../models/memo');

// package.json を読込む。(version、description の値をメモ一覧で使用するため)
var packageJson = require('../package.json');

/** メモ一覧を表示する。 */
exports.list = function(req, res) {
	var q = req.query.q;
	console.log('### q=' + q);

	if (typeof q === 'undefined' || q === '') {
		memo.list(function(err, body) {
			res.render('index', {
				"packageJson" : packageJson,
				"q" : "",
				"list" : body.rows
			});
		});
	} else {
		memo.search(q, function(err, body) {
			res.render('index', {
				"packageJson" : packageJson,
				"q" : q,
				"list" : body.rows
			});
		});
	}
};

/** メモをDBに新規作成して、メモ一覧を表示する。 */
exports.create = function(req, res) {
	var doc = {
		"content" : req.body.content,
		"updatedAt" : req.body.updatedAt
	};
	memo.save(doc, function() {
		res.redirect('/');
	});
};

/** メモをDBに更新して、メモ一覧を表示する。 */
exports.update = function(req, res) {
	var doc = {
		"_id" : req.params._id,
		"_rev" : req.params._rev,
		"content" : req.body.content,
		"updatedAt" : req.body.updatedAt
	};
	memo.save(doc, function() {
		res.redirect('/');
	});
};

/** メモをDBから削除して、現在のページのメモ一覧を表示する。 */
exports.remove = function(req, res) {
	memo.remove(req.params._id, req.params._rev, function() {
		res.redirect('/');
	});
};