const express = require('express')
require('dotenv').config()
const router = express.Router()
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const upload = require('express-fileupload')
const { log } = require('console')
const publicpath = path.join(__dirname,'public')
router.use(upload())


function authenticateTOKEN(req,res,next){
    const token = req.cookies.token
    // const token = authHeader && authHeader.split(' ')[1]
    // console.log(authHeader)
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


router.get('/', (req, res) => {
    const file = path.resolve(publicpath, 'menu.pdf');
    const template = fs.readFileSync(path.resolve(publicpath, 'template.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(template);
});



router.get('/login', (req,res)=>{
    res.sendFile(`${publicpath}/login.html`)
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
})



router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const usern = fs.readFileSync('username.txt', 'utf-8').trim();
        const userp = fs.readFileSync('pass.txt', 'utf-8').trim();

        if (username !== usern || password !== userp) {
            res.sendStatus(406);
            return;
        }

        const user = { name: usern };
        const accessToken = jwt.sign(user, process.env.ACCES_TOKEN_SECRET, { expiresIn: '1m' });
        console.log(req.url);

        res.cookie('token', accessToken, { httpOnly: true, maxAge: 5*1000 }).sendStatus(200);
        } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Server error');
    }
});


router.get('/admin',authenticateTOKEN, async(req,res)=>{
    res.sendFile(`${publicpath}/admin.html`)
})


router.post('/upload_pdf', async (req, res) => {
    if (req.files && req.files.pdfUpload) {
        console.log(req.files.pdfUpload);
        const pdfFile = req.files.pdfUpload; // Accessing the specific uploaded PDF file

        pdfFile.mv('./public/' + 'menu.pdf', function (err) {
            if (err) {
                res.status(500).send(err); // Sending an appropriate error response
            } else {
                res.send("Uploaded successfully");
            }
        });
    } else {
        res.status(400).send("No PDF file uploaded");
    }
});


router.post('/change_user_settings', async (req, res) => {
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    try{
    fs.writeFileSync('username.txt', newUsername, 'utf-8')
    fs.writeFileSync('pass.txt', newPassword, 'utf-8')
    res.send("Updated succesfully")
}catch(err){console.log(err);}
})
module.exports = router