const fs=require('fs');
const mongoose=require('mongoose');
const { mongoURI } = require('./config/dev');
const excelToJson = require('convert-excel-to-json');
const Student = require('./model/student');
// const result = excelToJson({
//     sourceFile: 'Dummy.xlsx'
// });
// console.log(JSON.stringify(result, null,"\t"));
mongoose.connect(mongoURI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});
const students= JSON.parse(fs.readFileSync(`${__dirname}/data/student.json`, 'utf-8'));
const importData=async()=>{
    try{
    await Student.insertMany(students);
    console.log('Data Imported ...');
    process.exit();
    }catch(err){
    console.log(err);
    }
}
const deletetData=async()=>{
    try{
    await Student.deleteMany();
    console.log('Data Destroyed ...');
    process.exit();
    }catch(err){
    console.log(err);
    }
}
if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deletetData();
}
