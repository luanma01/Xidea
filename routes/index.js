var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/my',(req, res, next)=>{
  res.render('my',{ title: 'My'});
});

router.get('/draw',(req, res, next)=>{
  res.render('draw',{ title: 'Draw'});
});

router.get('/editor',(req, res, next)=>{
  res.render('editor',{ title: 'Editor'});
});

router.get('/editor_demo',(req, res, next)=>{
  res.render('editor_demo',{ title: 'Editor_demo'});
});

module.exports = router;
