//usage: node server.js -l to run on local server
//usage: node server.js to run on azure server

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';

//Tons of stuff from the other files
import {connect, closeConnection, reopenConnection, testQuery} from './sqlconnect.js';
import { getUniClassTypes, getUserRequests, getUniversities, getClassInfo, getClassesByUniAndType, getAllClassesByUni, getProfessorsByClassID, getProfessorsAtUni, getPostersByClassID, getUserInfo, getClassRatings} from './sqlquery.js'
import { addUniversity, addClassType, addComment, addClass, addDifficulty, addProfessor, addUser, addRequest } from './sqladd.js';
import { deleteRequest, deleteUniversity, deleteClassType, deleteComment, deleteClass, deleteDifficulty, deleteProfessor, deleteUser } from './sqldelete.js';
// import { pool } from 'mssql';
import pkg from 'mssql';
const { pool } = pkg;

const app = express();

const port = process.env.PORT || 7071;

app.use(express.json());
app.use(cors());

const local_connect = process.argv[2] === '-l' ? true : false;

let poolConnection = await connect(local_connect);
let lastActivity = Date.now();
const inactivityTime = 60 * 1000 * 10; // 10 minutes

// Code used for testing the add and delete functions in the database
// Schedule cron job to close connection after 10 minutes of inactivity
cron.schedule('*/10 * * * *', () => {
    console.log('Checking for inactivity ' + (Date.now() - lastActivity) / 1000);
    if ((Date.now() - lastActivity) >= inactivityTime) {
        closeConnection(poolConnection);
        console.log('Connection closed due to inactivity');
    }
});

app.get('/universities', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getUniversities(poolConnection);
    res.json(record);
});

app.get('/uni/:uniID/allclasses', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getAllClassesByUni(poolConnection, req.params.uniID);
    res.json(record);
});

// Gets all class info and comments for a specific class at a specific university
app.get('/uni/:uniID/class/:classID', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getClassInfo(poolConnection, req.params.classID, req.params.uniID);
    res.json(record);
});
app.get('/uni/:uniID/class/:classID/ratings', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getClassRatings(poolConnection, req.params.classID, req.params.uniID);
    res.json(record);
});

// Gets all professors who have been known to teach a specific class
app.get('/class/:classID/allprofessors', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getProfessorsByClassID(poolConnection, req.params.classID);
    res.json(record);
});

//Get all users who have posted a comment on a specific class
app.get('/class/:classID/allposters', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getPostersByClassID(poolConnection, req.params.classID);
    res.json(record);
});

// Gets all professors under a specific university
app.get('/uni/:uniID/allprofessors', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getProfessorsAtUni(poolConnection, req.params.uniID)
    res.json(record);
});


//Gets list of classes for a specific university and class type
app.get('/uni/:uniID/classtype/:classTypeID/classes', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getClassesByUniAndType(poolConnection, req.params.uniID, req.params.classTypeID);
    res.json(record);
});

app.get('/:email/userInfo', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getUserInfo(poolConnection, req.params.email, req.params.userName);
    res.json(record);
});

//Adds and deletes
app.post('/adduni', async (req, res) => {
    await reopenConnection(poolConnection);
    console.log("Adduni Called")
    lastActivity = Date.now();
    let record = await addUniversity(poolConnection, req.body.uniName);
    res.json(record);
});

app.post('/addclasstype', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addClassType(poolConnection, req.body.classType, req.body.uniID,);
    res.json(record);
});



app.post('/addcomment', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addComment(poolConnection, req.body.userID, req.body.comment, req.body.termTaken, req.body.grade, req.body.classID, req.body.difficultyValue, req.body.qualityValue, req.body.professorID);
    res.json(record);
});

app.post('/addclass', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addClass(poolConnection, req.body.className, req.body.classNum, req.body.classTypeID);
    res.json(record);
});

app.post('/addprofessor', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addProfessor(poolConnection, req.body.name, req.body.uniID);
    res.json(record);
});

app.post('/adduser', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addUser(poolConnection, req.body.email, req.body.uniID, req.body.userName);
    res.json(record);
});

app.delete('/deleteuni', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteUniversity(poolConnection, req.body.uniID);
    res.json(record);
});

app.delete('/deleteclasstype', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteClassType(poolConnection, req.body.classTypeID);
    res.json(record);
});

app.delete('/deletecomment', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteComment(poolConnection, req.body.commentID);
    res.json(record);
});

app.delete('/deleteclass', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteClass(poolConnection, req.body.classID);
    res.json(record);
});

app.delete('/deleteprofessor', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteProfessor(poolConnection, req.body.professorID);
    res.json(record);
});

app.delete('/deleteuser', async (req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteUser(poolConnection, req.body.userID);
    res.json(record);
});


app.listen(port, () => {
    console.log('Server is running on port ' + port);
});


app.get('/activity', async (req, res) => {
    res.json({'Time inactive (minutes)': ((Date.now() - lastActivity) / 1000 / 60).toFixed(3)});
});

app.post('/addrequest', async(req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await addRequest(
        poolConnection,
        req.body.userName,
        req.body.userEmail,
        req.body.uniID,
        req.body.classID,
        req.body.classType,
        req.body.classNumber,
        req.body.userID,
        req.body.professorID,
        req.body.universityName,
        req.body.professorName,
        req.body.className,
        req.body.classTypeID,
        req.body.comment,
        req.body.termTaken,
        req.body.grade,
        req.body.difficultyValue,
        req.body.qualityValue,
        req.body.year
    );
    res.json(record);
})

app.get('/requests', async(req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await getUserRequests(
        poolConnection,
        req.body.userName,
        req.body.uniID,
        req.body.classID,
        req.body.userID,
        req.body.professorID,
        req.body.universityName,
        req.body.professorName,
        req.body.className,
        req.body.classNumber,
        req.body.classTypeID,
        req.body.comment,
        req.body.termTaken,
        req.body.grade,
        req.body.difficultyValue,
        req.body.qualityValue,
        req.body.year
    )
    res.json(record)
})

app.delete('/removerequest', async(req, res) => {
    await reopenConnection(poolConnection);
    lastActivity = Date.now();
    let record = await deleteRequest(poolConnection, req.body.requestID);
    res.json(record);
})

app.get('/:UniID/classTypes', async(req, res) => {
    await reopenConnection(poolConnection)
    lastActivity = Date.now();
    let record = await getUniClassTypes(
        poolConnection, 
        req.params.UniID,
        req.params.ClassType,
        req.params.ClassTypeID
    )
    res.json(record)
})