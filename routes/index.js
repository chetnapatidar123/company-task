var express = require('express');
var router = express.Router();
const User = require("../models/userModel")
const exceljs = require('exceljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage' });
});

router.get('/create-user', function(req, res, next) {
  res.render('CreateUser', { title: 'Create User' });
});

router.post('/create-user', async function(req, res, next) {
   await User.create({
    name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
    status: req.body.status,
    task: req.body.task
  })
  // user.save(user);
  res.redirect('/');
});

router.get('/Viewusers',async function(req, res, next) {
  const data = await User.find({})
  res.render('Viewusers', { title: 'Create User',data });
});

/* GET update page. */
router.get('/update/:id',async function(req, res, next) {
  const data = await User.findByIdAndUpdate(req.params.id)
  console.log(data)
   res.render('Update', {id:req.params.id,data});
 });

 router.post("/createupdate/:id",async function(req, res, next){
    
  console.log(req.body)
  const data = await User.findByIdAndUpdate(req.params.id ,{name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
    status: req.body.status,
    task: req.body.task});
  await data.save()
  res.redirect("/Viewusers");
 
    
  });

  router.get("/delete/:id", async function(req, res, next) {
    const data = await User.findByIdAndDelete(req.params.id, req.body)
    // res.status(200).warn();({message : "User was deleted successfully!"})
    res.redirect("/Viewusers");
  });

  router.get("/exportuser",async function (req,res,next){
    try {
        
      const workbook = new exceljs.Workbook()
      const worksheet = workbook.addWorksheet('all users')

      worksheet.columns = [
          {header:'s no',key:'s_no'},
          {header:"Name",key:"name"},
          {header:"email id ",key:"email"},
          {header:"mobile",key:"mobile"},
          {header:"status",key:"status"},
          {header:"task",key:"task"}
      ]

      let counter = 1
      const userData = await User.find({id:req.params.id})

      userData.forEach((user)=>{
          user.s_no = counter;
          worksheet.addRow(user);
          counter++;
      })

      worksheet.getRow(1).eachCell((cell)=>{
          cell.font={bold:true}
      })

      res.setHeader(
          'Content-Type',
          "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
      )

      res.setHeader('Content-Disposition',`attachment; filename=users.xlsx`)

      return workbook.xlsx.write(res).then(()=>{
          res.status(200)
      })

  } catch (error) {
      console.log(error.message)
  }
  })



module.exports = router;
